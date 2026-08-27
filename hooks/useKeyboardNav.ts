'use client';
import { useEffect, useCallback } from 'react';

export function useKeyboardNav(
  itemCount: number,
  activeIndex: number,
  setActiveIndex: (i: number) => void,
  onEnter: (i: number) => void,
  onEscape?: () => void,
) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(Math.min(activeIndex + 1, itemCount - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onEnter(activeIndex);
      } else if (e.key === 'Escape') {
        onEscape?.();
      }
    },
    [activeIndex, itemCount, setActiveIndex, onEnter, onEscape],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
}
