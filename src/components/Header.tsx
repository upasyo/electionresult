/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tv, Monitor, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  isElectionNightMode: boolean;
  setIsElectionNightMode: (val: boolean) => void;
  onOpenOBSGraphics: () => void;
  isLiveReporting: boolean;
  onOpenCMS?: () => void;
  onOpenDesk?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  isElectionNightMode,
  setIsElectionNightMode,
  onOpenOBSGraphics,
  isLiveReporting,
  onOpenCMS,
  onOpenDesk
}) => {
  const [timeET, setTimeET] = useState('');
  const [timeLocal, setTimeLocal] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeET(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' ET'
      );
      setTimeLocal(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) + ' Local'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'senate', label: 'Senate' },
    { id: 'house', label: 'House' },
    { id: 'governors', label: 'Governors' },
    { id: 'map', label: '3D Map' },
    { id: 'news', label: 'Live News' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'broadcast', label: 'Live Stream' },
    { id: 'analyst', label: 'AI Analyst' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md shadow-xs">
      {/* Top zone bar: Brand, Nav links, Action controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-rose-600 via-rose-700 to-blue-700 flex items-center justify-center text-white font-extrabold text-sm tracking-tighter shadow-md shadow-rose-950/20">
              DD
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap block leading-tight group-hover:text-rose-600 transition-colors">
                DECISION DESK <span className="text-rose-600 font-black">2026</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase block">
                U.S. Midterm Election Live
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Clocks & Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col text-right font-mono text-[11px] leading-tight text-slate-500 pr-2 border-r border-slate-200">
            <span className="text-slate-900 font-semibold">{timeET}</span>
            <span className="text-slate-500">{timeLocal}</span>
          </div>

          <button
            onClick={() => setIsElectionNightMode(!isElectionNightMode)}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              isElectionNightMode
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 ring-1 ring-rose-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title="Toggle Election Night 16:9 Broadcast Layout"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{isElectionNightMode ? 'Exit Broadcast' : 'Election Night Mode'}</span>
          </button>

          <button
            onClick={onOpenOBSGraphics}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 whitespace-nowrap transition-colors"
            title="Open OBS Studio Browser Source Overlays"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
            <span>OBS Source</span>
          </button>

          {onOpenDesk && (
            <button
              onClick={onOpenDesk}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white whitespace-nowrap transition-colors shadow-xs"
              title="Open Live Election Day Desk"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Live Desk</span>
            </button>
          )}

          {onOpenCMS && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 whitespace-nowrap transition-colors shadow-2xs"
              title="Open CMS Administrator Console"
            >
              <span>CMS Admin</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap transition-colors shadow-xs"
            title="Election Feed & Simulation Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Scroll Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-white border-t border-slate-200 text-xs gap-4 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                isActive ? 'text-rose-600 font-bold border-b-2 border-rose-600' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
