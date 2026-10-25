/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NationalOverview, SenateRace, HouseDistrict, NewsArticle } from '../types/election';
import { ArrowLeft } from 'lucide-react';

interface OBSGraphicsOverlayProps {
  overview: NationalOverview | null;
  senateRaces: SenateRace[];
  houseDistricts: HouseDistrict[];
  breakingNews: NewsArticle[];
  onClose: () => void;
}

export const OBSGraphicsOverlay: React.FC<OBSGraphicsOverlayProps> = ({
  overview,
  senateRaces,
  houseDistricts,
  breakingNews,
  onClose
}) => {
  const [activeMode, setActiveMode] = useState<'lower_third' | 'senate_bug' | 'house_bug' | 'breaking_chyron'>('lower_third');
  const [selectedRaceIndex, setSelectedRaceIndex] = useState(0);

  const keyRaces = senateRaces.filter((r) => r.keyRace);
  const activeRace = keyRaces[selectedRaceIndex] || senateRaces[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '1') setActiveMode('lower_third');
      if (e.key === '2') setActiveMode('senate_bug');
      if (e.key === '3') setActiveMode('house_bug');
      if (e.key === '4') setActiveMode('breaking_chyron');
      if (e.key === 'ArrowRight') setSelectedRaceIndex((prev) => (prev + 1) % keyRaces.length);
      if (e.key === 'ArrowLeft') setSelectedRaceIndex((prev) => (prev - 1 + keyRaces.length) % keyRaces.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyRaces.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-none flex flex-col justify-between p-8 select-none pointer-events-auto">
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit OBS Mode (Esc)</span>
          </button>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveMode('lower_third')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeMode === 'lower_third' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [1] Lower Third
            </button>
            <button
              onClick={() => setActiveMode('senate_bug')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeMode === 'senate_bug' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [2] Senate Balance Bug
            </button>
            <button
              onClick={() => setActiveMode('house_bug')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeMode === 'house_bug' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [3] House Balance Bug
            </button>
            <button
              onClick={() => setActiveMode('breaking_chyron')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeMode === 'breaking_chyron' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [4] Breaking Chyron
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-[11px]">Race: {activeRace.stateName}</span>
          <button
            onClick={() => setSelectedRaceIndex((prev) => (prev + 1) % keyRaces.length)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[11px]"
          >
            Next Race (→)
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <div className="space-y-4">
        {activeMode === 'lower_third' && (
          <div className="max-w-4xl mx-auto bg-white border-t-4 border-rose-600 rounded-xl p-4 shadow-2xl border-x border-b border-slate-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white font-bold px-2 py-0.5 text-xs uppercase font-mono tracking-wider rounded">
                  KEY RACE ALERT
                </span>
                <span className="text-slate-900 font-bold text-base">
                  U.S. SENATE: {activeRace.stateName.toUpperCase()}
                </span>
              </div>
              <div className="font-mono text-xs text-amber-600 font-semibold">
                {activeRace.precinctsReportingPct}% PRECINCTS REPORTING
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {activeRace.candidates.slice(0, 2).map((cand) => (
                <div
                  key={cand.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    cand.party === 'DEM'
                      ? 'bg-blue-50/80 border-blue-200'
                      : 'bg-rose-50/80 border-rose-200'
                  }`}
                >
                  <div>
                    <span className="text-base font-bold text-slate-900 block">
                      {cand.name}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase ${
                        cand.party === 'DEM' ? 'text-blue-700' : 'text-rose-700'
                      }`}
                    >
                      {cand.party === 'DEM' ? 'Democrat' : 'Republican'}
                      {cand.isIncumbent && ' · Incumbent'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {cand.votePercentage > 0 ? `${cand.votePercentage}%` : '—'}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono block">
                      {cand.votes > 0 ? cand.votes.toLocaleString() : 'Awaiting'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMode === 'senate_bug' && overview && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-700 mb-2">
              <span>U.S. SENATE MAJORITY WATCH</span>
              <span>51 SEATS NEEDED</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold font-mono text-blue-600 tabular-nums">
                {overview.senate.demSeatsHeld} DEM
              </span>
              <span className="text-sm font-mono text-amber-600">
                {overview.senate.uncalledSeats} UNCALLED
              </span>
              <span className="text-3xl font-bold font-mono text-rose-600 tabular-nums">
                {overview.senate.repSeatsHeld} REP
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-md overflow-hidden flex border border-slate-200">
              <div
                className="bg-blue-600 transition-all duration-500"
                style={{ width: `${(overview.senate.demSeatsHeld / 100) * 100}%` }}
              />
              <div className="bg-slate-200 flex-1" />
              <div
                className="bg-rose-600 transition-all duration-500"
                style={{ width: `${(overview.senate.repSeatsHeld / 100) * 100}%` }}
              />
            </div>
          </div>
        )}

        {activeMode === 'house_bug' && overview && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-700 mb-2">
              <span>U.S. HOUSE OF REPRESENTATIVES GAVEL</span>
              <span>218 SEATS NEEDED</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold font-mono text-blue-600 tabular-nums">
                {overview.house.demSeatsWon} DEM
              </span>
              <span className="text-sm font-mono text-amber-600">
                {overview.house.uncalledSeats} UNCALLED
              </span>
              <span className="text-3xl font-bold font-mono text-rose-600 tabular-nums">
                {overview.house.repSeatsWon} REP
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-md overflow-hidden flex border border-slate-200">
              <div
                className="bg-blue-600 transition-all duration-500"
                style={{ width: `${(overview.house.demSeatsWon / 435) * 100}%` }}
              />
              <div className="bg-slate-200 flex-1" />
              <div
                className="bg-rose-600 transition-all duration-500"
                style={{ width: `${(overview.house.repSeatsWon / 435) * 100}%` }}
              />
            </div>
          </div>
        )}

        {activeMode === 'breaking_chyron' && (
          <div className="w-full bg-rose-600 border-y-2 border-rose-700 p-3 text-white shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white text-rose-700 font-extrabold px-2.5 py-1 text-xs uppercase tracking-wider rounded">
                BREAKING NEWS
              </span>
              <span className="text-sm font-bold text-white">
                {breakingNews[0]?.headline || 'Polls Close Across Key Battleground States as Ballot Tabulation Begins.'}
              </span>
            </div>
            <div className="font-mono text-xs text-rose-100 uppercase">
              DECISION DESK SPECIAL REPORT
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
