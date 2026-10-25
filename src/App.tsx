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
import {
  Radio,
  Tv,
  Maximize2,
  Minimize2,
  RefreshCw,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Landmark,
  ShieldCheck
} from 'lucide-react';

export default function App() {
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

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOBSGraphicsOpen, setIsOBSGraphicsOpen] = useState(false);
  const [isElectionNightMode, setIsElectionNightMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);

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
        configRes
      ] = await Promise.all([
        fetch('/api/elections/overview').then((r) => r.json()),
        fetch('/api/elections/senate').then((r) => r.json()),
        fetch('/api/elections/governors').then((r) => r.json()),
        fetch('/api/elections/house').then((r) => r.json()),
        fetch('/api/news/latest').then((r) => r.json()),
        fetch('/api/news/breaking').then((r) => r.json()),
        fetch('/api/elections/timeline').then((r) => r.json()),
        fetch('/api/admin/config').then((r) => r.json())
      ]);

      if (overviewRes.success) setOverview(overviewRes.data);
      if (senateRes.success) setSenateRaces(senateRes.races);
      if (govRes.success) setGovernorRaces(govRes.races);
      if (houseRes.success) setHouseDistricts(houseRes.districts);
      if (newsRes.success) setNewsArticles(newsRes.articles);
      if (breakingRes.success) setBreakingNews(breakingRes.breaking);
      if (timelineRes.success) setTimelineEvents(timelineRes.events);
      if (configRes.success) setAdminConfig(configRes.config);

      setLastFetchTime(new Date());
      setFetchError(null);
    } catch (err: any) {
      console.error('Error fetching election data:', err);
      setFetchError('Network latency encountered. Cached election baseline is preserved.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and automatic polling interval
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const intervalSec = Math.max(10, adminConfig.pollingIntervalSeconds || 30);
    const timer = setInterval(() => {
      fetchAllData();
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [adminConfig.pollingIntervalSeconds, fetchAllData]);

  // Handle saving admin configuration
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

  const isLiveReporting = adminConfig.mode === 'live_simulation' && adminConfig.simulationProgressPct > 0;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${isElectionNightMode ? 'overflow-hidden' : ''}`}>
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
      />

      {/* 3. Bold Full-Width National Results Banner (Senate & House bars) */}
      <NationalResultsBanner
        overview={overview}
        onRefresh={fetchAllData}
        isRefreshing={isRefreshing}
      />

      {/* Error alert toast if network fails */}
      {fetchError && (
        <div className="bg-amber-950/80 border-b border-amber-800 text-amber-200 text-xs px-4 py-2 flex items-center justify-between">
          <span>{fetchError}</span>
          <button
            onClick={fetchAllData}
            className="underline font-semibold text-white ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* MAIN VIEWPORT LAYOUT */}
      {isElectionNightMode ? (
        /* =========================================================================
           10. AUTOMATED ELECTION-NIGHT MODE: 16:9 Full-screen Broadcast Dashboard
           ========================================================================= */
        <main className="flex-1 p-4 md:p-6 bg-slate-950 flex flex-col justify-between">
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
              className="text-rose-400 hover:text-rose-300 font-semibold underline"
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
          {/* Official Countdown Banner (Target Nov 3, 2026) */}
          <CountdownBanner
            isSimulationActive={adminConfig.mode === 'live_simulation'}
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
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
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
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View District Breakdown →
                  </button>
                </div>
                <HouseDashboard
                  districts={houseDistricts}
                  overview={overview}
                  onSelectState={(abbr) => setSelectedState(abbr)}
                />
              </div>
            </div>
          )}

          {activeTab === 'senate' && (
            <SenateDashboard
              races={senateRaces}
              onSelectState={(abbr) => setSelectedState(abbr)}
            />
          )}

          {activeTab === 'house' && (
            <HouseDashboard
              districts={houseDistricts}
              overview={overview}
              onSelectState={(abbr) => setSelectedState(abbr)}
            />
          )}

          {activeTab === 'governors' && (
            <GovernorDashboard
              races={governorRaces}
              onSelectState={(abbr) => setSelectedState(abbr)}
            />
          )}

          {activeTab === 'map' && (
            <USMap3D
              senateRaces={senateRaces}
              governorRaces={governorRaces}
              houseDistricts={houseDistricts}
              onSelectState={(abbr) => setSelectedState(abbr)}
              selectedState={selectedState}
            />
          )}

          {activeTab === 'news' && (
            <LiveNewsPanel articles={newsArticles} />
          )}

          {activeTab === 'timeline' && (
            <ElectionTimeline events={timelineEvents} />
          )}

          {activeTab === 'broadcast' && (
            <BroadcastStudio
              overview={overview}
              senateRaces={senateRaces}
              houseDistricts={houseDistricts}
              breakingNews={breakingNews}
              youtubeVideoId={adminConfig.youtubeVideoId}
              broadcastTitle={adminConfig.broadcastTitle}
              onOpenAdmin={() => setIsAdminOpen(true)}
              onOpenOBSGraphics={() => setIsOBSGraphicsOpen(true)}
            />
          )}

          {activeTab === 'analyst' && (
            <AIAnalysisPanel overview={overview} />
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 px-4 sm:px-6 text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900">DECISION DESK 2026</span>
            <span>·</span>
            <span>U.S. Midterm Election Live Results & News Network</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Election Date: November 3, 2026</span>
            <span>·</span>
            <span>Data Feeds: AP, FEC, State Boards</span>
            <span>·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Network Control Panel
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* State Detail Modal */}
      <StateDetailModal
        stateAbbr={selectedState}
        senateRaces={senateRaces}
        governorRaces={governorRaces}
        houseDistricts={houseDistricts}
        onClose={() => setSelectedState(null)}
      />

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
