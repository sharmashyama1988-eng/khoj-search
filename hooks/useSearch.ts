'use client';
import { useState, useCallback, useRef } from 'react';
import type { SearchResult, ImageResult, BookResult, ArxivResult, GithubResult, WikiPanel, SearchTab } from '@/types';

export interface SearchState {
  results:    SearchResult[];
  images:     ImageResult[];
  books:      BookResult[];
  arxiv:      ArxivResult[];
  github:     GithubResult[];
  wikiPanel:  WikiPanel | null;
  loading:    boolean;
  error:      string | null;
}

const INIT: SearchState = {
  results: [], images: [], books: [], arxiv: [], github: [],
  wikiPanel: null, loading: false, error: null,
};

export function useSearch() {
  const [state, setState] = useState<SearchState>(INIT);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, lang: string, tab: SearchTab) => {
    if (!query.trim()) return;

    // Abort previous in-flight request to prevent race condition
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const fetches: Promise<void>[] = [];
      const safe = (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('safe') || localStorage.getItem('khoj_safesearch') || 'off') : 'off');

      // Fetch global multi-source web results + query expansion for "all" tab
      if (tab === 'all') {
        fetches.push(
          fetch(`/api/web?q=${encodeURIComponent(query)}&lang=${lang}&safe=${safe}`, { signal })
            .then((r) => r.json())
            .then((d: { results?: SearchResult[] }) => {
              if (!signal.aborted) {
                setState((s) => ({ ...s, results: d.results ?? [] }));
              }
            })
            .catch(() => {}),

          fetch(`/api/wikipedia?q=${encodeURIComponent(query)}&lang=${lang}&type=panel`, { signal })
            .then((r) => r.json())
            .then((d: { panel?: WikiPanel | null }) => {
              if (!signal.aborted) {
                setState((s) => ({ ...s, wikiPanel: d.panel ?? null }));
              }
            })
            .catch(() => {}),
        );
      }

      if (tab === 'images') {
        fetches.push(
          fetch(`/api/images?q=${encodeURIComponent(query)}&lang=${lang}&safe=${safe}`, { signal })
            .then((r) => r.json())
            .then((d: { results?: ImageResult[] }) => {
              if (!signal.aborted) {
                setState((s) => ({ ...s, images: d.results ?? [] }));
              }
            })
            .catch(() => {}),
        );
      }

      if (tab === 'books') {
        fetches.push(
          fetch(`/api/books?q=${encodeURIComponent(query)}`, { signal })
            .then((r) => r.json())
            .then((d: { results?: BookResult[] }) => {
              if (!signal.aborted) {
                setState((s) => ({ ...s, books: d.results ?? [] }));
              }
            })
            .catch(() => {}),
        );
      }

      if (tab === 'research') {
        fetches.push(
          fetch(`/api/arxiv?q=${encodeURIComponent(query)}`, { signal })
            .then((r) => r.json())
            .then((d: { results?: ArxivResult[] }) => {
              if (!signal.aborted) {
                setState((s) => ({ ...s, arxiv: d.results ?? [] }));
              }
            })
            .catch(() => {}),
        );
      }

      if (tab === 'code') {
        fetches.push(
          fetch(`/api/github?q=${encodeURIComponent(query)}`, { signal })
            .then((r) => r.json())
            .then((d: { results?: GithubResult[] }) => {
              if (!signal.aborted) {
                setState((s) => ({ ...s, github: d.results ?? [] }));
              }
            })
            .catch(() => {}),
        );
      }

      await Promise.allSettled(fetches);
    } catch (e) {
      if (!signal.aborted) setState((s) => ({ ...s, error: String(e) }));
    } finally {
      if (!signal.aborted) setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(INIT);
  }, []);

  return { ...state, search, reset };
}
