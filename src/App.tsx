/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  NationalOverview,
  SenateRace,
  GovernorRace,
  HouseDistrict,
  NewsArticle,
  TimelineEvent,
  AdminConfig
} from './types/election';
import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { NationalResultsBanner } from './components/NationalResultsBanner';
import { CountdownBanner } from './components/CountdownBanner';
import { USMap3D } from './components/USMap3D';
import { SenateDashboard } from './components/SenateDashboard';
import { HouseDashboard } from './components/HouseDashboard';
import { GovernorDashboard } from './components/GovernorDashboard';
import { LiveNewsPanel } from './components/LiveNewsPanel';
import { VerticalNewsScroller } from './components/VerticalNewsScroller';
import { BroadcastStudio } from './components/BroadcastStudio';
import { OBSGraphicsOverlay } from './components/OBSGraphicsOverlay';
import { ElectionTimeline } from './components/ElectionTimeline';
import { AIAnalysisPanel } from './components/AIAnalysisPanel';
import { AdminModal } from './components/AdminModal';
import { StateDetailModal } from './components/StateDetailModal';
import { CMSAdminDashboard } from './components/cms/CMSAdminDashboard';
import { ElectionDayDesk } from './components/ElectionDayDesk';
import {
  Flame,
  Sliders
} from 'lucide-react';

// Route detection helper for SPA navigation
function getInitialRoute(): string {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (pathname.includes('/cms-admin') || hash.includes('cms-admin')) return 'cms-admin';
  if (pathname.includes('/election-day-desk') || hash.includes('election-day-desk')) return 'election-day-desk';
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [overview, setOverview] = useState<NationalOverview | null>(null);
  const [senateRaces, setSenateRaces] = useState<SenateRace[]>([]);
  const [governorRaces, setGovernorRaces] = useState<GovernorRace[]>([]);
  const [houseDistricts, setHouseDistricts] = useState<HouseDistrict[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    mode: 'countdown',
    activeProvider: 'DECISION_DESK',
    pollingIntervalSeconds: 30,
    youtubeVideoId: 'f0lYkdA-Gtw',
    broadcastTitle: 'Decision Desk 2026: U.S. Midterm Election Live',
    broadcastDescription: 'Real-time race calls, Senate and House balance of power, and battleground analysis.',
    enableNewsFeed: true,
    simulationProgressPct: 0,
    hasAPCredentials: false,
    hasFECCredentials: false
  });

  // Public CMS config state
  const [publicConfig, setPublicConfig] = useState<{
    countdownTargetISO: string;
    shouldOpenElectionDayDesk: boolean;
    autoOpenElectionDayDesk: boolean;
    forcedElectionDayMode: boolean;
    announcementText?: string;
    announcementType?: string;
    broadcastTitle?: string;
    youtubeVideoId?: string;
    newsSourceAp?: boolean;
    newsSourceReuters?: boolean;
  }>({
    countdownTargetISO: '2026-11-03T03:30:00.000Z',
    shouldOpenElectionDayDesk: false,
    autoOpenElectionDayDesk: true,
    forcedElectionDayMode: false,
    broadcastTitle: 'Decision Desk 2026: Live Election Day Coverage',
    youtubeVideoId: 'f0lYkdA-Gtw'
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOBSGraphicsOpen, setIsOBSGraphicsOpen] = useState(false);
  const [isElectionNightMode, setIsElectionNightMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Navigate helper with history pushState
  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    const newPath = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  // Listen to popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Helper to fetch JSON safely and guard against non-JSON / HTML responses
  const safeFetchJson = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return { success: false };
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return { success: false };
      }
      return await res.json();
    } catch {
      return { success: false };
    }
  };

  // Fetch all election data without full-page reloads
  const fetchAllData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [
        overviewRes,
        senateRes,
        govRes,
        houseRes,
        newsRes,
        breakingRes,
        timelineRes,
        configRes,
        publicConfigRes
      ] = await Promise.all([
        safeFetchJson('/api/elections/overview'),
        safeFetchJson('/api/elections/senate'),
        safeFetchJson('/api/elections/governors'),
        safeFetchJson('/api/elections/house'),
        safeFetchJson('/api/news/latest'),
        safeFetchJson('/api/news/breaking'),
        safeFetchJson('/api/elections/timeline'),
        safeFetchJson('/api/admin/config'),
        safeFetchJson('/api/public/config')
      ]);

      if (overviewRes && overviewRes.success) setOverview(overviewRes.data);
      if (senateRes && senateRes.success) setSenateRaces(senateRes.races);
      if (govRes && govRes.success) setGovernorRaces(govRes.races);
      if (houseRes && houseRes.success) setHouseDistricts(houseRes.districts);
      if (newsRes && newsRes.success) setNewsArticles(newsRes.articles);
      if (breakingRes && breakingRes.success) setBreakingNews(breakingRes.breaking);
      if (timelineRes && timelineRes.success) setTimelineEvents(timelineRes.events);
      if (configRes && configRes.success) setAdminConfig(configRes.config);

      if (publicConfigRes && publicConfigRes.success) {
        const cfg = publicConfigRes;
        setPublicConfig({
          countdownTargetISO: cfg.countdownTargetISO || '2026-11-03T03:30:00.000Z',
          shouldOpenElectionDayDesk: Boolean(cfg.shouldOpenElectionDayDesk),
          autoOpenElectionDayDesk: cfg.autoOpenElectionDayDesk !== false,
          forcedElectionDayMode: Boolean(cfg.forcedElectionDayMode),
          announcementText: cfg.breakingAnnouncement?.active ? cfg.breakingAnnouncement.text : undefined,
          announcementType: cfg.breakingAnnouncement?.alertLevel,
          broadcastTitle: cfg.broadcastTitle,
          youtubeVideoId: cfg.youtubeVideoId
        });

        // AUTOMATIC OPENING OF ELECTION DAY DESK:
        // When countdown expires or forced election day mode is active, automatically open /election-day-desk
        // for all visitors without manual interaction (unless already in CMS Admin console).
        if (
          cfg.shouldOpenElectionDayDesk &&
          cfg.autoOpenElectionDayDesk !== false &&
          currentRoute === 'home'
        ) {
          navigateTo('election-day-desk');
        }
      }

      setLastFetchTime(new Date());
      setFetchError(null);
    } catch (err: any) {
      console.error('Error fetching election data:', err);
      setFetchError('Network latency encountered. Cached election baseline is preserved.');
    } finally {
      setIsRefreshing(false);
    }
  }, [currentRoute]);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Background polling interval
  useEffect(() => {
    const intervalSec = Math.max(10, adminConfig.pollingIntervalSeconds || 20);
    const timer = setInterval(() => {
      fetchAllData();
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [adminConfig.pollingIntervalSeconds, fetchAllData]);

  // Handle saving legacy admin config
  const handleSaveConfig = async (updated: Partial<AdminConfig>) => {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    const data = await res.json();
    if (data.success) {
      setAdminConfig(data.config);
      await fetchAllData();
    }
  };

  const isLiveReporting =
    (adminConfig.mode === 'live_simulation' && adminConfig.simulationProgressPct > 0) ||
    publicConfig.forcedElectionDayMode ||
    publicConfig.shouldOpenElectionDayDesk;

  // ROUTE 1: CMS Administrator Console (/cms-admin)
  if (currentRoute === 'cms-admin') {
    return (
      <CMSAdminDashboard
        onBackToSite={() => navigateTo('home')}
        onOpenElectionDesk={() => navigateTo('election-day-desk')}
      />
    );
  }

  // ROUTE 2: Live Election Day Desk (/election-day-desk)
  if (currentRoute === 'election-day-desk') {
    return (
      <ElectionDayDesk
        overview={overview}
        senateRaces={senateRaces}
        governorRaces={governorRaces}
        houseDistricts={houseDistricts}
        newsArticles={newsArticles}
        breakingNews={breakingNews}
        youtubeVideoId={publicConfig.youtubeVideoId || adminConfig.youtubeVideoId}
        broadcastTitle={publicConfig.broadcastTitle || adminConfig.broadcastTitle}
        onRefresh={fetchAllData}
        isRefreshing={isRefreshing}
        onExitDesk={() => navigateTo('home')}
        onOpenCMS={() => navigateTo('cms-admin')}
        cmsAnnouncement={publicConfig.announcementText}
      />
    );
  }

  // ROUTE 3: Standard Public Newsroom Website
  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans ${isElectionNightMode ? 'overflow-hidden' : ''}`}>
      {/* 1. Breaking News Ticker (Topmost Horizontal Chyron) */}
      <BreakingNewsTicker
        articles={breakingNews.length > 0 ? breakingNews : newsArticles}
        isLiveReporting={isLiveReporting}
      />

      {/* 2. Television Network Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isElectionNightMode={isElectionNightMode}
        setIsElectionNightMode={setIsElectionNightMode}
        onOpenOBSGraphics={() => setIsOBSGraphicsOpen(true)}
        isLiveReporting={isLiveReporting}
        onOpenCMS={() => navigateTo('cms-admin')}
        onOpenDesk={() => navigateTo('election-day-desk')}
      />

      {/* Breaking / Administrative Announcement Banner from CMS if configured */}
      {publicConfig.announcementText && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[11px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
              ANNOUNCEMENT
            </span>
            <span className="font-medium">{publicConfig.announcementText}</span>
          </div>
        </div>
      )}

      {/* 3. Bold Full-Width National Results Banner (Senate & House bars) */}
      <NationalResultsBanner
        overview={overview}
        onRefresh={fetchAllData}
        isRefreshing={isRefreshing}
      />

      {/* Error alert toast if network fails */}
      {fetchError && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-xs px-4 py-2 flex items-center justify-between">
          <span>{fetchError}</span>
          <button
            onClick={fetchAllData}
            className="underline font-semibold text-amber-950 ml-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* MAIN VIEWPORT LAYOUT */}
      {isElectionNightMode ? (
        /* =========================================================================
           AUTOMATED ELECTION-NIGHT MODE: 16:9 Full-screen Broadcast Dashboard
           ========================================================================= */
        <main className="flex-1 p-4 md:p-6 bg-slate-900 text-slate-100 flex flex-col justify-between">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Left 8 Cols: Large Interactive 3D Map + Livestream video */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <USMap3D
                senateRaces={senateRaces}
                governorRaces={governorRaces}
                houseDistricts={houseDistricts}
                onSelectState={(abbr) => setSelectedState(abbr)}
                selectedState={selectedState}
              />
            </div>

            {/* Right 4 Cols: Live Vertical Wire & Fast Battleground Status */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <VerticalNewsScroller articles={newsArticles} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Full-Screen 16:9 Election Night Broadcast Mode Active</span>
            </span>
            <button
              onClick={() => setIsElectionNightMode(false)}
              className="text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
            >
              Exit Full-Screen Broadcast
            </button>
          </div>
        </main>
      ) : (
        /* =========================================================================
           STANDARD DESKTOP / MOBILE NEWSROOM MULTI-COLUMN INTERFACE
           ========================================================================= */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
          {/* Official Countdown Banner configured for November 3, 2026, at 9:00 AM IST */}
          <CountdownBanner
            isSimulationActive={adminConfig.mode === 'live_simulation' || publicConfig.forcedElectionDayMode}
            targetISO={publicConfig.countdownTargetISO || '2026-11-03T03:30:00.000Z'}
            onExpire={() => {
              // Automatically open /election-day-desk when countdown expires
              navigateTo('election-day-desk');
            }}
            onOpenDesk={() => navigateTo('election-day-desk')}
            onActivateSimulation={() => {
              handleSaveConfig({ mode: 'live_simulation', simulationProgressPct: 25 });
            }}
          />

          {/* Tab Content Routing */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top row: 3D Map (Left 8 cols) + Vertical News Wire (Right 4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <USMap3D
                    senateRaces={senateRaces}
                    governorRaces={governorRaces}
                    houseDistricts={houseDistricts}
                    onSelectState={(abbr) => setSelectedState(abbr)}
                    selectedState={selectedState}
                  />
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <VerticalNewsScroller articles={newsArticles} />
                </div>
              </div>

              {/* Senate Battlefield Snapshot */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                    Critical Senate Contests
                  </h3>
                  <button
                    onClick={() => setActiveTab('senate')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    View All 33 Races →
                  </button>
                </div>
                <SenateDashboard
                  races={senateRaces}
                  onSelectState={(abbr) => setSelectedState(abbr)}
                />
              </div>

              {/* Competitive House Districts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                    U.S. House Battlefield
                  </h3>
                  <button
                    onClick={() => setActiveTab('house')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    View All Competitive Districts →
                  </button>
                </div>
                <HouseDashboard
                  districts={houseDistricts}
                  overview={overview}
                  onSelectState={(abbr) => setSelectedState(abbr)}
                />
              </div>

              {/* Gubernatorial Elections */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                    State Governors' Mansions
                  </h3>
                  <button
                    onClick={() => setActiveTab('governors')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    View All 36 Governor Races →
                  </button>
                </div>
                <GovernorDashboard
                  races={governorRaces}
                  onSelectState={(abbr) => setSelectedState(abbr)}
                />
              </div>
            </div>
          )}

          {activeTab === 'senate' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    2026 U.S. Senate General Elections
                  </h2>
                  <p className="text-xs text-slate-600">
                    33 Class II Senate seats are up for regular election. Republicans defend 20 seats; Democrats defend 13.
                  </p>
                </div>
              </div>
              <SenateDashboard
                races={senateRaces}
                onSelectState={(abbr) => setSelectedState(abbr)}
              />
            </div>
          )}

          {activeTab === 'house' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    2026 U.S. House of Representatives
                  </h2>
                  <p className="text-xs text-slate-600">
                    All 435 voting congressional districts are contested. 218 seats are required for majority control.
                  </p>
                </div>
              </div>
              <HouseDashboard
                districts={houseDistricts}
                overview={overview}
                onSelectState={(abbr) => setSelectedState(abbr)}
              />
            </div>
          )}

          {activeTab === 'governors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    2026 Gubernatorial Elections
                  </h2>
                  <p className="text-xs text-slate-600">
                    36 state governorships are on the ballot across key battlegrounds and open executive seats.
                  </p>
                </div>
              </div>
              <GovernorDashboard
                races={governorRaces}
                onSelectState={(abbr) => setSelectedState(abbr)}
              />
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Interactive 3D Electoral Map
                </h2>
                <p className="text-xs text-slate-600">
                  Filter by Senate, House, and Governor races. Rotate, pan, and click any state to inspect district boundaries and vote shares.
                </p>
              </div>
              <USMap3D
                senateRaces={senateRaces}
                governorRaces={governorRaces}
                houseDistricts={houseDistricts}
                onSelectState={(abbr) => setSelectedState(abbr)}
                selectedState={selectedState}
              />
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Live Election Wire & Editorial Coverage
                </h2>
                <p className="text-xs text-slate-600">
                  Real-time reporting from credentialed national news desks and wire services.
                </p>
              </div>
              <LiveNewsPanel articles={newsArticles} />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Election Night Chronology & Poll Closing Timeline
                </h2>
                <p className="text-xs text-slate-600">
                  State-by-state poll closures and verified race call milestones from 6:00 PM to 1:00 AM ET.
                </p>
              </div>
              <ElectionTimeline events={timelineEvents} />
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Live Video Stream & Broadcast Studio
                </h2>
                <p className="text-xs text-slate-600">
                  Synchronized live network commentary and real-time lower-third graphics.
                </p>
              </div>
              <BroadcastStudio
                overview={overview}
                senateRaces={senateRaces}
                houseDistricts={houseDistricts}
                breakingNews={breakingNews}
                youtubeVideoId={publicConfig.youtubeVideoId || adminConfig.youtubeVideoId}
                broadcastTitle={publicConfig.broadcastTitle || adminConfig.broadcastTitle}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenOBSGraphics={() => setIsOBSGraphicsOpen(true)}
              />
            </div>
          )}

          {activeTab === 'analyst' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Election Analyst & Forecast Simulator
                </h2>
                <p className="text-xs text-slate-600">
                  Deep-dive scenario generator comparing swing-seat shifts, turnout models, and historical precedents.
                </p>
              </div>
              <AIAnalysisPanel overview={overview} />
            </div>
          )}
        </main>
      )}

      {/* 4. FOOTER & COMPLIANCE */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight">
              DECISION DESK 2026
            </span>
            <span>·</span>
            <span>U.S. Midterm Election Live Results Desk</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Pipeline: Decision Desk Feed & Associated Press Baselines</span>
            </span>
            <span>·</span>
            <span>Last Sync: {lastFetchTime.toLocaleTimeString()}</span>
            <span>·</span>
            <button
              onClick={() => navigateTo('election-day-desk')}
              className="text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
            >
              Election Day Desk
            </button>
            <span>·</span>
            <button
              onClick={() => navigateTo('cms-admin')}
              className="text-blue-600 hover:text-blue-800 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3" />
              <span>CMS Admin</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* State Detail Modal */}
      {selectedState && (
        <StateDetailModal
          stateAbbr={selectedState}
          senateRaces={senateRaces}
          governorRaces={governorRaces}
          houseDistricts={houseDistricts}
          onClose={() => setSelectedState(null)}
        />
      )}

      {/* Administrator Configuration Modal */}
      <AdminModal
        config={adminConfig}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSaveConfig={handleSaveConfig}
      />

      {/* OBS Studio Full-Screen Graphics Overlay */}
      {isOBSGraphicsOpen && (
        <OBSGraphicsOverlay
          overview={overview}
          senateRaces={senateRaces}
          houseDistricts={houseDistricts}
          breakingNews={breakingNews}
          onClose={() => setIsOBSGraphicsOpen(false)}
        />
      )}
    </div>
  );
}
