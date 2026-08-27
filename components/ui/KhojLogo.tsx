import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export function KhojLogo({ size = 'md', className = '', showText = false }: Props) {
  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 32, text: 'text-xl' },
    md: { box: 'w-10 h-10', icon: 40, text: 'text-2xl' },
    lg: { box: 'w-14 h-14', icon: 56, text: 'text-3xl' },
    xl: { box: 'w-20 h-20', icon: 80, text: 'text-5xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${dimensions.box} rounded-2xl flex items-center justify-center
        bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500
        shadow-lg shadow-indigo-500/30 ring-1 ring-white/20
        hover:scale-105 transition-all duration-300 group cursor-pointer select-none`}>
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-pink-400 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
        
        {/* Logo SVG Icon */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-3/5 h-3/5 text-white drop-shadow-md fill-none stroke-current"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Magnifying Glass Lens */}
          <circle cx="45" cy="45" r="28" stroke="currentColor" strokeWidth="9" />
          {/* Magnifying Glass Handle */}
          <path d="M65 65 L88 88" stroke="currentColor" strokeWidth="10" />
          {/* Stylized K inside Lens */}
          <path d="M36 30 L36 60" stroke="white" strokeWidth="8" />
          <path d="M52 32 L38 46 L54 60" stroke="white" strokeWidth="8" />
        </svg>
      </div>

      {showText && (
        <span className={`font-black tracking-tight ${dimensions.text} bg-gradient-to-r from-text-primary via-indigo-400 to-purple-400 bg-clip-text text-transparent`}>
          Khoj
        </span>
      )}
    </div>
  );
}
