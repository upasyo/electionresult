/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminConfig } from '../types/election';
import { X, Sliders, Save } from 'lucide-react';

interface AdminModalProps {
  config: AdminConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (updated: Partial<AdminConfig>) => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig
}) => {
  const [mode, setMode] = useState<AdminConfig['mode']>(config.mode);
  const [provider, setProvider] = useState<AdminConfig['activeProvider']>(config.activeProvider);
  const [pollingInterval, setPollingInterval] = useState(config.pollingIntervalSeconds);
  const [youtubeId, setYoutubeId] = useState(config.youtubeVideoId);
  const [broadcastTitle, setBroadcastTitle] = useState(config.broadcastTitle);
  const [simProgress, setSimProgress] = useState(config.simulationProgressPct);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await onSaveConfig({
        mode,
        activeProvider: provider,
        pollingIntervalSeconds: Number(pollingInterval),
        youtubeVideoId: youtubeId,
        broadcastTitle,
        simulationProgressPct: Number(simProgress)
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Decision Desk Network Settings & Admin
              </h3>
              <p className="text-xs text-slate-500">
                Data Providers, Simulation Speed, and Broadcast Configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Election Network Operating Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('countdown')}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  mode === 'countdown'
                    ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold text-slate-900">Pre-Election Countdown</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Verified candidate baseline, uncalled races, official countdown.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('live_simulation')}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  mode === 'live_simulation'
                    ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold text-slate-900">Live Election Night Mode</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Simulate live vote counting, precinct progress, and race calls.
                </div>
              </button>
            </div>
          </div>

          {mode === 'live_simulation' && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-700">
                  Election Night Simulation Progress: {simProgress}%
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {simProgress === 0
                    ? '06:00 ET (Polls Opening)'
                    : simProgress < 50
                    ? '20:00 ET (East Coast Closing)'
                    : simProgress < 90
                    ? '23:00 ET (West Coast Tabulating)'
                    : 'Final Balance Called'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simProgress}
                onChange={(e) => setSimProgress(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Pre-Election)</span>
                <span>50% (Mid-Evening Peak)</span>
                <span>100% (Certified Calls)</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Active Data Adapter
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-600"
            >
              <option value="DECISION_DESK">Decision Desk Live Consensus Feed (Internal)</option>
              <option value="AP">Associated Press Election API Adapter</option>
              <option value="FEC">Federal Election Commission (FEC) Official Feed</option>
              <option value="STATE_ELECTIONS">State Secretaries of State Returns Aggregator</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              YouTube Livestream Video ID (16:9 Player)
            </label>
            <input
              type="text"
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="e.g. f0lYkdA-Gtw (Public YouTube Video ID)"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Automatic Refresh Interval (Seconds)
            </label>
            <div className="flex items-center gap-2">
              {[10, 30, 60, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setPollingInterval(sec)}
                  className={`flex-1 py-1.5 rounded-lg border text-center transition-colors font-mono ${
                    pollingInterval === sec
                      ? 'bg-rose-600 border-rose-600 text-white font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span>Associated Press API Key:</span>
              <span className={config.hasAPCredentials ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                {config.hasAPCredentials ? 'Configured in Environment' : 'Using Demo Adapter'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gemini 3.8 Flash AI Key:</span>
              <span className="text-emerald-700 font-semibold">Available via Server Proxy</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Apply Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
