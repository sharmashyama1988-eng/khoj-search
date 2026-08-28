import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export function KhojLogo({ size = 'md', className = '', showText = false }: Props) {
  const dimensions = {
    sm: { box: 'w-8 h-8', text: 'text-xl', icon: 16 },
    md: { box: 'w-10 h-10', text: 'text-2xl', icon: 20 },
    lg: { box: 'w-14 h-14', text: 'text-3xl', icon: 28 },
    xl: { box: 'w-20 h-20', text: 'text-5xl', icon: 40 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${dimensions.box} rounded-2xl overflow-hidden
        shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-500/30 bg-gradient-to-tr from-[#1e1b4b] via-[#312e81] to-[#4f46e5]
        hover:scale-105 transition-transform duration-200 group cursor-pointer select-none shrink-0 flex items-center justify-center`}>
        
        {/* Instant 0ms SVG icon */}
        <svg
          className="absolute text-indigo-200"
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <path d="M11 8v6M8 11h6" strokeOpacity="0.6" strokeWidth="2" />
        </svg>

        {/* 3D App Logo Image (with instant async decode) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="Khoj"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-10"
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight ${dimensions.text} text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-indigo-200 to-indigo-400`}>
          Khoj
        </span>
      )}
    </div>
  );
}
