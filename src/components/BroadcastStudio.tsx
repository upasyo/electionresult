/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NationalOverview, SenateRace, HouseDistrict, NewsArticle } from '../types/election';
import { Tv, Monitor, Settings, Shield } from 'lucide-react';

interface BroadcastStudioProps {
  overview: NationalOverview | null;
  senateRaces: SenateRace[];
  houseDistricts: HouseDistrict[];
  breakingNews: NewsArticle[];
  youtubeVideoId: string;
  broadcastTitle: string;
  onOpenAdmin: () => void;
  onOpenOBSGraphics: () => void;
}

export const BroadcastStudio: React.FC<BroadcastStudioProps> = ({
  overview,
  senateRaces,
  houseDistricts,
  breakingNews,
  youtubeVideoId,
  broadcastTitle,
  onOpenAdmin,
  onOpenOBSGraphics
}) => {
  const topKeyRaces = senateRaces.filter((r) => r.keyRace).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Decision Desk Broadcast Control Room</span>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold uppercase animate-pulse">
                ON AIR
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              16:9 Television Network Livestream & Synchronized Decision Graphics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOBSGraphics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Monitor className="w-4 h-4" />
            <span>Launch OBS Browser Source</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Change Video Stream</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-200 shadow-xl">
            {youtubeVideoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0`}
                title="Live Election Stream"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center bg-slate-900">
                <Tv className="w-12 h-12 text-slate-500 mb-3" />
                <p className="text-sm font-semibold text-white">No YouTube Video ID Configured</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Configure an authorized YouTube live stream in Settings or enjoy the automated on-screen graphics dashboard.
                </p>
              </div>
            )}

            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded border border-slate-200 flex items-center gap-2 pointer-events-none shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-900 font-mono">
                DECISION DESK LIVE
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-900 shadow-lg pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="bg-rose-600 text-white font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                  ELECTION NIGHT
                </span>
                <span className="font-semibold text-slate-900 truncate max-w-md">
                  {broadcastTitle}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                <span>100 Senate · 435 House · 36 Governors</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700 shadow-2xs">
            <span className="text-slate-500">
              Embed Stream ID: <code className="text-rose-600 font-mono">{youtubeVideoId || 'None'}</code>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              OBS Output Resolution: 1920 × 1080 Full HD Ready
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Battleground Senate Ticker
              </span>
              <span className="text-[10px] font-mono text-slate-500">51 to Win</span>
            </div>

            <div className="space-y-3">
              {topKeyRaces.map((race) => (
                <div key={race.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">
                      {race.stateName} ({race.state})
                    </span>
                    <span className="font-mono text-[11px] text-amber-600 font-semibold">
                      {race.precinctsReportingPct}% In
                    </span>
                  </div>

                  <div className="space-y-1">
                    {race.candidates.map((cand) => (
                      <div key={cand.id} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-700 truncate">
                          {cand.name}{' '}
                          <span
                            className={cand.party === 'DEM' ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'}
                          >
                            ({cand.party})
                          </span>
                        </span>
                        <span className="font-mono text-slate-900 font-semibold tabular-nums">
                          {cand.votePercentage > 0 ? `${cand.votePercentage}%` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-xl p-4 text-xs text-slate-700 space-y-2 shadow-sm">
            <h4 className="font-bold text-blue-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Broadcast Integration Guide (OBS Studio)</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              To overlay election results and lower-thirds onto your live YouTube/Twitch broadcast:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 font-mono">
              <li>Open OBS Studio & add a <strong>Browser Source</strong></li>
              <li>Set URL to <code className="text-blue-600">/obs-graphics</code></li>
              <li>Set Width: <strong>1920</strong>, Height: <strong>1080</strong></li>
              <li>Check "Shutdown source when not visible"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
