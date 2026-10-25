/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { NewsArticle } from '../types/election';
import { ExternalLink, Pause, Play } from 'lucide-react';

interface VerticalNewsScrollerProps {
  articles: NewsArticle[];
}

export const VerticalNewsScroller: React.FC<VerticalNewsScrollerProps> = ({ articles }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [timeMode, setTimeMode] = useState<'ET' | 'LOCAL'>('ET');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 2) {
          scrollRef.current.scrollTop = 0;
        } else {
          scrollRef.current.scrollTop += 1;
        }
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    if (timeMode === 'ET') {
      return (
        d.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' ET'
      );
    }
    return (
      d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' Local'
    );
  };

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-[520px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Live Election Wire
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setTimeMode(timeMode === 'ET' ? 'LOCAL' : 'ET')}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono text-slate-700"
            title="Toggle between Eastern Time and Local Time"
          >
            {timeMode}
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 select-none scroll-smooth"
        style={{ scrollBehavior: 'auto' }}
      >
        {articles.map((item) => (
          <article
            key={item.id}
            className={`p-3 rounded-xl border transition-colors ${
              item.isBreaking
                ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span
                className={`font-semibold uppercase tracking-wider ${
                  item.isBreaking ? 'text-rose-600 font-bold' : 'text-blue-600'
                }`}
              >
                {item.category}
              </span>
              <span className="font-mono text-slate-500">{formatTimestamp(item.publishedAt)}</span>
            </div>

            <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
              {item.headline}
            </h4>

            {item.summary && (
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>
            )}

            <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Source: {item.publisher}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
              >
                <span>Read</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="pt-2.5 mt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between font-mono">
        <span>{isPaused ? 'Scrolling Paused' : 'Auto-scrolling active'}</span>
        <span>Hover or touch to pause</span>
      </div>
    </div>
  );
};
