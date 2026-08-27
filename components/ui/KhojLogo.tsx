import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export function KhojLogo({ size = 'md', className = '', showText = false }: Props) {
  const dimensions = {
    sm: { box: 'w-8 h-8', text: 'text-xl' },
    md: { box: 'w-10 h-10', text: 'text-2xl' },
    lg: { box: 'w-14 h-14', text: 'text-3xl' },
    xl: { box: 'w-20 h-20', text: 'text-5xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${dimensions.box} rounded-2xl overflow-hidden
        shadow-lg shadow-indigo-500/20 ring-1 ring-white/10
        hover:scale-105 transition-transform duration-200 group cursor-pointer select-none shrink-0`}>
        {/* AI Generated 3D Premium Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="Khoj Logo"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // Fallback SVG if image is unavailable
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight ${dimensions.text} text-text-primary`}>
          Khoj
        </span>
      )}
    </div>
  );
}
