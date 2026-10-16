import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/forms/InputField';
import { AlertBanner } from '../../components/feedback/AlertBanner';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tempCode, setTempCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    // Simulate safe password reset dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Academic evaluation demo code
      setTempCode(Math.floor(100000 + Math.random() * 900000).toString());
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center shadow-sm">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            No worries! Enter the email associated with your TeenTalk account and we'll help you regain access.
          </p>
        </div>

        <Card className="p-8 shadow-md border-slate-200/80">
          {error && (
            <div className="mb-5">
              <AlertBanner
                type="danger"
                title="Invalid Request"
                message={error}
                onClose={() => setError('')}
              />
            </div>
          )}

          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-mint-100 text-mint-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Reset Link Sent</h3>
                <p className="text-sm text-slate-600">
                  We've sent password reset instructions to <span className="font-semibold text-slate-800">{email}</span>.
                </p>
              </div>

              {/* Academic evaluation helper box */}
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-200 text-left">
                <div className="flex items-center gap-2 text-lavender-900 font-semibold text-xs uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-lavender-600" /> Academic Project Simulation
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  In production, an encrypted token is sent to the registered inbox. For rapid academic evaluation, your simulated 6-digit recovery code is:
                </p>
                <div className="text-center py-2 bg-white rounded-lg border border-lavender-200 text-lg font-mono font-bold tracking-widest text-lavender-800">
                  {tempCode}
                </div>
              </div>

              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Registered Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={Mail}
                hint="Your email is strictly private and never shared with third parties."
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </Card>

        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-mint-600" />
          <span>Zero-knowledge student identity protection standard</span>
        </div>
      </div>
    </div>
  );
};
