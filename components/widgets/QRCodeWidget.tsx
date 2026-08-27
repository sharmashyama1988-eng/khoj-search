'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props { initialText?: string }

export function QRCodeWidget({ initialText = '' }: Props) {
  const { t } = useLanguage();
  const [text, setText]       = useState(initialText);
  const [qrUrl, setQrUrl]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use qr-server.com free API (no npm needed for browser)
  useEffect(() => {
    if (!text.trim()) { setQrUrl(null); return; }
    setLoading(true);
    const encoded = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=256x256&format=png`;
    const img = new Image();
    img.onload  = () => { setQrUrl(url); setLoading(false); };
    img.onerror = () => { setLoading(false); };
    img.src = url;
  }, [text]);

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'khoj-qr.png';
    a.target = '_blank';
    a.click();
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 p-5 w-full animate-fade-in">
      <h2 className="text-sm font-semibold text-text-primary mb-4">🔲 {t('chip_qr')}</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('enter_text')}
        rows={3}
        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary
          placeholder-text-muted focus:outline-none focus:border-accent resize-none mb-4"
      />

      {/* QR Code display */}
      <div className="flex justify-center">
        {loading && (
          <div className="w-48 h-48 rounded-xl bg-surface-3 animate-pulse flex items-center justify-center text-text-muted text-sm">
            Generating…
          </div>
        )}
        {qrUrl && !loading && (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-48 h-48 rounded-xl border-4 border-white shadow-lg"
            />
            <button
              onClick={download}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm
                hover:bg-accent-hover transition-all active:scale-95"
            >
              ⬇ {t('download')}
            </button>
          </div>
        )}
        {!qrUrl && !loading && (
          <div className="w-48 h-48 rounded-xl bg-surface-3 border-2 border-dashed border-border
            flex items-center justify-center text-text-muted text-sm text-center p-4">
            Type text or URL above to generate QR code
          </div>
        )}
      </div>
    </div>
  );
}
