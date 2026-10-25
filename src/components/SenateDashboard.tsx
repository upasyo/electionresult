/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SenateRace } from '../types/election';
import { Search, ArrowUpDown, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface SenateDashboardProps {
  races: SenateRace[];
  onSelectState: (stateAbbr: string) => void;
}

export const SenateDashboard: React.FC<SenateDashboardProps> = ({ races, onSelectState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partyFilter, setPartyFilter] = useState<'ALL' | 'DEM' | 'REP' | 'IND'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CALLED' | 'UNCALLED' | 'KEY_RACE'>('ALL');
  const [sortBy, setSortBy] = useState<'state' | 'reporting' | 'votes' | 'updated'>('state');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredRaces = useMemo(() => {
    return races
      .filter((r) => {
        const matchesSearch =
          r.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.candidates.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (partyFilter !== 'ALL') {
          const hasParty = r.candidates.some((c) => c.party === partyFilter);
          if (!hasParty) return false;
        }

        if (statusFilter === 'CALLED') {
          if (!r.status.startsWith('called')) return false;
        } else if (statusFilter === 'UNCALLED') {
          if (r.status.startsWith('called')) return false;
        } else if (statusFilter === 'KEY_RACE') {
          if (!r.keyRace) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'state') cmp = a.stateName.localeCompare(b.stateName);
        else if (sortBy === 'reporting') cmp = a.precinctsReportingPct - b.precinctsReportingPct;
        else if (sortBy === 'votes') cmp = a.totalVotes - b.totalVotes;
        else if (sortBy === 'updated') cmp = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [races, searchTerm, partyFilter, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'state' | 'reporting' | 'votes' | 'updated') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const calledDemCount = races.filter((r) => r.status === 'called_dem').length;
  const calledRepCount = races.filter((r) => r.status === 'called_rep').length;
  const uncalledCount = races.filter((r) => !r.status.startsWith('called')).length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              U.S. Senate Election Results & Chamber Balance
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              33 Class 2 Seats up for regular election in 2026. 51 seats needed to secure the Senate majority.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded text-xs font-mono font-semibold">
              DEM Baseline: 38 Not Up
            </span>
            <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-mono font-semibold">
              REP Baseline: 28 Not Up
            </span>
          </div>
        </div>

        <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center text-xs font-mono text-slate-500 mb-2">
            100-SEAT SENATE CHAMBER (51 MAJORITY LINE)
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto py-2">
            {Array.from({ length: 38 }).map((_, i) => (
              <span key={`dem-base-${i}`} className="w-2.5 h-2.5 rounded-full bg-blue-600" title="Democrat (Not Up)" />
            ))}
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" title="Independent (Not Up)" />
            {Array.from({ length: calledDemCount }).map((_, i) => (
              <span key={`dem-called-${i}`} className="w-2.5 h-2.5 rounded-full bg-blue-400 ring-1 ring-slate-900" title="Democrat (Called Win)" />
            ))}
            {Array.from({ length: uncalledCount }).map((_, i) => (
              <span key={`uncalled-${i}`} className="w-2.5 h-2.5 rounded-full bg-slate-300" title="Uncalled Race" />
            ))}
            {Array.from({ length: calledRepCount }).map((_, i) => (
              <span key={`rep-called-${i}`} className="w-2.5 h-2.5 rounded-full bg-rose-400 ring-1 ring-slate-900" title="Republican (Called Win)" />
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={`rep-base-${i}`} className="w-2.5 h-2.5 rounded-full bg-rose-600" title="Republican (Not Up)" />
            ))}
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-600 px-4 mt-2">
            <span className="text-blue-600 font-semibold">{38 + calledDemCount + 1} DEM + IND Total</span>
            <span className="text-amber-600">{uncalledCount} Uncalled</span>
            <span className="text-rose-600 font-semibold">{28 + calledRepCount} REP Total</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search state or candidate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              {(['ALL', 'DEM', 'REP', 'IND'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPartyFilter(p)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    partyFilter === p ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              {(['ALL', 'KEY_RACE', 'CALLED', 'UNCALLED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    statusFilter === s ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s === 'KEY_RACE' ? 'Key Races' : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th onClick={() => toggleSort('state')} className="py-3 px-4 cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">
                    <span>State</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Race Status</th>
                <th className="py-3 px-4">Candidates & Parties</th>
                <th onClick={() => toggleSort('votes')} className="py-3 px-4 cursor-pointer hover:text-slate-900 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Votes</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Vote %</th>
                <th onClick={() => toggleSort('reporting')} className="py-3 px-4 cursor-pointer hover:text-slate-900 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Reporting</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('updated')} className="py-3 px-4 cursor-pointer hover:text-slate-900 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Last Updated</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No Senate races matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRaces.map((race) => {
                  const leadingCandidate = race.candidates.reduce((p, c) => (c.votes > p.votes ? c : p), race.candidates[0]);

                  return (
                    <tr
                      key={race.id}
                      onClick={() => onSelectState(race.state)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {race.state}
                          </span>
                          <span>{race.stateName}</span>
                          {race.keyRace && (
                            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Battleground
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {race.status === 'called_dem' && (
                          <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Called DEM Win
                          </span>
                        )}
                        {race.status === 'called_rep' && (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Called REP Win
                          </span>
                        )}
                        {race.status === 'too_close_to_call' && (
                          <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5" /> Too Close to Call
                          </span>
                        )}
                        {race.status === 'reporting' && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Tabulating Returns
                          </span>
                        )}
                        {race.status === 'uncalled' && (
                          <span className="text-slate-500 font-mono text-[11px]">
                            Polls close {race.pollCloseTimeET}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {race.candidates.map((c) => (
                            <div key={c.id} className="flex items-center justify-between text-xs gap-3">
                              <span className="text-slate-800 font-medium">
                                {c.name}{' '}
                                <span
                                  className={`text-[10px] font-bold ${
                                    c.party === 'DEM'
                                      ? 'text-blue-600'
                                      : c.party === 'REP'
                                      ? 'text-rose-600'
                                      : 'text-purple-600'
                                  }`}
                                >
                                  ({c.party})
                                </span>
                                {c.isIncumbent && <span className="text-[10px] text-slate-400 ml-1">· Inc</span>}
                              </span>
                              <span className="font-mono text-slate-500 tabular-nums">
                                {c.votePercentage > 0 ? `${c.votePercentage}%` : '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-800 tabular-nums">
                        {race.totalVotes > 0 ? race.totalVotes.toLocaleString() : '—'}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {leadingCandidate.votePercentage > 0 ? `${leadingCandidate.votePercentage}%` : '—'}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>{race.precinctsReportingPct}%</span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-slate-600"
                              style={{ width: `${race.precinctsReportingPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(race.lastUpdated).toLocaleTimeString('en-US', {
                          timeZone: 'America/New_York',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}{' '}
                        ET
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between">
          <span>* Projected winners called exclusively upon state election data clearance.</span>
          <span>Reporting: Official Board of Elections Feed</span>
        </div>
      </div>
    </div>
  );
};
