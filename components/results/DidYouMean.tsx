'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/navigation';

interface Props { query: string }

// Levenshtein distance for basic spell check
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
  const { lang, t } = useLanguage();
  const router      = useRouter();
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 3) return;
    setSuggestion(null);

    // Use Wikipedia's opensearch to detect misspellings
    const wikiBase = `https://${lang}.wikipedia.org`;
    fetch(`${wikiBase}/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`)
      .then((r) => r.json())
      .then((data: [string, string[]]) => {
        const sugg = data[1]?.[0];
        if (!sugg) return;

        // Only show if suggestion is meaningfully different (Levenshtein > 1)
        const dist = levenshtein(query.toLowerCase(), sugg.toLowerCase());
        if (dist > 1 && dist <= 4 && sugg.toLowerCase() !== query.toLowerCase()) {
          setSuggestion(sugg);
        }
      })
      .catch(() => {});
  }, [query, lang]);

  if (!suggestion) return null;

  return (
    <div className="flex items-center gap-2 mb-4 text-sm animate-fade-in">
      <span className="text-text-muted">Did you mean:</span>
      <button
        onClick={() => router.push(`/search?q=${encodeURIComponent(suggestion)}&lang=${lang}&tab=all`)}
        className="text-accent hover:underline font-medium italic"
      >
        {suggestion}
      </button>
      <span className="text-text-muted">?</span>
    </div>
  );
}
