'use client';
import { useState, useRef, useEffect } from 'react';

interface Props {
  text: string;
  lang?: string;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TTSButton({
  text,
  lang = 'en',
  className = '',
  label,
  size = 'md',
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!text.trim()) return;

    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setLoading(true);

    // Audio stream from our edge /api/tts endpoint
    const audioUrl = `/api/tts?text=${encodeURIComponent(text.slice(0, 300))}&lang=${encodeURIComponent(lang)}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => {
      setLoading(false);
      setPlaying(true);
    };

    audio.onended = () => {
      setPlaying(false);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setLoading(false);
      setPlaying(false);
      audioRef.current = null;
      // Fallback to Web Speech API if network audio fails
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        window.speechSynthesis.speak(u);
      }
    };

    audio.play().catch(() => {
      setLoading(false);
      setPlaying(false);
    });
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
    lg: 'px-4 py-2 text-sm gap-2',
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      disabled={loading}
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 cursor-pointer select-none active:scale-95 shadow-sm border ${
        playing
          ? 'bg-indigo-500 text-white border-indigo-400 ring-2 ring-indigo-500/30'
          : 'bg-surface-3 hover:bg-surface-2 text-text-secondary hover:text-text-primary border-border'
      } ${sizeStyles[size]} ${className}`}
      title={playing ? 'Stop Audio' : 'Listen with Crystal-Clear Human Voice'}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : playing ? (
        /* Animated sound wave bars */
        <div className="flex items-center gap-0.5 h-3.5">
          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" />
          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]" />
        </div>
      ) : (
        /* Speaker icon */
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
      <span>{playing ? 'Playing...' : label || 'Listen'}</span>
    </button>
  );
}
