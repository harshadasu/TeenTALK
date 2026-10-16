const { CRISIS_HOTLINES } = require('../config/constants');
const { logAuditEvent } = require('../middleware/audit');
const env = require('../config/env');

// ─── Crisis / Unsafe patterns ─────────────────────────────────────────────────
const CRISIS_PATTERNS = [
  /suicid/i, /kill\s+myself/i, /hurt\s+myself/i, /end\s+my\s+life/i,
  /want\s+to\s+die/i, /cutting\s+myself/i, /overdose/i,
  /beating\s+me/i, /abuse\s+at\s+home/i, /sexual\s+assault/i, /molest/i,
];

const UNSAFE_INSTRUCTION_PATTERNS = [
  /how\s+to\s+hack/i, /make\s+a\s+bomb/i, /buy\s+drugs/i,
  /steal\s+passwords/i, /bypass\s+parental\s+control/i, /doxx/i,
];

const MEDICAL_LEGAL_PATTERNS = [
  /diagnose\s+me/i, /prescribe\s+medicine/i, /what\s+pills\s+to\s+take/i,
  /legal\s+contract/i, /lawsuit\s+advice/i,
];

// ─── Gemini client (lazy-initialized) ────────────────────────────────────────
let geminiModel = null;

const getGeminiModel = () => {
  if (geminiModel) return geminiModel;
  if (!env.GEMINI_API_KEY) return null;
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini AI model initialized successfully.');
    return geminiModel;
  } catch (err) {
    console.warn('⚠️ Gemini initialization failed:', err.message);
    return null;
  }
};

// ─── System prompt for safe, age-appropriate teen guidance ───────────────────
const SYSTEM_INSTRUCTION = `You are TeenTalk Safety Companion, a friendly and supportive educational AI assistant for teenagers aged 10–17 and young adults.

Your ONLY role is to provide age-appropriate, empathetic educational guidance on these topics:
- Personal safety (good touch, bad touch, personal boundaries)
- Cyberbullying, online safety, social media privacy
- Healthy relationships and respectful communication
- Stress management, emotional well-being, mindfulness
- POSH (Prevention of Sexual Harassment) awareness for older teens / interns

STRICT RULES:
1. Never provide medical diagnoses, legal advice, prescriptions, or clinical therapy.
2. Never give instructions for hacking, harmful activities, or illegal actions.
3. If you detect signs of immediate danger, abuse, or self-harm, ALWAYS direct the user to call 1098 (Childline India) or 112 (Emergency).
4. Keep all responses simple, warm, and easy for a teenager to understand.
5. Do not use complex jargon. Use bullet points and short paragraphs.
6. Never make the user feel blamed, judged, or ashamed.
7. Stay strictly within the educational safety topics above. If asked about unrelated topics, politely redirect.
8. End responses with an encouraging statement or offer to help further.

Format responses in plain text with clear paragraphs. Use simple markdown like **bold** for key points.`;

// ─── Keyword fallback responses ────────────────────────────────────────────────
const getKeywordFallback = (lowerMsg) => {
  if (lowerMsg.includes('good touch') || lowerMsg.includes('bad touch') || lowerMsg.includes('safe touch')) {
    return `**Good Touch vs Bad Touch** 🛡️\n\nEvery person has body rights. Here's how to understand the difference:\n\n**Good Touch** feels safe and comfortable — like a hug from a family member you trust, or a doctor's checkup with a parent present.\n\n**Bad Touch** is any contact that:\n- Makes you feel uncomfortable, scared, or confused\n- Involves private body parts\n- Comes with a request for secrecy\n\n**The Golden Rule:** If anyone — even an adult or relative — touches you and says "keep this a secret," that is NEVER okay. Tell a trusted adult immediately. You will not get in trouble for telling the truth.\n\nWould you like to know how to identify your "Circle of Trust" — the 5 safe adults you can always go to?`;
  }
  if (lowerMsg.includes('boundar') || lowerMsg.includes('personal space')) {
    return `**Personal Boundaries** 🌟\n\nBoundaries are invisible lines that protect your physical and emotional space. You have the right to set them!\n\n**Types of boundaries:**\n- **Physical:** Your body is yours. Nobody can hug, touch, or invade your space without permission.\n- **Emotional:** You decide what you share about your feelings.\n- **Digital:** You choose who can message you, see your photos, or know your location.\n\n**Saying NO is powerful.** Practice this: "I'm not comfortable with that" or "Please stop, I don't like this."\n\nIs there a specific situation you'd like help navigating?`;
  }
  if (lowerMsg.includes('bully') || lowerMsg.includes('teas') || lowerMsg.includes('cyberbully')) {
    return `Facing bullying or cyberbullying can feel very isolating — but it is **never your fault**. 💙\n\n**3 steps to take right now:**\n1. **Don't retaliate** — Bullies want a reaction. Stay calm.\n2. **Save Evidence** — Screenshot messages, note dates and times.\n3. **Report it** — Tell a teacher, parent, or use TeenTalk's confidential complaint tool.\n\n**Online bullying?** Block the person, report the content to the platform, and take screenshots for evidence.\n\nWould you like help writing a report or talking through how to approach a trusted adult?`;
  }
  if (lowerMsg.includes('stress') || lowerMsg.includes('anxi') || lowerMsg.includes('overwhelm') || lowerMsg.includes('exam')) {
    return `Feeling stressed is completely normal, especially during exams and big life changes. Here's something you can try RIGHT NOW: 🧘\n\n**The 4-4-4 Box Breathing:**\n- Breathe IN through your nose for 4 seconds\n- HOLD gently for 4 seconds\n- Breathe OUT through your mouth for 4 seconds\n- Rest for 4 seconds — repeat 3 times\n\n**Other tips:**\n- Break study time into 25-minute focused blocks\n- Take short walks outside\n- Talk to someone you trust about how you feel\n\nWould you like to log your mood in the Mood Tracker, or talk through what's stressing you out?`;
  }
  if (lowerMsg.includes('online safe') || lowerMsg.includes('social media') || lowerMsg.includes('privacy') || lowerMsg.includes('password') || lowerMsg.includes('hacked')) {
    return `Protecting yourself online is super important! Here's what to do: 🔒\n\n**Immediate steps if you feel unsafe online:**\n1. Change your password immediately (use 12+ characters, mix letters + numbers + symbols)\n2. Enable **Two-Factor Authentication (2FA)** on all apps\n3. Review who can see your posts — set profiles to **Private**\n4. Never share your location, school name, or home address online\n\n**Red flags to watch for:**\n- Strangers asking for personal photos\n- Online "friends" who want to move to private chats quickly\n- Requests to keep your online friendship a secret\n\nCheck out our **Cyber Safety Module** for the full guide! Would you like more specific tips?`;
  }
  // Default welcome response
  return `Hello! 👋 I'm your **TeenTalk Safety Companion**.\n\nI'm here to help you with questions about:\n• **Personal Safety** — Good touch, bad touch, body rights\n• **Personal Boundaries** — How to say no and protect your space\n• **Cyberbullying** — What to do if you're targeted online\n• **Online Safety** — Protecting your social media and accounts\n• **Stress & Emotions** — Managing anxiety, exam pressure, and feelings\n\nEverything you share here is private. How can I help you today?`;
};

// ─── Main processing function ─────────────────────────────────────────────────
const processAIChatMessage = async (userOrNull, message, topic = null) => {
  if (!message || !message.trim()) {
    const error = new Error('Chat message content is required');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const trimmedMessage = message.trim();
  const lowerMsg = trimmedMessage.toLowerCase();

  // 1. CRISIS DETECTION — highest priority, always respond with hotlines
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(trimmedMessage)) {
      await logAuditEvent({
        actorId: userOrNull ? userOrNull.id : null,
        action: 'AI_CRISIS_ESCALATION_TRIGGERED',
        resourceType: 'ai_safety',
        details: { category: 'crisis_intervention' },
      });

      return {
        reply: `I can hear that you're going through something really painful right now, and I want you to know that you are not alone. 💙\n\nI'm an educational assistant and I'm not able to provide the support you need right now — but real human helpers are available 24/7, and they want to hear from you.\n\n**Please reach out immediately:**\n• National Childline: **1098** (free, 24/7, confidential)\n• National Emergency: **112**\n• Tele-MANAS Mental Health: **14416** (toll-free counseling)`,
        is_crisis: true,
        is_refusal: false,
        escalation: {
          requires_immediate_attention: true,
          hotlines: CRISIS_HOTLINES,
          guidance: 'Please speak with a trusted adult or call the emergency helpline right now. You matter.',
        },
        disclaimer: 'TeenTalk AI is an educational assistant and cannot provide clinical or emergency services.',
      };
    }
  }

  // 2. UNSAFE INSTRUCTIONS — refuse firmly
  for (const pattern of UNSAFE_INSTRUCTION_PATTERNS) {
    if (pattern.test(trimmedMessage)) {
      return {
        reply: "I'm not able to help with that request. TeenTalk AI is here only for education about personal safety and well-being.\n\nIf you have questions about protecting yourself online or staying safe, I'm happy to help with those!",
        is_crisis: false,
        is_refusal: true,
        escalation: null,
        disclaimer: 'TeenTalk AI upholds student safety and ethical digital standards.',
      };
    }
  }

  // 3. MEDICAL / LEGAL DISCLAIMER
  for (const pattern of MEDICAL_LEGAL_PATTERNS) {
    if (pattern.test(trimmedMessage)) {
      return {
        reply: "I can't provide medical diagnoses or legal advice — those require a qualified professional.\n\nFor medical concerns, please speak with your doctor or school health officer. For legal help, ask a trusted adult to connect you with an appropriate professional.",
        is_crisis: false,
        is_refusal: true,
        escalation: null,
        disclaimer: 'TeenTalk AI is not a licensed physician or attorney.',
      };
    }
  }

  // 4. TRY GEMINI API
  const model = getGeminiModel();
  if (model) {
    try {
      // Build context-aware prompt
      const topicContext = topic
        ? `The user is currently studying the topic: "${topic}". Use this context to make your response more relevant.\n\n`
        : '';

      const prompt = `${SYSTEM_INSTRUCTION}\n\n${topicContext}User message: ${trimmedMessage}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      return {
        reply: responseText,
        is_crisis: false,
        is_refusal: false,
        escalation: null,
        powered_by: 'gemini',
        disclaimer: 'TeenTalk AI provides educational guidance and does not substitute for licensed counseling or emergency services.',
      };
    } catch (geminiErr) {
      console.warn('[AI] Gemini API error, falling back to keyword responses:', geminiErr.message);
    }
  }

  // 5. KEYWORD FALLBACK (when Gemini key not configured or API fails)
  const responseText = getKeywordFallback(lowerMsg);

  return {
    reply: responseText,
    is_crisis: false,
    is_refusal: false,
    escalation: null,
    powered_by: 'keyword_fallback',
    disclaimer: 'TeenTalk AI provides educational peer safety information and does not substitute for licensed counseling or emergency intervention.',
  };
};

module.exports = { processAIChatMessage };
