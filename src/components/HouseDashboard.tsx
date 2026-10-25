/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { HouseDistrict, NationalOverview } from '../types/election';
import { Search } from 'lucide-react';

interface HouseDashboardProps {
  districts: HouseDistrict[];
  overview: NationalOverview | null;
  onSelectState: (stateAbbr: string) => void;
}

export const HouseDashboard: React.FC<HouseDashboardProps> = ({ districts, overview, onSelectState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partyFilter, setPartyFilter] = useState<'ALL' | 'DEM' | 'REP'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CALLED' | 'UNCALLED'>('ALL');

  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchSearch =
        d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.candidates.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      if (partyFilter !== 'ALL') {
        const hasParty = d.candidates.some((c) => c.party === partyFilter);
        if (!hasParty) return false;
      }

      if (statusFilter === 'CALLED') {
        if (!d.status.startsWith('called')) return false;
      } else if (statusFilter === 'UNCALLED') {
        if (d.status.startsWith('called')) return false;
      }

      return true;
    });
  }, [districts, searchTerm, partyFilter, statusFilter]);

  const house = overview?.house;
  const demWon = house?.demSeatsWon || 0;
  const repWon = house?.repSeatsWon || 0;
  const uncalled = house?.uncalledSeats || 435;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-blue-600 font-semibold uppercase tracking-wider">
            <span>Democratic Caucus</span>
            <span className="text-[10px] text-slate-400 font-mono">218 to Win</span>
          </div>
          <div className="my-3 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-blue-600 font-mono tabular-nums">
              {demWon}
            </span>
            <span className="text-xs text-slate-500">
              {218 - demWon > 0 ? `${218 - demWon} seats to gavel` : 'Majority Achieved'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Net Change: <span className="text-emerald-600 font-semibold">+{house?.netGain.dem || 0} seats</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold uppercase tracking-wider">
            <span>Republican Conference</span>
            <span className="text-[10px] text-slate-400 font-mono">218 to Win</span>
          </div>
          <div className="my-3 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-rose-600 font-mono tabular-nums">
              {repWon}
            </span>
            <span className="text-xs text-slate-500">
              {218 - repWon > 0 ? `${218 - repWon} seats to gavel` : 'Majority Achieved'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Net Change: <span className="text-emerald-600 font-semibold">+{house?.netGain.rep || 0} seats</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-600 font-semibold uppercase tracking-wider">
            <span>Outstanding / Projection</span>
            <span className="text-[10px] text-slate-400 font-mono">Total 435</span>
          </div>
          <div className="my-3 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-amber-600 font-mono tabular-nums">
              {uncalled}
            </span>
            <span className="text-xs text-slate-500">Races Awaiting Calls</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Model: {house?.projectedBalance ? `${house.projectedBalance.demMin}-${house.projectedBalance.demMax} D / ${house.projectedBalance.repMin}-${house.projectedBalance.repMax} R` : 'Consensus In Progress'}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Competitive Congressional Districts Battlefield
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracking key toss-up and suburban swing districts that will decide the balance of power.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search district or candidate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600 w-56"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              {(['ALL', 'DEM', 'REP'] as const).map((p) => (
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
              {(['ALL', 'CALLED', 'UNCALLED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    statusFilter === s ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {filteredDistricts.map((district) => (
            <div
              key={district.id}
              onClick={() => onSelectState(district.state)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-white group shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                  {district.stateName}
                </span>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                    district.status === 'called_dem'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : district.status === 'called_rep'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {district.status === 'called_dem'
                    ? 'DEM Hold/Gain'
                    : district.status === 'called_rep'
                    ? 'REP Hold/Gain'
                    : 'Battleground'}
                </span>
              </div>

              <div className="space-y-1.5">
                {district.candidates.map((cand) => (
                  <div key={cand.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-medium truncate">
                      {cand.name}{' '}
                      <span
                        className={`font-semibold ${
                          cand.party === 'DEM' ? 'text-blue-600' : 'text-rose-600'
                        }`}
                      >
                        ({cand.party})
                      </span>
                      {cand.isIncumbent && <span className="text-[10px] text-slate-400 ml-1">· Inc</span>}
                    </span>
                    <span className="font-mono text-slate-700 tabular-nums font-semibold">
                      {cand.votePercentage > 0 ? `${cand.votePercentage}%` : '—'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Reporting: {district.precinctsReportingPct}%</span>
                <span>Previous: {district.previousHolderParty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
