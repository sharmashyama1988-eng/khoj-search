'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/navigation';

interface Props { query: string }

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function DidYouMean({ query }: Props) {
  const { lang } = useLanguage();
  const router   = useRouter();
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 3) return;
    setSuggestion(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    // Call our internal edge-proxied suggestions API instead of direct external fetch
    fetch(`/api/suggestions?q=${encodeURIComponent(query)}&lang=${lang}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { suggestions?: string[] }) => {
        const sugg = data?.suggestions?.[0];
        if (!sugg) return;

        const dist = levenshtein(query.toLowerCase(), sugg.toLowerCase());
        if (dist > 1 && dist <= 4 && sugg.toLowerCase() !== query.toLowerCase()) {
          setSuggestion(sugg);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang]);

  if (!suggestion) return null;

  return (
    <div className="flex items-center gap-2 mb-4 text-sm animate-fade-in">
      <span className="text-text-muted">Did you mean:</span>
      <button
        type="button"
        onClick={() => router.push(`/search?q=${encodeURIComponent(suggestion)}&lang=${lang}&tab=all`)}
        className="text-accent hover:underline font-medium italic cursor-pointer"
      >
        {suggestion}
      </button>
      <span className="text-text-muted">?</span>
    </div>
  );
}
