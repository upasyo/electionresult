/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface CountdownBannerProps {
  isSimulationActive: boolean;
  onActivateSimulation: () => void;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  isSimulationActive,
  onActivateSimulation
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-11-03T19:00:00-05:00').getTime();

    const calcTime = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-white via-slate-50 to-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              OFFICIAL COUNTDOWN TO GENERAL ELECTION DAY
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tuesday, November 3, 2026 · Polls Close 19:00 ET
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Live precinct election results will populate in real time as polls close. Before poll closing, all candidate and party distributions reflect verified pre-election ballot standings and historical baselines.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 font-mono select-none">
          <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg px-3 py-2 min-w-[64px] shadow-2xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Days</span>
          </div>

          <span className="text-slate-400 font-bold text-xl">:</span>

          <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg px-3 py-2 min-w-[64px] shadow-2xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Hours</span>
          </div>

          <span className="text-slate-400 font-bold text-xl">:</span>

          <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg px-3 py-2 min-w-[64px] shadow-2xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Mins</span>
          </div>

          <span className="text-slate-400 font-bold text-xl">:</span>

          <div className="flex flex-col items-center bg-white border border-slate-200 rounded-lg px-3 py-2 min-w-[64px] shadow-2xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Secs</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Notice: Live election results will become available as state tabulators report on November 3.</span>
        </div>

        {!isSimulationActive ? (
          <button
            onClick={onActivateSimulation}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
          >
            Preview Election Night Live Simulation Mode →
          </button>
        ) : (
          <span className="text-xs text-amber-700 font-semibold">
            ● Election Night Simulation Active
          </span>
        )}
      </div>
    </div>
  );
};
