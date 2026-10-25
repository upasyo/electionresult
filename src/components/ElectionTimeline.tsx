/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TimelineEvent } from '../types/election';
import { Clock } from 'lucide-react';

interface ElectionTimelineProps {
  events: TimelineEvent[];
}

export const ElectionTimeline: React.FC<ElectionTimelineProps> = ({ events }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            <span>Election Night Official Chronology & Milestones</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time chronological timeline tracking poll closures, official race projections, and precinct milestones.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Target Date: November 3, 2026
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-rose-600 ring-4 ring-slate-50 group-hover:scale-125 transition-transform" />

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-colors hover:border-slate-300 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {evt.timeET}
                  </span>
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                    [{evt.category}]
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Source: {evt.source}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {evt.title}
              </h4>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
