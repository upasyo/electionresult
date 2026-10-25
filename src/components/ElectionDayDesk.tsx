/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  NationalOverview,
  SenateRace,
  GovernorRace,
  HouseDistrict,
  NewsArticle
} from '../types/election';
import { USMap3D } from './USMap3D';
import { StateDetailModal } from './StateDetailModal';
import {
  Radio,
  Tv,
  Volume2,
  Maximize2,
  Minimize2,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Flame,
  Award,
  Clock,
  Landmark,
  Sliders
} from 'lucide-react';

interface ElectionDayDeskProps {
  overview: NationalOverview | null;
  senateRaces: SenateRace[];
  governorRaces: GovernorRace[];
  houseDistricts: HouseDistrict[];
  newsArticles: NewsArticle[];
  breakingNews: NewsArticle[];
  youtubeVideoId?: string;
  broadcastTitle?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExitDesk: () => void;
  onOpenCMS: () => void;
  cmsAnnouncement?: string;
}

export const ElectionDayDesk: React.FC<ElectionDayDeskProps> = ({
  overview,
  senateRaces,
  governorRaces,
  houseDistricts,
  newsArticles,
  breakingNews,
  youtubeVideoId = 'f0lYkdA-Gtw',
  broadcastTitle = 'Decision Desk 2026: Live Election Day Coverage',
  onRefresh,
  isRefreshing,
  onExitDesk,
  onOpenCMS,
  cmsAnnouncement
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'video' | 'split'>('split');
  const [audioStingerEnabled] = useState(true);
  const deskContainerRef = useRef<HTMLDivElement>(null);

  // Synthesize broadcast sound effects with Web Audio API (safe, zero external asset dependencies)
  const playBroadcastStinger = () => {
    if (!audioStingerEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // 4-tone news fanfare (Major triad chime)
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      frequencies.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.38);
      });
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      deskContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Identify called races
  const calledSenate = senateRaces.filter(
    (r) => r.status.startsWith('called_') || r.winnerParty !== undefined
  );
  const calledGovernors = governorRaces.filter(
    (r) => r.status.startsWith('called_') || r.winnerParty !== undefined
  );

  const senateD = overview?.senate.demSeatsHeld ?? 47;
  const senateR = overview?.senate.repSeatsHeld ?? 49;
  const senateI = overview?.senate.indSeatsHeld ?? 2;
  const senateUncalled = overview?.senate.uncalledSeats ?? 2;

  const houseD = overview?.house.demSeatsWon ?? 208;
  const houseR = overview?.house.repSeatsWon ?? 217;
  const houseUncalled = overview?.house.uncalledSeats ?? 10;

  return (
    <div
      ref={deskContainerRef}
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none"
    >
      {/* 1. TOP BROADCAST CHYRON & LIVE INDICATOR */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 sticky top-0 shadow-md">
        <div className="flex items-center gap-3">
          {/* Live Badge */}
          <div className="flex items-center gap-1.5 bg-rose-600 px-2.5 py-1 rounded text-[11px] font-black tracking-widest text-white uppercase animate-pulse shadow-xs">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE DESK</span>
          </div>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                NATIONAL ELECTION DAY DESK
              </span>
              <span className="text-[11px] bg-blue-600/30 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-500/30">
                2026 MIDTERMS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Target: Tuesday, Nov 3, 2026 · 9:00 AM IST / 19:00 ET · Official Poll Desk
            </span>
          </div>
        </div>

        {/* Global Announcement if active */}
        {cmsAnnouncement && (
          <div className="hidden md:flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs text-amber-300 font-medium max-w-md truncate">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span className="truncate">{cmsAnnouncement}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setActiveView('split')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeView === 'split' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeView === 'map' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              3D Map
            </button>
            <button
              onClick={() => setActiveView('video')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeView === 'video' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Live Video
            </button>
          </div>

          <button
            onClick={playBroadcastStinger}
            title="Test Broadcast Audio Chime"
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Refresh Vote Tabulations"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Broadcast'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCMS}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>CMS Admin</span>
          </button>

          <button
            onClick={onExitDesk}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Site</span>
          </button>
        </div>
      </header>

      {/* 2. TELEVISION NETWORK BALANCE OF POWER BARS */}
      <section className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Senate Balance Bar (51 to win) */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
              <span className="font-bold text-slate-200 uppercase flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-blue-400" />
                U.S. SENATE (51 TO CONTROL)
              </span>
              <span className="text-slate-400">100 TOTAL SEATS</span>
            </div>

            <div className="flex items-center justify-between text-lg font-black mb-1.5 font-mono">
              <div className="flex items-baseline gap-1 text-blue-400">
                <span className="text-2xl">{senateD}</span>
                <span className="text-xs uppercase font-semibold text-slate-400">Dem</span>
              </div>
              <div className="text-xs text-amber-400 font-semibold uppercase">
                {senateUncalled} Uncalled
              </div>
              <div className="flex items-baseline gap-1 text-rose-400">
                <span className="text-xs uppercase font-semibold text-slate-400">Rep</span>
                <span className="text-2xl">{senateR}</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
              <div
                style={{ width: `${(senateD / 100) * 100}%` }}
                className="bg-blue-600 transition-all duration-500"
              />
              <div
                style={{ width: `${(senateI / 100) * 100}%` }}
                className="bg-purple-600 transition-all duration-500"
              />
              <div
                style={{ width: `${(senateUncalled / 100) * 100}%` }}
                className="bg-slate-700 transition-all duration-500"
              />
              <div
                style={{ width: `${(senateR / 100) * 100}%` }}
                className="bg-rose-600 transition-all duration-500"
              />
              {/* 51 Center Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xs z-10"
                style={{ left: '51%' }}
                title="51 Seats for Majority"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{senateD >= 51 ? 'DEMOCRATIC MAJORITY' : `${51 - senateD} to 51`}</span>
              <span className="text-white font-bold">51 Majority</span>
              <span>{senateR >= 51 ? 'REPUBLICAN MAJORITY' : `${51 - senateR} to 51`}</span>
            </div>
          </div>

          {/* House Balance Bar (218 to win) */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
              <span className="font-bold text-slate-200 uppercase flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-rose-400" />
                U.S. HOUSE (218 TO CONTROL)
              </span>
              <span className="text-slate-400">435 TOTAL SEATS</span>
            </div>

            <div className="flex items-center justify-between text-lg font-black mb-1.5 font-mono">
              <div className="flex items-baseline gap-1 text-blue-400">
                <span className="text-2xl">{houseD}</span>
                <span className="text-xs uppercase font-semibold text-slate-400">Dem</span>
              </div>
              <div className="text-xs text-amber-400 font-semibold uppercase">
                {houseUncalled} Uncalled
              </div>
              <div className="flex items-baseline gap-1 text-rose-400">
                <span className="text-xs uppercase font-semibold text-slate-400">Rep</span>
                <span className="text-2xl">{houseR}</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
              <div
                style={{ width: `${(houseD / 435) * 100}%` }}
                className="bg-blue-600 transition-all duration-500"
              />
              <div
                style={{ width: `${(houseUncalled / 435) * 100}%` }}
                className="bg-slate-700 transition-all duration-500"
              />
              <div
                style={{ width: `${(houseR / 435) * 100}%` }}
                className="bg-rose-600 transition-all duration-500"
              />
              {/* 218 Center Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xs z-10"
                style={{ left: `${(218 / 435) * 100}%` }}
                title="218 Seats for Majority"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{houseD >= 218 ? 'DEMOCRATIC MAJORITY' : `${218 - houseD} to 218`}</span>
              <span className="text-white font-bold">218 Majority</span>
              <span>{houseR >= 218 ? 'REPUBLICAN MAJORITY' : `${218 - houseR} to 218`}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN LIVE DESK WORKSPACE (Split or Full Map / Video) */}
      <main className="flex-1 p-3 md:p-5 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column (Map / Video) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {activeView === 'split' ? (
            <div className="flex flex-col space-y-4 flex-1">
              {/* Live Video Player embed */}
              <div className="bg-black rounded-xl overflow-hidden border border-slate-800 relative aspect-video shadow-lg">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=1&enablejsapi=1&rel=0`}
                  title={broadcastTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs text-[11px] px-2.5 py-1 rounded text-white font-mono flex items-center gap-1.5 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>LIVE ELECTION BROADCAST FEED</span>
                </div>
              </div>

              {/* 3D Map */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Interactive 3D Electoral Battlefield
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Click any state for real-time county tally</span>
                  </div>
                </div>
                <USMap3D
                  senateRaces={senateRaces}
                  governorRaces={governorRaces}
                  houseDistricts={houseDistricts}
                  onSelectState={(abbr) => setSelectedState(abbr)}
                  selectedState={selectedState}
                />
              </div>
            </div>
          ) : activeView === 'map' ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md flex-1">
              <USMap3D
                senateRaces={senateRaces}
                governorRaces={governorRaces}
                houseDistricts={houseDistricts}
                onSelectState={(abbr) => setSelectedState(abbr)}
                selectedState={selectedState}
              />
            </div>
          ) : (
            <div className="bg-black rounded-xl overflow-hidden border border-slate-800 aspect-video shadow-2xl flex-1">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=0&enablejsapi=1&rel=0`}
                title={broadcastTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Right Column: Decision Wire & Called Races Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Decision Desk Projections Wire */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black tracking-wider uppercase text-white">
                  Decision Desk Calls & Projections
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                {calledSenate.length + calledGovernors.length} Verified Calls
              </span>
            </div>

            {/* List of Race Calls */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[460px] pr-1">
              {calledSenate.length === 0 && calledGovernors.length === 0 ? (
                <div className="text-center py-10 px-4 text-slate-400 text-xs">
                  <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2 animate-pulse" />
                  <p className="font-semibold text-slate-300">Polls are actively closing.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    First official race projections will appear here as soon as state tabulations cross statutory projection thresholds.
                  </p>
                </div>
              ) : (
                <>
                  {calledSenate.map((race) => {
                    const winnerCandidate = race.candidates.find(
                      (c) => c.isWinner || c.isProjectedWinner || c.party === race.winnerParty
                    );
                    const winnerParty = race.winnerParty || winnerCandidate?.party || 'DEM';
                    return (
                      <div
                        key={`senate-${race.state}`}
                        onClick={() => setSelectedState(race.state)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] ${
                          winnerParty === 'DEM'
                            ? 'bg-blue-950/40 border-blue-800/80 text-blue-100'
                            : winnerParty === 'REP'
                            ? 'bg-rose-950/40 border-rose-800/80 text-rose-100'
                            : 'bg-slate-800 border-slate-700 text-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-white uppercase">{race.stateName} Senate</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600/90 text-white font-bold text-[9px] uppercase tracking-wider">
                            PROJECTED WINNER
                          </span>
                        </div>
                        <div className="font-extrabold text-sm text-white">
                          {winnerCandidate ? winnerCandidate.name : 'Race Projected'} ({winnerParty})
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>{race.precinctsReportingPct}% precincts reporting</span>
                          <span>{race.dataSource || 'Decision Desk'}</span>
                        </div>
                      </div>
                    );
                  })}

                  {calledGovernors.map((race) => {
                    const winnerCandidate = race.candidates.find(
                      (c) => c.isWinner || c.isProjectedWinner || c.party === race.winnerParty
                    );
                    const winnerParty = race.winnerParty || winnerCandidate?.party || 'DEM';
                    return (
                      <div
                        key={`gov-${race.state}`}
                        onClick={() => setSelectedState(race.state)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] ${
                          winnerParty === 'DEM'
                            ? 'bg-blue-950/40 border-blue-800/80 text-blue-100'
                            : winnerParty === 'REP'
                            ? 'bg-rose-950/40 border-rose-800/80 text-rose-100'
                            : 'bg-slate-800 border-slate-700 text-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-white uppercase">{race.stateName} Governor</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600/90 text-white font-bold text-[9px] uppercase tracking-wider">
                            PROJECTED WINNER
                          </span>
                        </div>
                        <div className="font-extrabold text-sm text-white">
                          {winnerCandidate ? winnerCandidate.name : 'Race Projected'} ({winnerParty})
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>{race.precinctsReportingPct}% precincts reporting</span>
                          <span>{race.dataSource || 'Decision Desk'}</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Real-time Wire Feed */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-slate-300 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE NATIONAL ELECTION WIRE</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs text-slate-300 pr-1">
              {(breakingNews.length > 0 ? breakingNews : newsArticles).slice(0, 6).map((item) => (
                <div key={item.id} className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                    <span className="text-rose-400 font-bold">{item.publisher}</span>
                    <span>{item.publishedAt}</span>
                  </div>
                  <a
                    href={item.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-white transition-colors block"
                  >
                    {item.headline}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 4. FOOTER BROADCAST CHYRON TICKER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-2 px-4 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="truncate">
            Official 2026 Midterm Election Night Broadcast Desk · Uninterrupted Real-Time Data Pipeline
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px]">
          <span>Source: Official Tabulators & AP Decision Desk</span>
          <button
            onClick={onExitDesk}
            className="text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer"
          >
            Return to Newsroom
          </button>
        </div>
      </footer>

      {/* State Detail Modal if clicked on map or called race */}
      {selectedState && (
        <StateDetailModal
          stateAbbr={selectedState}
          senateRaces={senateRaces}
          governorRaces={governorRaces}
          houseDistricts={houseDistricts}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
};
