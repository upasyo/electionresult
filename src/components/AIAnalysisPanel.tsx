/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NationalOverview } from '../types/election';
import { Sparkles, Send, BrainCircuit, HelpCircle } from 'lucide-react';

interface AIAnalysisPanelProps {
  overview: NationalOverview | null;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ overview }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string>(
    `### Decision Desk Strategic Overview: 2026 U.S. Midterms\n\n**Chamber Control Thresholds:**\n* **U.S. Senate (51 to win):** The battleground map hinges decisively on three Class 2 battlegrounds: Georgia (Ossoff vs. Carr), North Carolina (Tillis vs. Cooper), and Maine (Collins vs. Golden). Holding the incumbent White House party to minimal losses is historically the primary objective in midterm cycles.\n* **U.S. House of Representatives (218 to win):** A razor-thin majority means single-digit shifts in suburban districts in California (CA-22, CA-13), New York (NY-17, NY-19), and Virginia (VA-02) can flip the Speaker's gavel.\n* **Gubernatorial Landscape (36 races):** Key open governorships in Florida, Georgia, and California represent major executive realignment for the 2026-2030 cycle.\n\n*Live tabulated results are updated continuously by the Decision Desk tabulation engine.*`
  );
  const [modelAttribution, setModelAttribution] = useState('Gemini 3.8 Flash / Decision Desk Analytics');

  const presetQueries = [
    'Assess the 3 critical tipping-point Senate battlegrounds',
    'What is the statistical path to 218 House seats for either party?',
    'Analyze midterm turnout patterns in suburban vs rural districts',
    'How could split-ticket voting impact Georgia and North Carolina?'
  ];

  const handleAsk = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          context: overview
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisText(data.analysis);
        setModelAttribution(data.disclaimer || 'Decision Desk AI Analyst (gemini-3.8-flash)');
      } else {
        setAnalysisText('Analysis request could not be processed at this time. Please retry.');
      }
    } catch (err) {
      console.error(err);
      setAnalysisText('Failed to reach analysis engine. Please verify network connection.');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-600" />
            <span>Chief Election Analyst: Strategic Intelligence Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Grounded non-partisan election night modeling, battleground scenario simulation, and demographic voting analysis.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Server-Side Gemini 3.8 Flash</span>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Select Analytical Scenario</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetQueries.map((pq, i) => (
            <button
              key={i}
              onClick={() => handleAsk(pq)}
              disabled={loading}
              className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-all hover:border-purple-300"
            >
              "{pq}"
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative shadow-inner">
        <div className="text-xs max-w-none text-slate-800 leading-relaxed font-sans whitespace-pre-line">
          {analysisText}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>{modelAttribution}</span>
          <span>Verified Non-Partisan Analysis</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask the Chief Election Analyst a question about the 2026 Midterm races..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          {loading ? (
            <span>Analyzing...</span>
          ) : (
            <>
              <span>Ask Analyst</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
