'use client';
import { useState, useEffect } from 'react';
import { TTSButton } from '@/components/ui/TTSButton';
import { CopyButton } from '@/components/ui/CopyButton';
import type { AgentExecutionResult } from '@/lib/agent/engine';

interface Props {
  initialQuery?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentCopilotModal({ initialQuery = '', isOpen, onClose }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentExecutionResult | null>(null);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const runAgent = async (promptQuery: string) => {
    if (!promptQuery.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/agent?q=${encodeURIComponent(promptQuery.trim())}`);
      const data = await res.json() as AgentExecutionResult;
      setResult(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface-2 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <span className="text-xl animate-bounce">🤖</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                Khoj Autonomous AI Agent
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono">
                  v2.5
                </span>
              </h2>
              <p className="text-[11px] text-text-muted">
                Multi-tool autonomous research, price verification & neural synthesis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 border-b border-border/40 bg-surface-3/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAgent(query);
            }}
            className="flex items-center gap-2 bg-surface-2 border border-indigo-500/30 rounded-2xl p-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask agent: e.g. 'Compare iPhone 16e vs Galaxy S24 Ultra and get latest gold rate'"
              className="flex-1 bg-transparent px-3 py-1.5 text-sm sm:text-base text-text-primary placeholder-text-muted outline-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Thinking...' : 'Run Agent ⚡'}
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="text-text-muted py-1">Try:</span>
            {[
              'Current 24K Gold price & silver bhav',
              'iPhone 16e specs and pricing in India',
              'Translate "Knowledge is power" to Hindi & Spanish',
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  runAgent(prompt);
                }}
                className="px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface-1 border border-border/60 text-text-secondary hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-lg">⚡</span>
              </div>
              <p className="text-sm font-medium text-text-primary animate-pulse">
                Autonomous agent is dispatching parallel retrieval tools...
              </p>
              <div className="flex gap-2 text-[11px] text-text-muted">
                <span>• Lexical BM25+</span>
                <span>• RTDT Price Engine</span>
                <span>• Knowledge Synthesis</span>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-slide-up">
              {/* Direct Answer Box */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <span>✦</span> Verified Direct Answer
                  </span>
                  <div className="flex items-center gap-2">
                    <TTSButton text={result.directAnswer} lang="en" size="sm" />
                    <CopyButton text={result.directAnswer} />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-text-primary font-medium leading-relaxed">
                  {result.directAnswer}
                </p>
              </div>

              {/* Key Insights */}
              {result.keyInsights && result.keyInsights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Key Autonomous Findings:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.keyInsights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface-3/50 border border-border/50 text-xs text-text-primary flex items-start gap-2"
                      >
                        <span className="text-indigo-400 font-bold">✓</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning Steps Trace */}
              {result.steps && result.steps.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Agent Reasoning Steps & Tool Executions:
                  </h3>
                  <div className="space-y-2">
                    {result.steps.map((st) => (
                      <div
                        key={st.step}
                        className="p-3 rounded-xl bg-surface-3/30 border border-border/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-indigo-400">
                            Step {st.step}: {st.toolName}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">
                            {st.action}
                          </span>
                        </div>
                        <p className="text-text-secondary font-mono text-[11px]">
                          {st.outputSummary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations Footer */}
              {result.sources && result.sources.length > 0 && (
                <div className="pt-4 border-t border-border/40">
                  <h4 className="text-xs font-semibold text-text-muted mb-2">
                    Grounded Reference Sources:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.slice(0, 5).map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-surface-3 hover:bg-surface-4 text-text-secondary hover:text-indigo-400 border border-border text-[11px] transition-colors truncate max-w-xs"
                      >
                        {s.title} ({s.source}) ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
