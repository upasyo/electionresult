/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NewsArticle } from '../types/election';
import { Play, Pause, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface BreakingNewsTickerProps {
  articles: NewsArticle[];
  isLiveReporting: boolean;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ articles, isLiveReporting }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [currentIndex, setCurrentIndex] = useState(0);

  const tickerArticles = articles.length > 0 ? articles : [
    {
      id: 'fallback-1',
      headline: 'Decision Desk 2026: Live Election Night Network Operational · Polls open across battlegrounds',
      summary: '',
      publisher: 'Associated Press',
      publishedAt: new Date().toISOString(),
      url: '#',
      category: 'Breaking News',
      isBreaking: true
    }
  ];

  const speedDuration = speed === 'slow' ? '50s' : speed === 'fast' ? '20s' : '32s';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tickerArticles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tickerArticles.length) % tickerArticles.length);
  };

  return (
    <div
      className="relative z-30 w-full bg-slate-900 border-b border-slate-800 text-xs text-slate-100 shadow-sm"
      role="region"
      aria-label="Breaking Election News Ticker"
    >
      <div className="max-w-7xl mx-auto flex items-center h-10 px-3 sm:px-4">
        {/* Left Breaking Label */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-700 mr-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="bg-rose-600 text-white font-bold tracking-wider px-2 py-0.5 text-[10px] uppercase rounded">
            BREAKING
          </span>
        </div>

        {/* Continuous ticker view */}
        <div
          className="flex-1 overflow-hidden relative h-full flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center gap-10 whitespace-nowrap transition-all duration-300 ${
              isPaused ? '' : 'animate-ticker'
            }`}
            style={{
              animationDuration: speedDuration,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {[...tickerArticles, ...tickerArticles].map((art, idx) => (
              <a
                key={`${art.id}-${idx}`}
                href={art.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors group"
              >
                <span className="text-rose-400 font-semibold uppercase text-[10px] tracking-wide">
                  [{art.category}]
                </span>
                <span className="group-hover:underline underline-offset-2">
                  {art.headline}
                </span>
                <span className="text-slate-400 text-[11px]">
                  — {art.publisher}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-slate-700 font-mono px-2">/</span>
              </a>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 pl-3 border-l border-slate-700 ml-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isPaused ? 'Resume ticker' : 'Pause ticker'}
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              if (speed === 'normal') setSpeed('fast');
              else if (speed === 'fast') setSpeed('slow');
              else setSpeed('normal');
            }}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Change ticker speed"
          >
            {speed.toUpperCase()}
          </button>

          <div className="hidden sm:flex items-center gap-0.5">
            <button
              onClick={handlePrev}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Previous headline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Next headline"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
