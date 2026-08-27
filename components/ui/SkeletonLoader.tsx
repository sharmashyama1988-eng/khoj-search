'use client';
import { cn } from '@/lib/utils';

interface Props { className?: string; variant?: 'card' | 'text' | 'image'; count?: number }

function ShimmerBar({ className }: { className?: string }) {
  return (
    <div className={cn(
      'rounded animate-pulse bg-gradient-to-r from-surface-2 via-surface-3 to-surface-2 bg-[length:700px_100%]',
      className
    )} />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-xl border border-border space-y-3">
      <ShimmerBar className="h-4 w-3/4" />
      <ShimmerBar className="h-3 w-full" />
      <ShimmerBar className="h-3 w-5/6" />
      <ShimmerBar className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonPanel() {
  return (
    <div className="p-5 rounded-xl border border-border space-y-4">
      <ShimmerBar className="h-5 w-1/2" />
      <ShimmerBar className="h-40 w-full rounded-lg" />
      <ShimmerBar className="h-3 w-full" />
      <ShimmerBar className="h-3 w-full" />
      <ShimmerBar className="h-3 w-3/4" />
    </div>
  );
}

export function SkeletonImageGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <ShimmerBar key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonLoader({ count = 5 }: Props) {
  return (
    <div className="space-y-3 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
