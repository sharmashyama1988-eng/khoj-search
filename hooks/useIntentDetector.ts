'use client';
import { useMemo } from 'react';
import { detectIntent } from '@/lib/intent';
import type { DetectedIntent } from '@/types';

export function useIntentDetector(query: string): DetectedIntent {
  return useMemo(() => detectIntent(query), [query]);
}
