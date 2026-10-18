import React from 'react';

interface LootsyLogoProps {
  className?: string;
  size?: number | string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  withBackground?: boolean;
}

export const LootsyLogo: React.FC<LootsyLogoProps> = ({
  className = '',
  size = 40,
  showWordmark = false,
  wordmarkClassName = '',
  withBackground = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="Lootsy Logo"
      >
        {withBackground && (
          <rect width="512" height="512" rx="0" fill="#171513" />
        )}
        
        {/* Sliced Circle with Diagonal Ember Orange Bar at -33.5 degrees */}
        <g transform="rotate(-33.5 256 256)">
          <defs>
            <clipPath id="circle-clip">
              <circle cx="256" cy="256" r="145" />
            </clipPath>
          </defs>

          {/* Group clipped to circular boundary */}
          <g clipPath="url(#circle-clip)">
            {/* Top Warm Ivory Segment (above y = 236) */}
            <rect x="0" y="0" width="512" height="236" fill="#F6F0E7" />

            {/* Bottom Warm Ivory Segment (below y = 276) */}
            <rect x="0" y="276" width="512" height="236" fill="#F6F0E7" />

            {/* Dark channel between y=236 and y=276 is transparent / obsidian */}

            {/* Ember Orange Bar in the channel center */}
            {/* Height = 22px (from y = 245 to 267), with angled faceted ends */}
            <polygon
              points="148,267 172,245 364,245 340,267"
              fill="#FF6538"
            />
          </g>
        </g>
      </svg>

      {showWordmark && (
        <span
          className={`font-body font-extrabold tracking-tight text-[#F6F0E7] ${
            wordmarkClassName || 'text-xl'
          }`}
        >
          Lootsy
        </span>
      )}
    </div>
  );
};

export default LootsyLogo;
