/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SenateRace, GovernorRace, HouseDistrict } from '../types/election';
import { US_STATES_METADATA } from '../data/election2026Data';
import { X, Landmark, Users } from 'lucide-react';

interface StateDetailModalProps {
  stateAbbr: string | null;
  senateRaces: SenateRace[];
  governorRaces: GovernorRace[];
  houseDistricts: HouseDistrict[];
  onClose: () => void;
}

export const StateDetailModal: React.FC<StateDetailModalProps> = ({
  stateAbbr,
  senateRaces,
  governorRaces,
  houseDistricts,
  onClose
}) => {
  if (!stateAbbr) return null;

  const metadata = US_STATES_METADATA[stateAbbr];
  const senate = senateRaces.find((r) => r.state === stateAbbr);
  const gov = governorRaces.find((r) => r.state === stateAbbr);
  const house = houseDistricts.filter((h) => h.state === stateAbbr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-bold font-mono text-base flex items-center justify-center">
              {stateAbbr}
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {metadata?.name || stateAbbr} Election Day Return
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Poll Closing: {metadata?.pollCloseTimeET || '20:00 ET'} · Total Districts: {metadata?.houseDistrictsCount || 1}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* U.S. SENATE SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>U.S. Senate Election</span>
            </span>
            {senate && (
              <span className="font-mono text-slate-500">
                {senate.precinctsReportingPct}% Precincts Reporting
              </span>
            )}
          </div>

          {senate ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              {senate.raceCallDetails && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-mono">
                  <span>✓ RACE CALLED: {senate.raceCallDetails.confidence.toUpperCase()} WINNER</span>
                  <span>Source: {senate.raceCallDetails.calledBy}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Seat Status: <strong className="text-slate-900 uppercase">{senate.status}</strong>
                </span>
                <span className="text-slate-500 text-[11px] font-mono">
                  {senate.totalVotes > 0 ? `${senate.totalVotes.toLocaleString()} total votes cast` : 'Awaiting initial returns'}
                </span>
              </div>

              <div className="space-y-2">
                {senate.candidates.map((cand) => (
                  <div key={cand.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">
                        {cand.name}{' '}
                        <span
                          className={cand.party === 'DEM' ? 'text-blue-600 font-bold' : cand.party === 'REP' ? 'text-rose-600 font-bold' : 'text-purple-600 font-bold'}
                        >
                          ({cand.party})
                        </span>
                        {cand.isIncumbent && <span className="text-[10px] text-slate-400 ml-1">· Incumbent</span>}
                      </span>
                      <div className="text-right font-mono">
                        <span className="text-slate-900 font-bold tabular-nums">
                          {cand.votePercentage > 0 ? `${cand.votePercentage}%` : '—'}
                        </span>
                        {cand.votes > 0 && (
                          <span className="text-[11px] text-slate-500 ml-2">
                            ({cand.votes.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>

                    {cand.votePercentage > 0 && (
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cand.party === 'DEM' ? 'bg-blue-600' : 'bg-rose-600'}`}
                          style={{ width: `${cand.votePercentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No U.S. Senate Class 2 election in {metadata?.name || stateAbbr} for the 2026 cycle. Both seats held until 2028/2030.
            </div>
          )}
        </div>

        {/* GUBERNATORIAL SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Gubernatorial Race</span>
            </span>
            {gov && (
              <span className="font-mono text-slate-500">
                {gov.precinctsReportingPct}% Precincts Reporting
              </span>
            )}
          </div>

          {gov ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              {gov.raceCallDetails && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-mono">
                  <span>✓ RACE CALLED: {gov.raceCallDetails.confidence.toUpperCase()} WINNER</span>
                  <span>Source: {gov.raceCallDetails.calledBy}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Incumbent: <strong className="text-slate-800">{gov.incumbentName}</strong>
                </span>
                <span className="text-slate-500 text-[11px] font-mono">
                  {gov.totalVotes > 0 ? `${gov.totalVotes.toLocaleString()} votes` : 'Awaiting returns'}
                </span>
              </div>

              <div className="space-y-2">
                {gov.candidates.map((cand) => (
                  <div key={cand.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">
                        {cand.name}{' '}
                        <span
                          className={cand.party === 'DEM' ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'}
                        >
                          ({cand.party})
                        </span>
                      </span>
                      <span className="font-mono text-slate-900 font-bold tabular-nums">
                        {cand.votePercentage > 0 ? `${cand.votePercentage}%` : '—'}
                      </span>
                    </div>

                    {cand.votePercentage > 0 && (
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cand.party === 'DEM' ? 'bg-blue-600' : 'bg-rose-600'}`}
                          style={{ width: `${cand.votePercentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No Governor election in {metadata?.name || stateAbbr} for the 2026 cycle.
            </div>
          )}
        </div>

        {/* HOUSE DISTRICTS SECTION */}
        {house.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Competitive Congressional Districts Tracked ({house.length})
            </div>

            <div className="space-y-2">
              {house.map((h) => (
                <div key={h.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                    <span>{h.stateName}</span>
                    <span className="font-mono text-[11px] text-amber-700">
                      {h.precinctsReportingPct}% Reporting
                    </span>
                  </div>

                  <div className="space-y-1">
                    {h.candidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">
                          {c.name}{' '}
                          <span className={c.party === 'DEM' ? 'text-blue-600 font-semibold' : 'text-rose-600 font-semibold'}>
                            ({c.party})
                          </span>
                        </span>
                        <span className="font-mono text-slate-900 font-semibold tabular-nums">
                          {c.votePercentage > 0 ? `${c.votePercentage}%` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Source: Official Secretary of State / State Election Division</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
