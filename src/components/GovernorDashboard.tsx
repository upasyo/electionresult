/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { GovernorRace } from '../types/election';
import { Search, Landmark } from 'lucide-react';

interface GovernorDashboardProps {
  races: GovernorRace[];
  onSelectState: (stateAbbr: string) => void;
}

export const GovernorDashboard: React.FC<GovernorDashboardProps> = ({ races, onSelectState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'COMPETITIVE' | 'CALLED' | 'OPEN_SEATS'>('ALL');

  const filteredRaces = useMemo(() => {
    return races.filter((r) => {
      const matchSearch =
        r.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.candidates.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      if (filterMode === 'COMPETITIVE') {
        if (!r.isCompetitive) return false;
      } else if (filterMode === 'CALLED') {
        if (!r.status.startsWith('called')) return false;
      } else if (filterMode === 'OPEN_SEATS') {
        if (!r.incumbentName.includes('Term-Limited')) return false;
      }

      return true;
    });
  }, [races, searchTerm, filterMode]);

  const demWon = races.filter((r) => r.status === 'called_dem').length;
  const repWon = races.filter((r) => r.status === 'called_rep').length;
  const uncalled = races.filter((r) => !r.status.startsWith('called')).length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-600" />
              <span>Gubernatorial Elections 2026 (36 State Houses)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Voters across 36 states elect chief executives. Baseline party holding across 50 states: 23 Democrats, 27 Republicans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
              <span className="text-blue-600 font-bold">{demWon} DEM Called</span>
              <span className="text-slate-300">/</span>
              <span className="text-rose-600 font-bold">{repWon} REP Called</span>
              <span className="text-slate-300">/</span>
              <span className="text-amber-600 font-bold">{uncalled} Outstanding</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search governor race..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs w-full sm:w-auto overflow-x-auto">
            {(
              [
                { id: 'ALL', label: 'All 36 Races' },
                { id: 'COMPETITIVE', label: 'Battlegrounds' },
                { id: 'OPEN_SEATS', label: 'Term-Limited / Open' },
                { id: 'CALLED', label: 'Called' }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  filterMode === f.id ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRaces.map((race) => (
          <div
            key={race.id}
            onClick={() => onSelectState(race.state)}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md shadow-2xs group"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                    {race.state}
                  </span>
                  <span className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                    {race.stateName}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Incumbent: {race.incumbentName} ({race.incumbentParty})
                </div>
              </div>

              <div className="text-right">
                {race.status === 'called_dem' ? (
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase font-mono">
                    DEM CALL
                  </span>
                ) : race.status === 'called_rep' ? (
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase font-mono">
                    REP CALL
                  </span>
                ) : race.isCompetitive ? (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase font-mono">
                    BATTLEGROUND
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500">
                    Closes {race.pollCloseTimeET}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {race.candidates.map((cand) => (
                <div key={cand.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-medium">
                      {cand.name}{' '}
                      <span
                        className={`font-semibold ${
                          cand.party === 'DEM' ? 'text-blue-600' : 'text-rose-600'
                        }`}
                      >
                        ({cand.party})
                      </span>
                      {cand.isIncumbent && <span className="text-[10px] text-slate-400 ml-1">· Incumbent</span>}
                    </span>
                    <span className="font-mono text-slate-900 font-bold tabular-nums">
                      {cand.votePercentage > 0 ? `${cand.votePercentage}%` : '—'}
                    </span>
                  </div>

                  {cand.votePercentage > 0 && (
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full ${cand.party === 'DEM' ? 'bg-blue-600' : 'bg-rose-600'}`}
                        style={{ width: `${cand.votePercentage}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Reporting: {race.precinctsReportingPct}%</span>
              <span>{race.totalVotes > 0 ? `${race.totalVotes.toLocaleString()} votes` : 'Awaiting returns'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
