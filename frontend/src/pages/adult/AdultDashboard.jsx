import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, BookOpen, AlertCircle, PhoneCall, Sparkles, MessageCircle } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CRISIS_NUMBERS } from '../../constants';

export const AdultDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <Badge variant="blue" className="bg-white/20 text-white border-white/30 mb-3">
            👨‍👩‍👦 Parent & Guardian Guidance Center
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Supporting Your Teen's Digital & Emotional Journey
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Adolescence can be difficult to navigate alone. Discover research-backed guidance on open communication,
            cyber safety rules, and recognizing subtle signs of distress or cyberbullying.
          </p>
          <Link to="/modules">
            <Button variant="secondary" size="sm" icon={BookOpen}>
              Browse Adolescent Curriculum
            </Button>
          </Link>
        </div>
      </div>

      {/* Core Guidance Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect className="p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Recognizing Cyberbullying</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Signs include sudden withdrawal from social activities, closing screens when parents walk into the room,
            or changes in sleep patterns. Avoid threatening to confiscate devices, as this prevents teens from opening up.
          </p>
        </Card>

        <Card hoverEffect className="p-6">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Non-Judgmental Conversations</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Practice active listening. Ask questions like: "How are things with your friend group online lately?" rather
            than interrogative inquiries. Validate their emotions before offering solutions.
          </p>
        </Card>

        <Card hoverEffect className="p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Setting Healthy Digital Boundaries</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Co-create screen time contracts together. Establish device-free zones like the dinner table and bedrooms
            during sleep hours to support restorative sleep.
          </p>
        </Card>
      </div>

      {/* Emergency Helpline Strip */}
      <Card className="p-6 border-slate-200">
        <CardHeader
          title="Verified Crisis Lines for Parents & Educators"
          subtitle="If your teen is experiencing severe psychological crisis or immediate danger"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRISIS_NUMBERS.slice(0, 3).map((item) => (
            <div key={item.number} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">{item.name}</span>
              <span className="text-lg font-extrabold text-teal-600 block my-1">{item.number}</span>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
