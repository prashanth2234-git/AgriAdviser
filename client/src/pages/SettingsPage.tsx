import React, { useState, useEffect } from 'react';
import { Settings, Globe, Bell, Shield, LogOut, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import { PageContainer } from '../components/layout/AppShell';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const SettingsPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [language, setLanguage] = useState(user?.preferred_language || 'en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const prefs = await authService.getPreferences();
        setLanguage(prefs.preferred_language || 'en');
        setNotificationsEnabled(prefs.notifications_enabled);
        setEmailNotifications(prefs.email_notifications);
      } catch (err) {
        console.error('Error loading preferences:', err);
      }
    }
    loadPrefs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    try {
      await authService.updatePreferences({
        preferredLanguage: language,
        notificationsEnabled,
        emailNotifications,
      });
      await refreshUser();
      setIsSaved(true);
      success('Settings updated successfully.');
    } catch (err: any) {
      toastError(err.message || 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="md" className="pt-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Account Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Configure notifications, language localization, and data privacy.
        </p>
      </div>

      {isSaved && (
        <Alert variant="success" title="Preferences Saved">
          Your preferences have been successfully updated.
        </Alert>
      )}

      <form onSubmit={handleSave} className="card p-6 sm:p-8 space-y-6 text-left">
        {/* Localization */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Globe className="w-5 h-5 text-agri-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Language & Localization
            </h3>
          </div>

          <div className="max-w-xs">
            <Select
              label="Advisory Interface Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi (हिंदी)' },
                { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
                { value: 'te', label: 'Telugu (తెలుగు)' },
                { value: 'mr', label: 'Marathi (मराठी)' },
                { value: 'es', label: 'Spanish (Español)' },
              ]}
              helperText="Determines language for AI advisory explanations."
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Bell className="w-5 h-5 text-agri-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-stone-300 text-agri-600 focus:ring-agri-500"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">In-App Advisory Alerts</p>
                <p className="text-xs text-stone-500">Receive alerts when long-running advisory checks are complete.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-stone-300 text-agri-600 focus:ring-agri-500"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">Email Summaries</p>
                <p className="text-xs text-stone-500">Receive weekly digests and severe weather risk warnings via email.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security & Data Privacy Notice */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Shield className="w-5 h-5 text-agri-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Data Privacy & Isolation
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <Lock className="w-3.5 h-3.5 text-agri-600" />
              <span>Strict PostgreSQL Row-Level Isolation Enforced</span>
            </div>
            <p className="leading-relaxed">
              Your farm boundaries, crop yields, and advisory inquiries are protected by server-enforced user ID scoping.
              Data is never shared with third-party advertising or non-authorized entities.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out of this session</span>
          </button>

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Preferences
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
