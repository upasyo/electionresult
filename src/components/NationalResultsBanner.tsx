/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NationalOverview } from '../types/election';
import { RefreshCw } from 'lucide-react';

interface NationalResultsBannerProps {
  overview: NationalOverview | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const NationalResultsBanner: React.FC<NationalResultsBannerProps> = ({
  overview,
  onRefresh,
  isRefreshing
}) => {
  if (!overview) {
    return (
      <div className="w-full bg-white border-b border-slate-200 p-6 flex items-center justify-center text-slate-500">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-rose-600" />
        <span>Loading national election results...</span>
      </div>
    );
  }

  const { senate, house, governors, isLiveReporting, lastUpdated, dataSource } = overview;

  const senateDemTotal = senate.demSeatsHeld;
  const senateRepTotal = senate.repSeatsHeld;
  const senateIndTotal = senate.indSeatsHeld;
  const senateUncalled = senate.uncalledSeats;

  const houseDemTotal = house.demSeatsWon;
  const houseRepTotal = house.repSeatsWon;
  const houseUncalled = house.uncalledSeats;

  return (
    <section className="w-full bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200 px-4 sm:px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 mb-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isLiveReporting ? 'bg-rose-600 animate-pulse' : 'bg-blue-600'}`} />
              {isLiveReporting ? 'LIVE TABULATION IN PROGRESS' : 'PRE-ELECTION VERIFIED BASELINE'}
            </span>
            <span className="text-slate-300">·</span>
            <span>Source: {dataSource}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-500">
              Updated: {new Date(lastUpdated).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' })} ET
            </span>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh results"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
          {/* U.S. SENATE BALANCE OF POWER */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-700">
                  U.S. SENATE
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  (51 FOR MAJORITY)
                </span>
              </div>
              <div className="text-right text-xs">
                {senate.calledRacesCount > 0 ? (
                  <span className="text-slate-700 font-medium font-mono">
                    {senate.calledRacesCount} Called · {senateUncalled} Remaining
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">33 Seats Up for Election</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
                  {senateDemTotal}
                </span>
                <span className="text-xs font-semibold text-blue-700 uppercase">
                  DEM {senateIndTotal > 0 && `(+${senateIndTotal} I)`}
                </span>
              </div>

              <div className="text-center text-[11px] font-mono text-slate-500">
                51 NEEDED
              </div>

              <div className="flex items-baseline gap-2 text-right">
                <span className="text-xs font-semibold text-rose-600 uppercase">
                  REP
                </span>
                <span className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
                  {senateRepTotal}
                </span>
              </div>
            </div>

            <div className="relative w-full h-4 bg-slate-100 rounded-md overflow-hidden flex border border-slate-200">
              <div
                className="bg-blue-600 transition-all duration-700 ease-out"
                style={{ width: `${(senateDemTotal / 100) * 100}%` }}
              />
              {senateIndTotal > 0 && (
                <div
                  className="bg-purple-600 transition-all duration-700 ease-out"
                  style={{ width: `${(senateIndTotal / 100) * 100}%` }}
                />
              )}
              <div className="bg-slate-200 flex-1" />
              <div
                className="bg-rose-600 transition-all duration-700 ease-out"
                style={{ width: `${(senateRepTotal / 100) * 100}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10 shadow-xs"
                style={{ left: '51%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
              <span>{51 - senateDemTotal > 0 ? `${51 - senateDemTotal} to DEM majority` : 'DEM Majority Reached'}</span>
              <span>{51 - senateRepTotal > 0 ? `${51 - senateRepTotal} to REP majority` : 'REP Majority Reached'}</span>
            </div>
          </div>

          {/* U.S. HOUSE OF REPRESENTATIVES */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-700">
                  HOUSE OF REPRESENTATIVES
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  (218 FOR MAJORITY)
                </span>
              </div>
              <div className="text-right text-xs">
                {house.projectedBalance ? (
                  <span className="text-slate-700 font-mono text-[11px]">
                    Proj: {house.projectedBalance.demMin}-{house.projectedBalance.demMax} D / {house.projectedBalance.repMin}-{house.projectedBalance.repMax} R
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">All 435 Seats on Ballot</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
                  {houseDemTotal}
                </span>
                <span className="text-xs font-semibold text-blue-700 uppercase">
                  DEM
                </span>
              </div>

              <div className="text-center text-[11px] font-mono text-slate-500">
                218 NEEDED · {houseUncalled} REMAINING
              </div>

              <div className="flex items-baseline gap-2 text-right">
                <span className="text-xs font-semibold text-rose-600 uppercase">
                  REP
                </span>
                <span className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
                  {houseRepTotal}
                </span>
              </div>
            </div>

            <div className="relative w-full h-4 bg-slate-100 rounded-md overflow-hidden flex border border-slate-200">
              <div
                className="bg-blue-600 transition-all duration-700 ease-out"
                style={{ width: `${(houseDemTotal / 435) * 100}%` }}
              />
              <div className="bg-slate-200 flex-1" />
              <div
                className="bg-rose-600 transition-all duration-700 ease-out"
                style={{ width: `${(houseRepTotal / 435) * 100}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10 shadow-xs"
                style={{ left: '50.11%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
              <span>{218 - houseDemTotal > 0 ? `${218 - houseDemTotal} to DEM control` : 'DEM Majority Clinched'}</span>
              <span>{218 - houseRepTotal > 0 ? `${218 - houseRepTotal} to REP control` : 'REP Majority Clinched'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
