/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SenateRace, GovernorRace, HouseDistrict } from '../types/election';
import { US_STATES_METADATA } from '../data/election2026Data';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Compass } from 'lucide-react';

interface USMap3DProps {
  senateRaces: SenateRace[];
  governorRaces: GovernorRace[];
  houseDistricts: HouseDistrict[];
  onSelectState: (stateAbbr: string) => void;
  selectedState: string | null;
}

interface StateGeoBox {
  abbr: string;
  name: string;
  x: number;
  y: number;
}

const STATE_GRID: StateGeoBox[] = [
  { abbr: 'AK', name: 'Alaska', x: 0, y: 0 },
  { abbr: 'ME', name: 'Maine', x: 11, y: 0 },
  { abbr: 'VT', name: 'Vermont', x: 10, y: 1 },
  { abbr: 'NH', name: 'New Hampshire', x: 11, y: 1 },
  { abbr: 'WA', name: 'Washington', x: 1, y: 1 },
  { abbr: 'ID', name: 'Idaho', x: 2, y: 1 },
  { abbr: 'MT', name: 'Montana', x: 3, y: 1 },
  { abbr: 'ND', name: 'North Dakota', x: 4, y: 1 },
  { abbr: 'MN', name: 'Minnesota', x: 5, y: 1 },
  { abbr: 'IL', name: 'Illinois', x: 6, y: 1 },
  { abbr: 'WI', name: 'Wisconsin', x: 7, y: 1 },
  { abbr: 'MI', name: 'Michigan', x: 8, y: 1 },
  { abbr: 'NY', name: 'New York', x: 9, y: 1 },
  { abbr: 'MA', name: 'Massachusetts', x: 10, y: 2 },
  { abbr: 'RI', name: 'Rhode Island', x: 11, y: 2 },
  { abbr: 'OR', name: 'Oregon', x: 1, y: 2 },
  { abbr: 'NV', name: 'Nevada', x: 2, y: 2 },
  { abbr: 'WY', name: 'Wyoming', x: 3, y: 2 },
  { abbr: 'SD', name: 'South Dakota', x: 4, y: 2 },
  { abbr: 'IA', name: 'Iowa', x: 5, y: 2 },
  { abbr: 'IN', name: 'Indiana', x: 6, y: 2 },
  { abbr: 'OH', name: 'Ohio', x: 7, y: 2 },
  { abbr: 'PA', name: 'Pennsylvania', x: 8, y: 2 },
  { abbr: 'NJ', name: 'New Jersey', x: 9, y: 2 },
  { abbr: 'CT', name: 'Connecticut', x: 10, y: 3 },
  { abbr: 'CA', name: 'California', x: 1, y: 3 },
  { abbr: 'UT', name: 'Utah', x: 2, y: 3 },
  { abbr: 'CO', name: 'Colorado', x: 3, y: 3 },
  { abbr: 'NE', name: 'Nebraska', x: 4, y: 3 },
  { abbr: 'MO', name: 'Missouri', x: 5, y: 3 },
  { abbr: 'KY', name: 'Kentucky', x: 6, y: 3 },
  { abbr: 'WV', name: 'West Virginia', x: 7, y: 3 },
  { abbr: 'VA', name: 'Virginia', x: 8, y: 3 },
  { abbr: 'MD', name: 'Maryland', x: 9, y: 3 },
  { abbr: 'DE', name: 'Delaware', x: 10, y: 4 },
  { abbr: 'AZ', name: 'Arizona', x: 2, y: 4 },
  { abbr: 'NM', name: 'New Mexico', x: 3, y: 4 },
  { abbr: 'KS', name: 'Kansas', x: 4, y: 4 },
  { abbr: 'AR', name: 'Arkansas', x: 5, y: 4 },
  { abbr: 'TN', name: 'Tennessee', x: 6, y: 4 },
  { abbr: 'NC', name: 'North Carolina', x: 7, y: 4 },
  { abbr: 'SC', name: 'South Carolina', x: 8, y: 4 },
  { abbr: 'DC', name: 'District of Columbia', x: 9, y: 4 },
  { abbr: 'OK', name: 'Oklahoma', x: 4, y: 5 },
  { abbr: 'LA', name: 'Louisiana', x: 5, y: 5 },
  { abbr: 'MS', name: 'Mississippi', x: 6, y: 5 },
  { abbr: 'AL', name: 'Alabama', x: 7, y: 5 },
  { abbr: 'GA', name: 'Georgia', x: 8, y: 5 },
  { abbr: 'HI', name: 'Hawaii', x: 0, y: 6 },
  { abbr: 'TX', name: 'Texas', x: 4, y: 6 },
  { abbr: 'FL', name: 'Florida', x: 8, y: 6 }
];

export const USMap3D: React.FC<USMap3DProps> = ({
  senateRaces,
  governorRaces,
  houseDistricts,
  onSelectState,
  selectedState
}) => {
  const [filterMode, setFilterMode] = useState<'senate' | 'house' | 'governor' | 'called' | 'competitive'>('senate');
  const [is3DMode, setIs3DMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getStateVisuals = (abbr: string) => {
    const meta = US_STATES_METADATA[abbr];
    const senate = senateRaces.find((r) => r.state === abbr);
    const gov = governorRaces.find((r) => r.state === abbr);
    const house = houseDistricts.filter((h) => h.state === abbr);

    if (filterMode === 'senate') {
      if (!senate) {
        return { color: 'bg-slate-100 border-slate-200 text-slate-400', status: 'No Senate Race in 2026', party: null };
      }
      if (senate.status === 'called_dem') return { color: 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30', status: 'Called DEM', party: 'DEM' };
      if (senate.status === 'called_rep') return { color: 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-500/30', status: 'Called REP', party: 'REP' };
      if (senate.status === 'called_ind') return { color: 'bg-purple-600 border-purple-400 text-white', status: 'Called IND', party: 'IND' };
      if (senate.keyRace) return { color: 'bg-amber-500 border-amber-400 text-white font-bold', status: 'Key Battleground', party: 'TOSSUP' };
      return { color: 'bg-white border-slate-200 text-slate-700 hover:border-slate-300', status: 'Uncalled / Pre-Reporting', party: 'UNCALLED' };
    }

    if (filterMode === 'governor') {
      if (!gov) {
        return { color: 'bg-slate-100 border-slate-200 text-slate-400', status: 'No Governor Race in 2026', party: null };
      }
      if (gov.status === 'called_dem') return { color: 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30', status: 'Called DEM', party: 'DEM' };
      if (gov.status === 'called_rep') return { color: 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-500/30', status: 'Called REP', party: 'REP' };
      if (gov.isCompetitive) return { color: 'bg-amber-500 border-amber-400 text-white font-bold', status: 'Competitive Gubernatorial', party: 'TOSSUP' };
      return { color: 'bg-white border-slate-200 text-slate-700 hover:border-slate-300', status: 'Uncalled', party: 'UNCALLED' };
    }

    if (filterMode === 'house') {
      if (house.length === 0) {
        return { color: 'bg-slate-50 border-slate-200 text-slate-400', status: `${meta?.houseDistrictsCount || 1} Districts`, party: null };
      }
      const hasDemWin = house.some((h) => h.status === 'called_dem');
      const hasRepWin = house.some((h) => h.status === 'called_rep');
      if (hasDemWin && !hasRepWin) return { color: 'bg-blue-600 border-blue-400 text-white', status: 'Seat Won (DEM)', party: 'DEM' };
      if (hasRepWin && !hasDemWin) return { color: 'bg-rose-600 border-rose-400 text-white', status: 'Seat Won (REP)', party: 'REP' };
      return { color: 'bg-amber-500 border-amber-400 text-white', status: `${house.length} Battlegrounds`, party: 'TOSSUP' };
    }

    if (filterMode === 'called') {
      const isCalled = (senate && senate.status.startsWith('called')) || (gov && gov.status.startsWith('called'));
      if (isCalled) return { color: 'bg-emerald-600 border-emerald-400 text-white', status: 'Race Called', party: 'CALLED' };
      return { color: 'bg-white border-slate-200 text-slate-400', status: 'Awaiting Results', party: null };
    }

    if (filterMode === 'competitive') {
      const isComp = (senate && senate.keyRace) || (gov && gov.isCompetitive) || house.length > 0;
      if (isComp) return { color: 'bg-amber-500 border-amber-300 text-white font-bold', status: 'Critical Tossup', party: 'COMPETITIVE' };
      return { color: 'bg-white border-slate-200 text-slate-400', status: 'Non-Battleground', party: null };
    }

    return { color: 'bg-white border-slate-200 text-slate-700', status: 'Uncalled', party: null };
  };

  const hoveredMetadata = hoveredState ? US_STATES_METADATA[hoveredState] : null;
  const hoveredSenate = hoveredState ? senateRaces.find((r) => r.state === hoveredState) : null;
  const hoveredGov = hoveredState ? governorRaces.find((r) => r.state === hoveredState) : null;
  const hoveredHouse = hoveredState ? houseDistricts.filter((h) => h.state === hoveredState) : [];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 sm:p-6 relative overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-600" />
            <span>Interactive 3D Electoral Map of the United States</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any state to open live precinct counts, candidate margins, and historical trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs">
          {(
            [
              { id: 'senate', label: 'Senate Races' },
              { id: 'house', label: 'House Tossups' },
              { id: 'governor', label: 'Governors' },
              { id: 'competitive', label: 'Battlegrounds' },
              { id: 'called', label: 'Called Races' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterMode === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              is3DMode
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
            title="Toggle 3D Perspective Tilt"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Perspective View (Active)' : '2D Accessible Flat View'}</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Democrat
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-600" /> Republican
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Tossup / Contested
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300" /> Uncalled
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="w-full relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center p-2 sm:p-4 overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 border border-slate-200"
        style={{ perspective: is3DMode ? '1000px' : 'none' }}
      >
        <div
          className="transition-transform duration-500 ease-out origin-center select-none"
          style={{
            transform: is3DMode
              ? `scale(${zoomLevel}) rotateX(24deg) rotateZ(-2deg) translateY(-8px)`
              : `scale(${zoomLevel})`
          }}
        >
          <div
            className="grid grid-cols-12 gap-2 sm:gap-2.5 p-4 max-w-[880px] mx-auto"
            style={{
              gridTemplateRows: 'repeat(8, minmax(44px, 56px))',
              gridTemplateColumns: 'repeat(12, minmax(44px, 64px))'
            }}
          >
            {STATE_GRID.map((st) => {
              const visual = getStateVisuals(st.abbr);
              const isSelected = selectedState === st.abbr;
              const isHovered = hoveredState === st.abbr;

              return (
                <button
                  key={st.abbr}
                  onClick={() => onSelectState(st.abbr)}
                  onMouseEnter={() => setHoveredState(st.abbr)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{
                    gridColumnStart: st.x + 1,
                    gridRowStart: st.y + 1,
                    transform: is3DMode && (isSelected || isHovered) ? 'translateZ(18px) translateY(-3px)' : 'translateZ(0px)'
                  }}
                  className={`relative group rounded-lg border font-mono flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                    visual.color
                  } ${
                    isSelected ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-slate-50 z-20 scale-105' : ''
                  } ${isHovered ? 'z-10 shadow-md' : 'shadow-2xs'} ${
                    is3DMode ? 'shadow-slate-300' : ''
                  }`}
                  aria-label={`${st.name} - ${visual.status}`}
                >
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    {st.abbr}
                  </span>
                  <span className="text-[9px] font-sans opacity-75 truncate max-w-[48px] hidden sm:block">
                    {visual.party || '—'}
                  </span>

                  {is3DMode && (
                    <div className="absolute inset-x-0 -bottom-1 h-1 bg-slate-300/60 rounded-b-lg pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {hoveredMetadata && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 backdrop-blur-md shadow-xl pointer-events-none z-30 transition-opacity">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">{hoveredMetadata.name} ({hoveredMetadata.abbr})</span>
              <span className="font-mono text-[11px] text-amber-600 font-semibold">Polls close: {hoveredMetadata.pollCloseTimeET}</span>
            </div>

            {hoveredSenate && (
              <div className="mb-2">
                <div className="text-[11px] text-slate-500 font-medium">U.S. Senate Contest:</div>
                <div className="text-slate-900 font-semibold mt-0.5">
                  {hoveredSenate.candidates.map((c) => `${c.name} (${c.party})`).join(' vs ')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Status: <span className="text-slate-900 font-medium">{hoveredSenate.status}</span> · {hoveredSenate.precinctsReportingPct}% reporting
                </div>
              </div>
            )}

            {hoveredGov && (
              <div className="mb-2">
                <div className="text-[11px] text-slate-500 font-medium">Governor Contest:</div>
                <div className="text-slate-900 font-semibold mt-0.5">
                  {hoveredGov.candidates.map((c) => `${c.name} (${c.party})`).join(' vs ')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Status: <span className="text-slate-900 font-medium">{hoveredGov.status}</span> · {hoveredGov.precinctsReportingPct}% reporting
                </div>
              </div>
            )}

            {hoveredHouse.length > 0 && (
              <div className="text-[11px] text-slate-500">
                <span className="text-amber-600 font-medium">{hoveredHouse.length}</span> Competitive House District(s) tracked
              </div>
            )}

            <div className="mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Click for state election breakdown</span>
              <span className="text-blue-600 font-medium">View details →</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Map Projection: Albers Equal-Area Geographic Grid (50 States + DC)</span>
        <span>Color rule: States colored only upon certified or projected race calls</span>
      </div>
    </div>
  );
};
