/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  Save,
  LogOut,
  Clock,
  Tv,
  Volume2,
  Layers,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Flame,
  Radio,
  Sliders,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface CMSSettings {
  countdownTargetISO: string;
  targetDescription: string;
  forcedElectionDayMode: boolean;
  autoOpenElectionDayDesk: boolean;
  broadcastTitle: string;
  broadcastDescription: string;
  breakingAnnouncement: {
    active: boolean;
    text: string;
    alertLevel: 'red' | 'amber' | 'blue';
  };
  youtubeVideoId: string;
  youtubeAutoPlay: boolean;
  audio: {
    enableChimes: boolean;
    breakingAlertSound: boolean;
    volume: number;
  };
  layouts: {
    showChamberCounters: boolean;
    showMap: boolean;
    showNewsWire: boolean;
    showTimeline: boolean;
    showAnalysis: boolean;
    defaultMapView: '3D' | '2D';
    defaultTheme: 'light' | 'dark';
  };
  simulation: {
    mode: 'countdown' | 'live_simulation' | 'external_api';
    progressPct: number;
    pollingIntervalSeconds: number;
    activeProvider: string;
  };
}

interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  role: string;
  action: string;
  details: string;
}

interface CMSAdminDashboardProps {
  onBackToSite: () => void;
  onOpenElectionDesk: () => void;
}

export const CMSAdminDashboard: React.FC<CMSAdminDashboardProps> = ({ onBackToSite, onOpenElectionDesk }) => {
  // Auth state
  const [isInitialized, setIsInitialized] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('dd_cms_token'));

  // Form states for login / setup
  const [loginUsername, setLoginUsername] = useState('Upasyo2007');
  const [loginPassword, setLoginPassword] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // CMS Dashboard state
  const [activeTab, setActiveTab] = useState<'countdown' | 'content' | 'layouts' | 'audio' | 'youtube' | 'users' | 'audit'>('countdown');
  const [settings, setSettings] = useState<CMSSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);

  // Check auth status on load
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/cms/auth/status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setIsInitialized(data.isInitialized);
        setIsAuthenticated(data.isAuthenticated);
        if (data.user) setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Failed to check CMS auth status:', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [token]);

  // Fetch settings & logs when authenticated
  const fetchCMSData = async () => {
    if (!token) return;
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch('/api/cms/settings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/cms/audit-logs', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const sData = await settingsRes.json();
      const lData = await logsRes.json();

      if (sData.success) setSettings(sData.settings);
      if (lData.success) setAuditLogs(lData.logs);
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCMSData();
    }
  }, [isAuthenticated]);

  // First-time setup handler for Upasyo2007
  const handleInitialSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (setupPassword !== setupConfirm) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (setupPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/cms/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: setupPassword })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('dd_cms_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setIsInitialized(true);
      } else {
        setAuthError(data.error || 'Setup failed.');
      }
    } catch (err) {
      setAuthError('Connection error during setup.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('dd_cms_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setCurrentUser(data.user);
      } else {
        setAuthError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setAuthError('Connection error during login.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/cms/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (_) {}
    localStorage.removeItem('dd_cms_token');
    setToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Save Settings
  const handleSaveSettings = async (updates: Partial<CMSSettings>) => {
    if (!token || !settings) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveMessage('Settings updated and persisted to database.');
        fetchCMSData(); // Refresh audit logs
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('Error saving settings.');
      }
    } catch (err) {
      setSaveMessage('Failed to connect to CMS server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);
    if (!token) return;
    try {
      const res = await fetch('/api/cms/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordChangeMessage('Password successfully updated and re-hashed in database.');
        setOldPassword('');
        setNewPassword('');
        fetchCMSData();
      } else {
        setPasswordChangeMessage(data.error || 'Password update failed.');
      }
    } catch (err) {
      setPasswordChangeMessage('Server error during password update.');
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: Authentication Screen (Setup or Login)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-rose-600 selection:text-white">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Decision Desk CMS
            </h1>
            <p className="text-xs text-slate-500">
              {isInitialized
                ? 'Authorized Access Only · Server-Side Scrypt Hashed Authentication'
                : 'Initial Master Administrator Setup (Upasyo2007)'}
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {!isInitialized ? (
            /* First-Time Password Initialization for Upasyo2007 */
            <form onSubmit={handleInitialSetup} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 leading-relaxed text-[11px]">
                Welcome, <strong>Upasyo2007</strong>. Initialize your master administrator password. Your password will be securely salted and hashed using Node.js scrypt before saving to the database.
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Administrator Username
                </label>
                <input
                  type="text"
                  value="Upasyo2007"
                  disabled
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-mono text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Set Master Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Enter secure password..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Confirm Master Password
                </label>
                <input
                  type="password"
                  required
                  value={setupConfirm}
                  onChange={(e) => setSetupConfirm(e.target.value)}
                  placeholder="Re-enter password..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                {authLoading ? 'Setting Up...' : 'Initialize Super Admin'}
              </button>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Username (e.g. Upasyo2007)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{authLoading ? 'Verifying...' : 'Sign In to CMS'}</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <button
              onClick={onBackToSite}
              className="hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Public Website</span>
            </button>
            <span>Target: Nov 3, 2026, 9:00 AM IST</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Authenticated CMS Console
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* CMS Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              CMS
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                DECISION DESK CMS
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                Administrator: {currentUser?.username} · {currentUser?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            {/* Quick Link to /election-day-desk */}
            <button
              onClick={onOpenElectionDesk}
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Preview /election-day-desk</span>
            </button>

            {/* Back to main site */}
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CMS Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 py-1.5 text-xs">
          {[
            { id: 'countdown', label: 'Election Countdown & Desk', icon: Clock },
            { id: 'content', label: 'Announcements & Content', icon: FileText },
            { id: 'layouts', label: 'Layouts & Widgets', icon: Layers },
            { id: 'audio', label: 'Audio & Chimes', icon: Volume2 },
            { id: 'youtube', label: 'YouTube Stream', icon: Tv },
            { id: 'users', label: 'User Roles & Security', icon: Users },
            { id: 'audit', label: 'Audit Trail', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveMessage && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-2 w-full">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveMessage}</span>
          </div>
        </div>
      )}

      {/* Main CMS Tab Content */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 space-y-6">
        {!settings ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-rose-600" />
            <span>Loading database configuration...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: COUNTDOWN & ELECTION DAY DESK AUTOMATION */}
            {activeTab === 'countdown' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rose-600" />
                    <span>Election Day Countdown & Automatic Live Desk Switcher</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Configured for <strong>November 3, 2026, at 9:00 AM IST</strong>. When the timer expires, all active visitors are automatically routed to <code>/election-day-desk</code>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Countdown Target */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Active Target Timestamp (IST)
                    </span>
                    <div className="text-lg font-extrabold text-slate-900 font-mono">
                      {settings.targetDescription}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      ISO UTC: <code>{settings.countdownTargetISO}</code>
                    </div>
                  </div>

                  {/* Forced Activation Control */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-600" />
                        <span>Forced Activation Override</span>
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${settings.forcedElectionDayMode ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {settings.forcedElectionDayMode ? 'FORCED ACTIVE' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Toggle to immediately activate Election Day Desk for all visitors right now without waiting for the November 3 countdown to reach zero.
                    </p>
                    <button
                      onClick={() => handleSaveSettings({ forcedElectionDayMode: !settings.forcedElectionDayMode })}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        settings.forcedElectionDayMode
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {settings.forcedElectionDayMode ? 'Disable Forced Activation' : 'Force Activate /election-day-desk Now'}
                    </button>
                  </div>
                </div>

                {/* Auto-Open Toggle */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Automatic Visitor Navigation to /election-day-desk
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      When enabled, the client browser automatically transitions visitors into the live election desk upon countdown expiration without requiring any clicks.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoOpenElectionDayDesk}
                    onChange={(e) => handleSaveSettings({ autoOpenElectionDayDesk: e.target.checked })}
                    className="w-5 h-5 accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* Live Simulation Controls */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-slate-700" />
                        <span>Live Tabulation Simulation Controller</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Simulate real-time vote count accumulation, battleground race calls, and chamber seat gains.
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-600">
                      {settings.simulation.progressPct}% Progress
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.simulation.progressPct}
                    onChange={(e) => {
                      const pct = Number(e.target.value);
                      setSettings({
                        ...settings,
                        simulation: { ...settings.simulation, progressPct: pct }
                      });
                    }}
                    onMouseUp={(e: any) => {
                      handleSaveSettings({
                        simulation: {
                          ...settings.simulation,
                          progressPct: Number(e.target.value),
                          mode: Number(e.target.value) > 0 ? 'live_simulation' : 'countdown'
                        }
                      });
                    }}
                    className="w-full accent-rose-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>0% (Pre-Election Baseline)</span>
                    <span>50% (Peak Tabulation)</span>
                    <span>100% (Certified Outcomes)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANNOUNCEMENTS & CONTENT */}
            {activeTab === 'content' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Broadcast Content & Breaking News Announcement Bar</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage the television network header title, stream description, and top breaking alert banners.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Network Broadcast Title
                    </label>
                    <input
                      type="text"
                      value={settings.broadcastTitle}
                      onChange={(e) => setSettings({ ...settings, broadcastTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Stream Description
                    </label>
                    <textarea
                      rows={2}
                      value={settings.broadcastDescription}
                      onChange={(e) => setSettings({ ...settings, broadcastDescription: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  {/* Breaking Announcement Settings */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Top Breaking Announcement Chyron
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.breakingAnnouncement.active}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            breakingAnnouncement: {
                              ...settings.breakingAnnouncement,
                              active: e.target.checked
                            }
                          })
                        }
                        className="w-4 h-4 accent-rose-600 cursor-pointer"
                      />
                    </div>

                    <input
                      type="text"
                      value={settings.breakingAnnouncement.text}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          breakingAnnouncement: {
                            ...settings.breakingAnnouncement,
                            text: e.target.value
                          }
                        })
                      }
                      placeholder="Breaking announcement message..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                    />

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-semibold text-[11px]">Alert Level:</span>
                      {(['red', 'amber', 'blue'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              breakingAnnouncement: {
                                ...settings.breakingAnnouncement,
                                alertLevel: level
                              }
                            })
                          }
                          className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                            settings.breakingAnnouncement.alertLevel === level
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleSaveSettings({
                        broadcastTitle: settings.broadcastTitle,
                        broadcastDescription: settings.broadcastDescription,
                        breakingAnnouncement: settings.breakingAnnouncement
                      })
                    }
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Broadcast Content'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: LAYOUTS & WIDGET VISIBILITY */}
            {activeTab === 'layouts' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <span>Layout & Election Widget Visibility</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Toggle visibility of on-screen election widgets, 3D vs 2D cartographic perspective, and default color theme.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { key: 'showChamberCounters', label: 'Senate & House Majority Balance Bars' },
                    { key: 'showMap', label: 'Interactive 3D / 2D U.S. Map' },
                    { key: 'showNewsWire', label: 'Live Vertical Scrolling News Wire' },
                    { key: 'showTimeline', label: 'Official Election Chronology Timeline' },
                    { key: 'showAnalysis', label: 'AI Strategic Intelligence Desk' }
                  ].map((w) => (
                    <div
                      key={w.key}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">{w.label}</span>
                      <input
                        type="checkbox"
                        checked={(settings.layouts as any)[w.key]}
                        onChange={(e) =>
                          handleSaveSettings({
                            layouts: {
                              ...settings.layouts,
                              [w.key]: e.target.checked
                            }
                          })
                        }
                        className="w-4 h-4 accent-rose-600 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Default Map Camera Perspective</h4>
                    <p className="text-[11px] text-slate-500">Choose default 3D isometric tilt or 2D flat mode.</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 font-mono text-xs">
                    {(['3D', '2D'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() =>
                          handleSaveSettings({
                            layouts: { ...settings.layouts, defaultMapView: m }
                          })
                        }
                        className={`px-3 py-1 rounded font-bold ${
                          settings.layouts.defaultMapView === m
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {m} Mode
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AUDIO & SOUND ALERTS */}
            {activeTab === 'audio' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-emerald-600" />
                    <span>Audio & Sound Alert Settings</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Control broadcast ticker chimes and breaking-news sound effects for online visitors and livestreams.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Breaking News Audio Chimes</h4>
                      <p className="text-[11px] text-slate-500">Play pleasant broadcast chime when key race calls occur.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.audio.enableChimes}
                      onChange={(e) =>
                        handleSaveSettings({
                          audio: { ...settings.audio, enableChimes: e.target.checked }
                        })
                      }
                      className="w-5 h-5 accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Broadcast Alert Volume ({settings.audio.volume}%)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.audio.volume}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          audio: { ...settings.audio, volume: Number(e.target.value) }
                        })
                      }
                      onMouseUp={(e: any) =>
                        handleSaveSettings({
                          audio: { ...settings.audio, volume: Number(e.target.value) }
                        })
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: YOUTUBE & BROADCAST STREAM */}
            {activeTab === 'youtube' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Tv className="w-5 h-5 text-rose-600" />
                    <span>YouTube Livestream & OBS Broadcast Settings</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure the 16:9 embedded video stream on the live desk and OBS Studio overlays.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      YouTube Video ID
                    </label>
                    <input
                      type="text"
                      value={settings.youtubeVideoId}
                      onChange={(e) => setSettings({ ...settings, youtubeVideoId: e.target.value })}
                      placeholder="e.g. f0lYkdA-Gtw"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Autoplay Livestream on Page Load</h4>
                      <p className="text-[11px] text-slate-500">Muted autoplay permitted in compliance with browser policies.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.youtubeAutoPlay}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          youtubeAutoPlay: e.target.checked
                        })
                      }
                      className="w-4 h-4 accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() =>
                      handleSaveSettings({
                        youtubeVideoId: settings.youtubeVideoId,
                        youtubeAutoPlay: settings.youtubeAutoPlay
                      })
                    }
                    className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save YouTube Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: USERS & PASSWORD */}
            {activeTab === 'users' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-800" />
                    <span>Administrator Credentials & Security</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage master administrator <strong>Upasyo2007</strong> password and role permissions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Upasyo2007</span>
                      <span className="text-[11px] text-slate-500">Role: Super Admin · Master System Operator</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-white text-[10px] font-bold font-mono">
                      SUPER ADMIN
                    </span>
                  </div>
                </div>

                {/* Password update form */}
                <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Change Administrator Password
                  </h4>

                  {passwordChangeMessage && (
                    <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-800">
                      {passwordChangeMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Current password..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      New Password (min. 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New secure password..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs"
                  >
                    Update Master Password
                  </button>
                </form>
              </div>
            )}

            {/* TAB 7: AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>Security & Configuration Audit Log</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chronological ledger tracking all administrative actions, logins, and settings modifications.
                    </p>
                  </div>
                  <button
                    onClick={fetchCMSData}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Refresh logs"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp (UTC)</th>
                        <th className="py-2.5 px-3">User</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {log.username}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
