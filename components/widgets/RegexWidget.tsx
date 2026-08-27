'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';

type Mode = 'regex' | 'base64' | 'url' | 'hash';

export function RegexWidget() {
  const [mode, setMode]     = useState<Mode>('regex');
  const [input, setInput]   = useState('');
  const [pattern, setPattern] = useState('');
  const [flags, setFlags]   = useState('gi');
  const [output, setOutput] = useState('');
  const [error, setError]   = useState('');
  const [matches, setMatches] = useState<string[]>([]);

  const runRegex = useCallback(() => {
    if (!pattern || !input) return;
    setError('');
    setMatches([]);
    try {
      const re   = new RegExp(pattern, flags);
      const all  = Array.from(input.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')));
      setMatches(all.map((m) => m[0]));
      setOutput(input.replace(re, (m) => `【${m}】`));
    } catch (e) {
      setError(String(e));
    }
  }, [pattern, input, flags]);

  const runBase64 = useCallback((dir: 'encode' | 'decode') => {
    setError('');
    try {
      setOutput(dir === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))));
    } catch { setError('Invalid Base64 input'); }
  }, [input]);

  const runUrl = useCallback((dir: 'encode' | 'decode') => {
    setError('');
    try {
      setOutput(dir === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch { setError('Invalid URL encoding'); }
  }, [input]);

  const TABS: { id: Mode; label: string; icon: string }[] = [
    { id: 'regex',  label: 'RegEx',      icon: '🔤' },
    { id: 'base64', label: 'Base64',     icon: '🔡' },
    { id: 'url',    label: 'URL Encode', icon: '🔗' },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      {/* Mode tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setMode(tab.id); setOutput(''); setError(''); setMatches([]); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors
              ${mode === tab.id ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {/* RegEx pattern */}
        {mode === 'regex' && (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-1 px-3 py-2 rounded-lg bg-surface border border-border font-mono text-sm">
              <span className="text-text-muted">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="pattern"
                className="flex-1 bg-transparent text-text-primary outline-none"
              />
              <span className="text-text-muted">/</span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-10 bg-transparent text-accent outline-none font-mono"
              />
            </div>
            <button onClick={runRegex}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent-hover transition-all active:scale-95">
              Test
            </button>
          </div>
        )}

        {/* Input text */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'regex' ? 'Enter test string…' : mode === 'base64' ? 'Enter text or Base64…' : 'Enter URL or text…'}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm font-mono
            text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none"
        />

        {/* Action buttons */}
        {mode === 'base64' && (
          <div className="flex gap-2">
            <button onClick={() => runBase64('encode')}
              className="flex-1 py-2 rounded-lg bg-surface-3 text-text-secondary text-sm hover:bg-surface-2 hover:text-text-primary transition-all border border-border">
              Encode →
            </button>
            <button onClick={() => runBase64('decode')}
              className="flex-1 py-2 rounded-lg bg-surface-3 text-text-secondary text-sm hover:bg-surface-2 hover:text-text-primary transition-all border border-border">
              ← Decode
            </button>
          </div>
        )}

        {mode === 'url' && (
          <div className="flex gap-2">
            <button onClick={() => runUrl('encode')}
              className="flex-1 py-2 rounded-lg bg-surface-3 text-text-secondary text-sm hover:bg-surface-2 hover:text-text-primary transition-all border border-border">
              Encode →
            </button>
            <button onClick={() => runUrl('decode')}
              className="flex-1 py-2 rounded-lg bg-surface-3 text-text-secondary text-sm hover:bg-surface-2 hover:text-text-primary transition-all border border-border">
              ← Decode
            </button>
          </div>
        )}

        {/* Match count */}
        {mode === 'regex' && matches.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-text-muted">{matches.length} match{matches.length !== 1 ? 'es' : ''}:</span>
            {matches.slice(0, 10).map((m, i) => (
              <span key={i} className="text-xs font-mono px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        {/* Output */}
        {output && (
          <div className="relative">
            <div className="absolute top-2 right-2"><CopyButton text={output} /></div>
            <pre className="px-3 py-3 rounded-lg bg-[#0d1117] text-sm font-mono text-[#e6edf3]
              whitespace-pre-wrap break-all max-h-40 overflow-y-auto pr-20">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
