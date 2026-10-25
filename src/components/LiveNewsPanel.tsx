/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NewsArticle } from '../types/election';
import { ExternalLink, Search, Newspaper } from 'lucide-react';

interface LiveNewsPanelProps {
  articles: NewsArticle[];
}

export const LiveNewsPanel: React.FC<LiveNewsPanelProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'Breaking News',
    'Senate',
    'House',
    'Governors',
    'Campaigns',
    'Election Administration',
    'Voting'
  ];

  const filteredArticles = articles.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch =
      a.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-rose-600" />
              <span>Decision Desk 2026: Live Election Newsroom</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verified news reports, field dispatches, and campaign analysis from official news agencies and state authorities.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search election dispatches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Coverage' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md shadow-2xs group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span
                  className={`font-semibold uppercase tracking-wider text-[11px] ${
                    article.isBreaking ? 'text-rose-600 font-bold' : 'text-blue-600'
                  }`}
                >
                  {article.category}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {new Date(article.publishedAt).toLocaleTimeString('en-US', {
                    timeZone: 'America/New_York',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}{' '}
                  ET
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                {article.headline}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">By {article.publisher}</span>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium group-hover:translate-x-0.5 transition-transform"
              >
                <span>Read Dispatch</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
