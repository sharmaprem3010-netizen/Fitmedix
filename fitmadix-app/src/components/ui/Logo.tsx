import React from 'react';

interface LogoProps {
  variant?: 'full' | 'symbol' | 'compact' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const FitmadixLogo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const sizeMap = {
    sm: { symbol: 28, text: 'text-base', tagline: 'text-[8px]', height: 'h-8' },
    md: { symbol: 38, text: 'text-xl', tagline: 'text-[9px]', height: 'h-10' },
    lg: { symbol: 52, text: 'text-2xl', tagline: 'text-[10px]', height: 'h-14' },
    xl: { symbol: 72, text: 'text-4xl', tagline: 'text-xs', height: 'h-20' },
  };

  const currentSize = sizeMap[size];

  // Precision vector SVG of the Fitmadix Symbol from the official logo
  const SymbolSVG = ({ s }: { s: number }) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="Fitmadix Symbol"
    >
      <defs>
        {/* Teal to Cyan Gradient for top curve */}
        <linearGradient id="fmTealGrad" x1="20%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#00A88F" />
          <stop offset="60%" stopColor="#02B89D" />
          <stop offset="100%" stopColor="#00D2B4" />
        </linearGradient>

        {/* Deep Royal/Navy Gradient for stem & pill */}
        <linearGradient id="fmNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A3663" />
          <stop offset="50%" stopColor="#002B49" />
          <stop offset="100%" stopColor="#031C30" />
        </linearGradient>

        {/* Blue Capsule Gradient */}
        <linearGradient id="fmCapsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#0052CC" />
        </linearGradient>

        {/* Green Leaf Gradient */}
        <linearGradient id="fmLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6BCB77" />
          <stop offset="100%" stopColor="#2EAA4D" />
        </linearGradient>

        {/* Outer Swoosh Arc Gradient */}
        <linearGradient id="fmSwooshTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A88F" />
          <stop offset="100%" stopColor="#00D2B4" />
        </linearGradient>
        <linearGradient id="fmSwooshNavy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#002B49" />
          <stop offset="100%" stopColor="#084B82" />
        </linearGradient>
      </defs>

      {/* Top Outer Circular Swoosh Arc */}
      <path
        d="M 68 32 C 105 18, 142 22, 172 44"
        stroke="url(#fmSwooshTeal)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bottom Outer Circular Swoosh Arc */}
      <path
        d="M 80 166 C 118 178, 158 165, 182 130 C 188 120, 190 106, 189 95"
        stroke="url(#fmSwooshNavy)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left Outer Swoosh Arc */}
      <path
        d="M 36 122 C 26 95, 30 65, 48 44"
        stroke="url(#fmSwooshTeal)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Stylized Upper 'F' Canopy with curve */}
      <path
        d="M 72 44 C 95 40, 140 38, 164 40 C 168 40, 172 44, 170 50 C 168 56, 164 62, 156 62 C 136 62, 114 62, 102 62 C 92 62, 88 68, 86 80 L 82 108 L 62 108 L 72 44 Z"
        fill="url(#fmTealGrad)"
      />

      {/* Lower Stem & Capsule Base of 'F' */}
      <path
        d="M 62 108 L 74 44 L 88 44 L 74 126 C 72 138, 64 154, 50 154 C 42 154, 40 148, 42 138 L 52 90 Z"
        fill="url(#fmNavyGrad)"
      />

      {/* Rounded Pill / Capsule Accent at center-right of 'F' stem */}
      <rect
        x="98"
        y="88"
        width="26"
        height="48"
        rx="13"
        fill="url(#fmCapsuleGrad)"
        transform="rotate(12 111 112)"
      />
      {/* Capsule shine / highlight */}
      <path
        d="M 103 94 C 107 90, 113 90, 116 93"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Medical Cross '+' at the middle of F */}
      {/* Horizontal Cross arm */}
      <rect x="86" y="76" width="34" height="15" rx="3" fill="#ffffff" />
      {/* Vertical Cross arm */}
      <rect x="95" y="66" width="16" height="35" rx="3" fill="#ffffff" />
      {/* Right cross tip extension in Navy */}
      <rect x="120" y="76" width="16" height="15" rx="2" fill="#00A88F" />

      {/* ECG / Heartbeat pulse line emerging from cross */}
      <path
        d="M 136 84 L 146 84 L 150 72 L 154 94 L 158 80 L 162 87 L 166 84 L 180 84"
        stroke="#00A88F"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Fresh Green Herbal Leaves at top right of 'F' */}
      {/* Leaf 1 (upper) */}
      <path
        d="M 166 42 C 168 34, 180 28, 186 28 C 187 36, 182 46, 172 48 C 168 49, 165 46, 166 42 Z"
        fill="url(#fmLeafGrad)"
      />
      {/* Leaf 2 (lower) */}
      <path
        d="M 166 52 C 172 48, 184 48, 185 54 C 185 62, 175 66, 168 62 C 165 60, 165 55, 166 52 Z"
        fill="url(#fmLeafGrad)"
      />
    </svg>
  );

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <SymbolSVG s={currentSize.symbol} />
      </div>
    );
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <SymbolSVG s={currentSize.symbol} />

      <div className="flex flex-col select-none text-left">
        {/* Wordmark: "fit" (teal) + "madix" (navy or white) */}
        <div className={`font-extrabold tracking-tight leading-none ${currentSize.text}`}>
          <span className="text-[#00A88F]">fit</span>
          <span className={`${isWhite ? 'text-white' : 'text-[#002B49]'} relative`}>
            madi
            <span className="relative inline-block">
              x
              {/* Distinctive accent in the 'x' matching logo */}
              <span
                className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#00A88F] -mt-0.5 -mr-0.5 opacity-80"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>

        {/* Slogan */}
        {showTagline && (
          <div className={`flex items-center gap-1.5 mt-1 font-semibold tracking-wider uppercase ${isWhite ? 'text-slate-300' : 'text-slate-500'}`}>
            <span className={`h-[0.75px] w-3 ${isWhite ? 'bg-slate-600' : 'bg-slate-300'}`} aria-hidden="true" />
            <span className={currentSize.tagline}>Your Health, Our Priority</span>
            <span className={`h-[0.75px] w-3 ${isWhite ? 'bg-slate-600' : 'bg-slate-300'}`} aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};
