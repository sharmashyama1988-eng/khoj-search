'use client';
import { useState, useEffect, useCallback } from 'react';
import { TTSButton } from '@/components/ui/TTSButton';
import { debounce } from '@/lib/utils';

const LANGUAGES = [
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
];

interface Props {
  initialText?: string;
  initialFrom?: string;
  initialTo?: string;
}

export function TranslatorWidget({
  initialText = 'Hello, how are you? Welcome to Khoj.',
  initialFrom = 'auto',
  initialTo = 'hi',
}: Props) {
  const [sourceText, setSourceText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState(initialFrom);
  const [toLang, setToLang] = useState(initialTo);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const translate = useCallback(async (text: string, from: string, to: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`);
      const data = await res.json() as { translatedText?: string };
      setTranslatedText(data.translatedText || text);
    } catch {
      setTranslatedText('Translation unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedTranslate = useCallback(
    debounce((text: string, from: string, to: string) => {
      translate(text, from, to);
    }, 400),
    [translate]
  );

  useEffect(() => {
    translate(sourceText, fromLang, toLang);
  }, []);

  const handleSourceChange = (val: string) => {
    setSourceText(val);
    debouncedTranslate(val, fromLang, toLang);
  };

  const handleSwap = () => {
    const nextFrom = toLang;
    const nextTo = fromLang === 'auto' ? 'en' : fromLang;
    const nextSource = translatedText || sourceText;

    setFromLang(nextFrom);
    setToLang(nextTo);
    setSourceText(nextSource);
    translate(nextSource, nextFrom, nextTo);
  };

  const copyTranslation = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-surface-2/95 backdrop-blur-xl shadow-xl overflow-hidden animate-slide-up mb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent">
        <div className="flex items-center gap-2">
          <span className="text-base">🌐</span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Khoj Universal Neural Translator
          </span>
        </div>
        <span className="text-[11px] text-text-muted">
          AI Voice & Multi-Language
        </span>
      </div>

      {/* Language Selectors Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-surface-3/40 border-b border-border/40 gap-2">
        <select
          value={fromLang}
          onChange={(e) => {
            const next = e.target.value;
            setFromLang(next);
            translate(sourceText, next, toLang);
          }}
          className="bg-surface-2 text-text-primary text-xs font-medium px-3 py-1.5 rounded-lg border border-border outline-none cursor-pointer"
        >
          <option value="auto">Detect Language (Auto)</option>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className="p-1.5 rounded-full hover:bg-surface-2 text-text-secondary hover:text-indigo-400 transition-colors cursor-pointer"
          title="Swap Languages"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <select
          value={toLang}
          onChange={(e) => {
            const next = e.target.value;
            setToLang(next);
            translate(sourceText, fromLang, next);
          }}
          className="bg-surface-2 text-text-primary text-xs font-medium px-3 py-1.5 rounded-lg border border-border outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      {/* Two-Column Translation Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
        {/* Left: Source Text Area */}
        <div className="p-4 flex flex-col justify-between min-h-[160px] bg-surface-2/40">
          <textarea
            value={sourceText}
            onChange={(e) => handleSourceChange(e.target.value)}
            placeholder="Type or paste text to translate..."
            rows={4}
            className="w-full bg-transparent text-text-primary placeholder-text-muted text-sm sm:text-base outline-none resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/30">
            <TTSButton
              text={sourceText}
              lang={fromLang === 'auto' ? 'en' : fromLang}
              size="sm"
              label="Listen"
            />
            <span className="text-[11px] text-text-muted">
              {sourceText.length} / 1000
            </span>
          </div>
        </div>

        {/* Right: Translated Output Area */}
        <div className="p-4 flex flex-col justify-between min-h-[160px] bg-surface-3/30 relative">
          {loading && (
            <div className="absolute inset-0 bg-surface-2/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="text-text-primary text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
            {translatedText || (
              <span className="text-text-muted italic">Translation will appear here...</span>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/30">
            <TTSButton
              text={translatedText}
              lang={toLang}
              size="sm"
              label="Listen Output"
            />
            <button
              type="button"
              onClick={copyTranslation}
              className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface-1 text-text-secondary hover:text-text-primary border border-border transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
