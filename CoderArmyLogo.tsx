import React from 'react';

interface CoderArmyLogoProps {
  variant?: 'badge' | 'icon' | 'full';
  size?: number | string;
  className?: string;
  roundedClassName?: string;
}

export const CoderArmyLogo: React.FC<CoderArmyLogoProps> = ({
  variant = 'badge',
  size,
  className = '',
  roundedClassName = 'rounded-xl',
}) => {
  // SVG of the CA Monogram
  const MonogramSvg = ({ isTransparent = false }: { isTransparent?: boolean }) => (
    <svg
      viewBox="0 0 300 300"
      className="w-full h-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ca-comp-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="ca-comp-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#00A3FF" />
        </linearGradient>
        <filter id="ca-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {!isTransparent && (
        <rect width="300" height="300" rx="60" fill="#0A0F1D" />
      )}

      <g transform="translate(10, 15)" filter="url(#ca-shadow)">
        {/* Letter C */}
        <path
          d="M 185 45
             C 170 45 155 48 140 55
             C 112 45 80 55 55 85
             C 20 125 20 190 55 228
             C 86 260 132 265 170 245
             L 158 214
             C 132 226 100 220 76 198
             C 52 172 52 138 76 112
             C 97 89 127 84 155 97
             L 185 45 Z"
          fill="url(#ca-comp-silver)"
        />

        {/* Code Brackets < / > inside C */}
        <path
          d="M 94 138 L 72 156 L 94 174"
          fill="none"
          stroke="url(#ca-comp-cyan)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 112 128 L 100 184"
          fill="none"
          stroke="url(#ca-comp-cyan)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 120 138 L 142 156 L 120 174"
          fill="none"
          stroke="url(#ca-comp-cyan)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Letter A with military peak */}
        <path
          d="M 198 35
             L 152 235
             L 185 235
             L 196 188
             L 238 188
             L 249 235
             L 282 235
             L 236 35
             Z
             M 217 82
             L 231 160
             L 203 160
             Z"
          fill="url(#ca-comp-silver)"
          fillRule="evenodd"
        />

        {/* Star inside A */}
        <polygon
          points="217,92 220,100 229,100 222,106 224,115 217,109 210,115 212,106 205,100 214,100"
          fill="#FFFFFF"
        />

        {/* Military Chevrons (Rank Stripes) inside A */}
        {/* Chevron 1 (Upper) */}
        <path
          d="M 205 128 L 217 140 L 229 128"
          fill="none"
          stroke="url(#ca-comp-cyan)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Chevron 2 (Lower) */}
        <path
          d="M 205 148 L 217 160 L 229 148"
          fill="none"
          stroke="url(#ca-comp-cyan)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-slate-950 border border-slate-800 shadow-md ${roundedClassName} ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <MonogramSvg isTransparent={false} />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <MonogramSvg isTransparent={true} />
      </div>
    );
  }

  // Full Coder Army Logo
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl ${className}`}
      style={size ? { width: size } : undefined}
    >
      <div className="w-24 h-24">
        <MonogramSvg isTransparent={true} />
      </div>

      <div className="text-center mt-1">
        <span className="block text-2xl font-black tracking-widest text-white font-mono">
          CODER
        </span>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <span className="w-5 h-0.5 bg-sky-400 rounded-full" />
          <span className="text-sm font-black tracking-widest text-sky-400">
            ARMY
          </span>
          <span className="w-5 h-0.5 bg-sky-400 rounded-full" />
        </div>
        <span className="block text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">
          CODE • BUILD • IMPACT
        </span>
      </div>
    </div>
  );
};
