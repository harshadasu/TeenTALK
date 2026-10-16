const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Generate synced hash for Password123!
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.organizations = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'TeenTalk Global Network',
        type: 'system',
        code: 'ORG-SYS-001',
        address: 'Tech Hub 4, Innovation Park',
        contact_email: 'admin@teentalk.org',
        contact_phone: '+91 98765 00000',
        status: 'active',
        created_at: new Date().toISOString(),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Greenwood International High',
        type: 'school',
        code: 'ORG-SCH-002',
        address: '12 Lakeview Road, Bangalore',
        contact_email: 'contact@greenwoodhigh.edu',
        contact_phone: '+91 98765 11111',
        status: 'active',
        created_at: new Date().toISOString(),
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'SafeHaven Child Welfare NGO',
        type: 'ngo',
        code: 'ORG-NGO-003',
        address: '78 Hope Street, Mumbai',
        contact_email: 'support@safehaven.org',
        contact_phone: '+91 98765 22222',
        status: 'active',
        created_at: new Date().toISOString(),
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Apex Software Technologies Inc',
        type: 'corporate',
        code: 'ORG-CORP-004',
        address: 'Cyber City Tower B, Pune',
        contact_email: 'posh@apextech.com',
        contact_phone: '+91 98765 33333',
        status: 'active',
        created_at: new Date().toISOString(),
      },
    ];

    this.users = [
      {
        id: 'a0000001-0000-0000-0000-000000000001',
        email: 'admin@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Tejas Kulkarni (Super Admin)',
        role: 'super_admin',
        age_group: '26-40',
        org_id: '11111111-1111-1111-1111-111111111111',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000002-0000-0000-0000-000000000002',
        email: 'teen@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Payal Sharma (Teen Learner)',
        role: 'teen',
        age_group: '14-17',
        org_id: '22222222-2222-2222-2222-222222222222',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000003-0000-0000-0000-000000000003',
        email: 'adult@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Harshada Patil (Parent Guardian)',
        role: 'adult',
        age_group: '26-40',
        org_id: '22222222-2222-2222-2222-222222222222',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000004-0000-0000-0000-000000000004',
        email: 'school@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Principal Rajiv Nair',
        role: 'school_admin',
        age_group: '41-50',
        org_id: '22222222-2222-2222-2222-222222222222',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000005-0000-0000-0000-000000000005',
        email: 'employee@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Nisha Verma (Employee)',
        role: 'employee',
        age_group: '18-25',
        org_id: '44444444-4444-4444-4444-444444444444',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000006-0000-0000-0000-000000000006',
        email: 'hr@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Anita Sen (POSH IC Lead)',
        role: 'hr',
        age_group: '26-40',
        org_id: '44444444-4444-4444-4444-444444444444',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000007-0000-0000-0000-000000000007',
        email: 'ngo@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Vikram Seth (Child Welfare NGO)',
        role: 'ngo',
        age_group: '41-50',
        org_id: '33333333-3333-3333-3333-333333333333',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000008-0000-0000-0000-000000000008',
        email: 'counselor@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Dr. Meera Joshi (Licensed Counselor)',
        role: 'counselor',
        age_group: '26-40',
        org_id: '33333333-3333-3333-3333-333333333333',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000009-0000-0000-0000-000000000009',
        email: 'content@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Rohan Gupta (Curriculum Designer)',
        role: 'content_manager',
        age_group: '26-40',
        org_id: '11111111-1111-1111-1111-111111111111',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'a0000010-0000-0000-0000-000000000010',
        email: 'auditor@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Sunil Deshmukh (Compliance Auditor)',
        role: 'auditor',
        age_group: '41-50',
        org_id: '11111111-1111-1111-1111-111111111111',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      // Young Learner Sample
      {
        id: 'a0000011-0000-0000-0000-000000000011',
        email: 'young@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Aanya Rao (Young Learner)',
        role: 'teen',
        age_group: '10-13',
        org_id: '22222222-2222-2222-2222-222222222222',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      // Women's Support Sample
      {
        id: 'a0000012-0000-0000-0000-000000000012',
        email: 'supportee@teentalk.org',
        password_hash: DEFAULT_PASSWORD_HASH,
        full_name: 'Sunita Sharma (Women Community)',
        role: 'adult',
        age_group: '41-50',
        org_id: '33333333-3333-3333-3333-333333333333',
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
    ];

    this.teen_modules = [
      {
        id: 'b0000001-0000-0000-0000-000000000001',
        title: 'Cyber Safety & Social Media Privacy',
        slug: 'cyber-safety-social-media',
        category: 'cyber_safety',
        target_age_group: '14-17',
        description: 'Learn how to secure your accounts, detect phishing links, and protect yourself from online impostors.',
        content: `### Understanding Digital Threats\nIn the digital age, your online identity is as valuable as your physical identity. Cybercriminals often use social engineering—manipulating people into giving up confidential information.\n\n#### Key Best Practices:\n1. **Two-Factor Authentication (2FA)**: Never share OTPs.\n2. **Privacy Settings**: Keep your social profiles private to people you know in real life.\n3. **Think Before You Click**: Avoid clicking shortened links sent by unverified accounts.\n\nRemember: If something online feels too good to be true, or makes you feel unsafe, talk to a trusted adult immediately.`,
        reading_time_mins: 6,
        order_index: 1,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b0000002-0000-0000-0000-000000000002',
        title: 'Personal Boundaries & Safe Touch Rules',
        slug: 'personal-boundaries-safe-touch',
        category: 'safe_touch_boundaries',
        target_age_group: '10-13',
        description: 'Recognize your body rights, comfortable vs uncomfortable touch, and building a circle of trusted adults.',
        content: `### Your Body Belongs to You!\nNo one has the right to make you feel uncomfortable, frightened, or confused in your own physical space.\n\n#### 3 Simple Golden Rules:\n1. **The Swimsuit Rule**: Parts of your body covered by a swimsuit are private.\n2. **No Secrets**: If an adult or older kid asks you to keep a touch a "secret", it is NOT safe. Always tell a trusted adult.\n3. **The Power of NO**: You are allowed to say NO to unwanted hugs or physical closeness, even to relatives.\n\n#### Your Trusted 5 Circle:\nPick 5 adults (like Mom, Dad, Grandma, Favorite Teacher, or School Counselor) you can talk to if anyone ever makes you feel uneasy.`,
        reading_time_mins: 5,
        order_index: 2,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b0000003-0000-0000-0000-000000000003',
        title: 'Recognizing & Standing Up to Bullying',
        slug: 'anti-bullying-upstander',
        category: 'anti_bullying',
        target_age_group: '14-17',
        description: 'Discover the difference between a bystander and an upstander, and how to safely de-escalate bullying situations.',
        content: `### Bullying in Schools & Online\nBullying is repetitive, aggressive behavior involving an imbalance of power. It can be verbal, physical, social, or cyberbullying.\n\n#### How to Be an Upstander:\n- Do not laugh or join in.\n- Offer support to the victim in private.\n- Report the incident to teachers or counselors.\n- Use TeenTalk confidential reporting if you fear retaliation.\n\nYou have the power to make your school a safe space for everyone.`,
        reading_time_mins: 5,
        order_index: 3,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b0000004-0000-0000-0000-000000000004',
        title: 'Emotional Wellbeing & Stress Management',
        slug: 'emotional-wellbeing-stress',
        category: 'emotional_wellbeing',
        target_age_group: 'all',
        description: 'Practical mindfulness exercises, anxiety regulation techniques, and healthy coping mechanisms for students and women.',
        content: `### Caring for Your Mental Health\nExam pressure, peer relationships, and life transitions can feel overwhelming. Stress is normal, but chronic anxiety needs care.\n\n#### The 5-4-3-2-1 Grounding Technique:\n- 5 things you can see\n- 4 things you can physically touch\n- 3 things you can hear\n- 2 things you can smell\n- 1 thing you can taste\n\nTake deep belly breaths and remember that asking for help is a sign of courage, not weakness.`,
        reading_time_mins: 6,
        order_index: 4,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b0000005-0000-0000-0000-000000000005',
        title: 'POSH Awareness & Respectful Workplaces',
        slug: 'posh-awareness-interns',
        category: 'posh_awareness',
        target_age_group: '18-25',
        description: 'Essential guidelines on Prevention of Sexual Harassment (POSH) for young interns, trainees, and employees.',
        content: `### Understanding the POSH Act\nThe Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 safeguards every employee, apprentice, intern, and visitor.\n\n#### What Constitutes Harassment?\n- Unwelcome physical contact or advances\n- Demand or request for sexual favors\n- Sexually colored remarks\n- Showing pornography or unsolicited suggestive media\n- Quid pro quo (promising grades or appraisal in exchange for favors)\n\nEvery organization must have an Internal Committee (IC) to handle complaints impartially.`,
        reading_time_mins: 8,
        order_index: 5,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b0000006-0000-0000-0000-000000000006',
        title: 'Parenting in the Digital Era & Cyber Guidance',
        slug: 'parenting-digital-era',
        category: 'cyber_safety',
        target_age_group: '26-40',
        description: 'How to safeguard children online, foster positive conversations about screen time, and establish healthy digital contracts.',
        content: `### Guiding Children Online with Empathy\nPunitive measures like confiscating phones often drive children to hide cyber problems. Creating a collaborative family digital agreement fosters transparent communication.\n\n#### Actionable Parenting Protocols:\n1. Open door device policy during homework hours.\n2. Co-viewing content and discussing social media realities.\n3. Teaching children that asking for help with an online mistake will never result in being punished.`,
        reading_time_mins: 7,
        order_index: 6,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b0000007-0000-0000-0000-000000000007',
        title: 'Lifelong Wellness, Rights & Community Safety',
        slug: 'lifelong-wellness-rights',
        category: 'emotional_wellbeing',
        target_age_group: '41-50',
        description: 'Empowering women with legal rights, mental wellness coping mechanisms, and community leadership resources.',
        content: `### Emotional Wholeness & Legal Standing\nMid-life transitions, caring for aging parents, and managing adolescent children require intentional self-care and boundary preservation.\n\n#### Protection Frameworks:\n- Domestic Violence Act provisions and free legal aid.\n- Preventive healthcare screenings and hormonal wellness.\n- Building supportive circles of mutual aid and intergenerational mentorship.`,
        reading_time_mins: 6,
        order_index: 7,
        is_published: true,
        author_id: 'a0000009-0000-0000-0000-000000000009',
        created_at: new Date().toISOString(),
      },
    ];

    this.scenarios = [
      {
        id: 'scenario-01',
        title: 'The Mystery Gamer & The Secret Photo',
        target_age_group: '10-13',
        character: 'Maya, age 12',
        setup: 'Maya is playing her favorite multiplayer craft game. A player with a high-level badge named "GamerSam" offers her rare game gems if she joins a private Discord chat and sends a selfie showing her school uniform.',
        choices: [
          {
            id: 'A',
            text: 'Send the selfie because rare gems are hard to get and it is just a photo.',
            feedback: 'Unsafe Choice! Never send personal photos or reveal your school uniform. People online can be impostors who misuse personal images.',
            is_safe: false,
          },
          {
            id: 'B',
            text: 'Refuse firmly, take a screenshot, block GamerSam, and immediately show Mom or Dad.',
            feedback: 'Hero Choice! You protected your personal privacy and alerted your trusted adult circle immediately.',
            is_safe: true,
          },
          {
            id: 'C',
            text: 'Ask the gamer to send their photo first to see if they are real.',
            feedback: 'Risky Choice! Online predators frequently use fake photos from the internet to trick people. Never negotiate personal information.',
            is_safe: false,
          },
        ],
      },
      {
        id: 'scenario-02',
        title: 'The Viral Group Chat Rumor',
        target_age_group: '14-17',
        character: 'Rhea, age 15',
        setup: 'A classmate created an anonymous Instagram confession page and posted hurtful memes mocking a girl in Rhea\'s grade. Friends in Rhea\'s group chat are forwarding the link and laughing.',
        choices: [
          {
            id: 'A',
            text: 'Forward it to other friends so you do not feel left out of the joke.',
            feedback: 'Harmful Choice! Forwarding cyberbullying makes you a participant in harassment, which causes serious emotional harm.',
            is_safe: false,
          },
          {
            id: 'B',
            text: 'Ignore it completely and stay silent.',
            feedback: 'Passive Choice. While you did not bully, being a bystander allows the cruelty to continue unchecked.',
            is_safe: false,
          },
          {
            id: 'C',
            text: 'Refuse to forward it, send a supportive message to the victim, and report the page confidentially to school counselors.',
            feedback: 'Upstander Choice! You demonstrated true leadership, protected a peer, and utilized confidential reporting safely.',
            is_safe: true,
          },
        ],
      },
      {
        id: 'scenario-03',
        title: 'The Late Night Message from a Senior Lead',
        target_age_group: '18-25',
        character: 'Kavita, age 21 (Intern)',
        setup: 'Kavita\'s project manager texts her on WhatsApp at 11:30 PM: "You did great today. Let\'s discuss your internship rating over drinks alone this Saturday." Kavita feels uncomfortable.',
        choices: [
          {
            id: 'A',
            text: 'Agree to go because you are scared of receiving a bad internship review.',
            feedback: 'Unsafe Choice. Conditioning performance ratings on private personal meetings is a classic Quid Pro Quo POSH violation.',
            is_safe: false,
          },
          {
            id: 'B',
            text: 'Politely decline, keep communications strictly to official company Slack/email, take screenshots, and consult the HR / POSH IC.',
            feedback: 'Correct POSH Protocol! You set firm professional boundaries and documented the conversation for confidential committee review.',
            is_safe: true,
          },
        ],
      },
    ];

    this.progress = [
      {
        id: 'e0000001-0000-0000-0000-000000000001',
        user_id: 'a0000002-0000-0000-0000-000000000002',
        module_id: 'b0000001-0000-0000-0000-000000000001',
        status: 'completed',
        completed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        score: 100,
        time_spent_seconds: 420,
      },
      {
        id: 'e0000002-0000-0000-0000-000000000002',
        user_id: 'a0000002-0000-0000-0000-000000000002',
        module_id: 'b0000002-0000-0000-0000-000000000002',
        status: 'in_progress',
        completed_at: null,
        score: 40,
        time_spent_seconds: 180,
      },
    ];

    this.complaints = [
      {
        id: 'f0000001-0000-0000-0000-000000000001',
        tracking_code: 'TT-CASE-2026-8941',
        user_id: 'a0000005-0000-0000-0000-000000000005',
        org_id: '44444444-4444-4444-4444-444444444444',
        title: 'Inappropriate WhatsApp messages after working hours',
        category: 'posh_harassment',
        description: 'A senior project manager sent multiple unsolicited personal messages and suggestive remarks after 10 PM.',
        incident_date: '2026-03-01',
        is_anonymous: false,
        severity: 'high',
        status: 'under_review',
        assigned_to: 'a0000006-0000-0000-0000-000000000006',
        consent_confirmed: true,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'f0000002-0000-0000-0000-000000000002',
        tracking_code: 'TT-CASE-2026-4412',
        user_id: null,
        org_id: '22222222-2222-2222-2222-222222222222',
        title: 'Repeated online harassment in class Discord group',
        category: 'cyberbullying',
        description: 'Anonymous harassment and meme mocking targeted at grade 9 students by seniors.',
        incident_date: '2026-03-03',
        is_anonymous: true,
        severity: 'medium',
        status: 'submitted',
        assigned_to: null,
        consent_confirmed: true,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    this.evidence = [];

    this.case_notes = [
      {
        id: '90000001-0000-0000-0000-000000000001',
        complaint_id: 'f0000001-0000-0000-0000-000000000001',
        author_id: 'a0000006-0000-0000-0000-000000000006',
        note_text: 'Initial review completed. Internal Committee (IC) quorum formed. Notice will be issued to respondent within 3 working days.',
        is_private: true,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];

    this.quizzes = [
      {
        id: 'c0000001-0000-0000-0000-000000000001',
        module_id: 'b0000001-0000-0000-0000-000000000001',
        title: 'Cyber Safety Mastery Quiz',
        description: 'Test your knowledge on social media security, 2FA, and phishing defenses.',
        passing_score: 70,
        time_limit_mins: 10,
        is_active: true,
      },
      {
        id: 'c0000002-0000-0000-0000-000000000002',
        module_id: 'b0000002-0000-0000-0000-000000000002',
        title: 'Personal Boundaries Check',
        description: 'Assess your ability to identify safe touch, unsafe touch, and boundary violations.',
        passing_score: 75,
        time_limit_mins: 10,
        is_active: true,
      },
    ];

    this.quiz_questions = [
      {
        id: 'd0000001-0000-0000-0000-000000000001',
        quiz_id: 'c0000001-0000-0000-0000-000000000001',
        question_text: 'What should you do if an unknown online gamer asks you for your home address or school name?',
        options: [
          { id: 'A', text: 'Give a false address to fool them' },
          { id: 'B', text: 'Politely refuse, do not share personal details, and block/report if they persist' },
          { id: 'C', text: 'Share the details if they promise free in-game currency' },
          { id: 'D', text: 'Ask them for their address first' },
        ],
        correct_answer: 'B',
        explanation: 'Never share personally identifiable information (PII) like home address, school, or phone number with online contacts.',
        order_index: 1,
      },
      {
        id: 'd0000002-0000-0000-0000-000000000002',
        quiz_id: 'c0000001-0000-0000-0000-000000000001',
        question_text: 'What is Two-Factor Authentication (2FA)?',
        options: [
          { id: 'A', text: 'Having two different passwords for one account' },
          { id: 'B', text: 'Logging in from two devices at the same time' },
          { id: 'C', text: 'A security process where a user provides two different authentication factors to verify themselves' },
          { id: 'D', text: 'Changing your password every two months' },
        ],
        correct_answer: 'C',
        explanation: '2FA adds a critical second layer of protection (e.g. password + authenticator code or SMS OTP).',
        order_index: 2,
      },
      {
        id: 'd0000003-0000-0000-0000-000000000003',
        quiz_id: 'c0000001-0000-0000-0000-000000000001',
        question_text: 'Which of the following is a classic indicator of a phishing email or DM?',
        options: [
          { id: 'A', text: 'Urgent language demanding immediate action to avoid account suspension' },
          { id: 'B', text: 'Mismatched sender domain address' },
          { id: 'C', text: 'Grammatical errors and suspicious shortened links' },
          { id: 'D', text: 'All of the above' },
        ],
        correct_answer: 'D',
        explanation: 'Phishing scams frequently use artificial urgency, spoofed addresses, and sketchy links.',
        order_index: 3,
      },
      {
        id: 'd0000004-0000-0000-0000-000000000004',
        quiz_id: 'c0000002-0000-0000-0000-000000000002',
        question_text: 'If an adult or peer touches you in a way that makes you feel uneasy and tells you to keep it a secret, what should you do?',
        options: [
          { id: 'A', text: 'Keep the secret so they do not get angry' },
          { id: 'B', text: 'Say NO clearly, get away, and immediately tell a parent, teacher, or trusted adult' },
          { id: 'C', text: 'Wait to see if it happens again' },
          { id: 'D', text: 'Blame yourself for being in that situation' },
        ],
        correct_answer: 'B',
        explanation: 'No secret touch is acceptable. Tell a trusted adult right away regardless of what the person claims.',
        order_index: 1,
      },
    ];

    this.quiz_results = [];

    this.mood_logs = [
      {
        id: '80000001-0000-0000-0000-000000000001',
        user_id: 'a0000002-0000-0000-0000-000000000002',
        mood_rating: 4,
        emotions: ['Relieved', 'Optimistic'],
        note: 'Finished my cyber safety module and understood how to protect my online games.',
        logged_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '80000002-0000-0000-0000-000000000002',
        user_id: 'a0000002-0000-0000-0000-000000000002',
        mood_rating: 3,
        emotions: ['Tired', 'Reflective'],
        note: 'Midterms are starting next week, feeling a bit stressed.',
        logged_at: new Date().toISOString(),
      },
    ];

    this.certificates = [
      {
        id: '70000001-0000-0000-0000-000000000001',
        certificate_code: 'CERT-TT-2026-0091',
        user_id: 'a0000002-0000-0000-0000-000000000002',
        module_id: 'b0000001-0000-0000-0000-000000000001',
        issue_date: new Date(Date.now() - 2 * 86400000).toISOString(),
        score: 100,
        verification_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    ];

    this.audit_logs = [
      {
        id: '60000001-0000-0000-0000-000000000001',
        actor_id: 'a0000001-0000-0000-0000-000000000001',
        action: 'SYSTEM_INITIALIZED',
        resource_type: 'system',
        resource_id: 'core',
        ip_address: '127.0.0.1',
        details: { version: '1.0.0', status: 'all_services_operational' },
        created_at: new Date().toISOString(),
      },
    ];
  }
}

const store = new DataStore();

module.exports = store;
