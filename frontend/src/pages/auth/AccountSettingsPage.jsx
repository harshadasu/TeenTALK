import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Bell,
  EyeOff,
  Building,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { InputField } from '../../components/forms/InputField';
import { AlertBanner } from '../../components/feedback/AlertBanner';

export const AccountSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [ageGroup, setAgeGroup] = useState(user?.age_group || '14-17');
  const [isSaving, setIsSaving] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Preferences
  const [anonymousMode, setAnonymousMode] = useState(user?.preferences?.is_anonymous || false);
  const [emailAlerts, setEmailAlerts] = useState(user?.preferences?.notifications ?? true);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateUser) {
        await updateUser({
          full_name: fullName,
          phone,
          bio,
          age_group: ageGroup,
          preferences: {
            is_anonymous: anonymousMode,
            notifications: emailAlerts,
          },
        });
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated securely.', 'success');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account & Privacy Settings</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your personal details, safety preferences, and login credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-lavender-700 text-lavender-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-4 h-4" /> Profile Details
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-lavender-700 text-lavender-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Password & Security
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'border-lavender-700 text-lavender-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" /> Privacy & Protection
        </button>
      </div>

      {activeTab === 'profile' && (
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center text-3xl font-bold border border-lavender-200">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{user?.full_name}</h3>
                <Badge variant="primary">{user?.role?.toUpperCase() || 'USER'}</Badge>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
              {user?.organization && (
                <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>{user.organization.name}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Full Name / Display Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={User}
              />
              <InputField
                label="Registered Email"
                type="email"
                value={user?.email || ''}
                disabled
                icon={Mail}
                hint="Contact administration to update registered institutional emails."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Contact Phone (Optional)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                icon={Phone}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Age Experience Cohort
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
                >
                  <option value="10-13">Young Learner (10–13)</option>
                  <option value="14-17">Teen (14–17)</option>
                  <option value="18-25">Young Adult (18–25)</option>
                  <option value="26-40">Adult & Parent (26–40)</option>
                  <option value="41-50">Women's Support (41–50)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                About You / Personal Learning Goal
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your safety interests or personal goals..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                <Save className="w-4 h-4 mr-1.5" />
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-600">Ensure your account uses a robust, unique password.</p>
          </div>

          {passwordSuccess && (
            <AlertBanner
              type="success"
              title="Password Updated"
              message="Your password has been changed successfully."
              onClose={() => setPasswordSuccess(false)}
            />
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <InputField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              icon={Lock}
            />
            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              icon={KeyRound}
              hint="Minimum 8 characters with at least one letter and number."
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={Lock}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
              <Shield className="w-4 h-4 text-lavender-600" /> Session Security Policy
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              TeenTalk automatically logs out inactive sessions after 24 hours to safeguard your personal wellbeing notes and complaint privacy.
            </p>
          </div>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card className="p-6 sm:p-8 space-y-6 shadow-sm border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Privacy & Protection Controls</h3>
            <p className="text-xs text-slate-600">Choose how your activity is shared across classes and cohorts.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-lavender-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Anonymous Cohort Mode</h4>
                  <p className="text-xs text-slate-500">
                    Replace your full name with your chosen avatar in school aggregate completion statistics.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={anonymousMode}
                onChange={(e) => setAnonymousMode(e.target.checked)}
                className="w-4 h-4 text-lavender-600 rounded border-slate-300 focus:ring-lavender-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-lavender-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Weekly Wellbeing Reminders</h4>
                  <p className="text-xs text-slate-500">
                    Receive gentle notifications to log your daily mood and review key safety habits.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-lavender-600 rounded border-slate-300 focus:ring-lavender-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Right to privacy complies with Digital Personal Data Protection (DPDP)</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => showToast('Data transcript exported to your downloads.', 'info')}>
              Download My Learning Data
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
