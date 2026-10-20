import React from 'react';
import { BadgeCheck } from 'lucide-react';

export type VerifiedBadgeVariant = 'blue' | 'gold' | 'emerald' | 'outline';
export type VerifiedBadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface VerifiedBadgeProps {
  size?: VerifiedBadgeSize;
  variant?: VerifiedBadgeVariant;
  className?: string;
  title?: string;
  showTooltip?: boolean;
}

const sizeConfig: Record<
  VerifiedBadgeSize,
  {
    svgSize: number;
    classes: string;
    iconClasses: string;
  }
> = {
  xs: {
    svgSize: 13,
    classes: 'w-[13px] h-[13px]',
    iconClasses: 'w-3 h-3',
  },
  sm: {
    svgSize: 15,
    classes: 'w-[15px] h-[15px]',
    iconClasses: 'w-3.5 h-3.5',
  },
  md: {
    svgSize: 18,
    classes: 'w-[18px] h-[18px]',
    iconClasses: 'w-4 h-4',
  },
  lg: {
    svgSize: 22,
    classes: 'w-[22px] h-[22px]',
    iconClasses: 'w-5 h-5',
  },
};

const variantColors: Record<
  Exclude<VerifiedBadgeVariant, 'outline'>,
  {
    gradientStart: string;
    gradientEnd: string;
    glow: string;
    border: string;
  }
> = {
  blue: {
    gradientStart: '#2AABEE', // Crisp verified sky/azure blue
    gradientEnd: '#157AF6',
    glow: 'rgba(21, 122, 246, 0.35)',
    border: 'rgba(42, 171, 238, 0.4)',
  },
  gold: {
    gradientStart: '#FBBF24', // Warm gold for staff/founder
    gradientEnd: '#D97706',
    glow: 'rgba(245, 158, 11, 0.35)',
    border: 'rgba(251, 191, 36, 0.4)',
  },
  emerald: {
    gradientStart: '#34D399', // Emerald for official groups
    gradientEnd: '#059669',
    glow: 'rgba(16, 185, 129, 0.35)',
    border: 'rgba(52, 211, 153, 0.4)',
  },
};

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'sm',
  variant = 'blue',
  className = '',
  title = 'Compte certifié officiel',
  showTooltip = true,
}) => {
  const { svgSize, classes, iconClasses } = sizeConfig[size];

  // If outline style requested, use Lucide BadgeCheck with custom color
  if (variant === 'outline') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 align-middle ${className}`}
        title={showTooltip ? title : undefined}
        aria-label={title}
      >
        <BadgeCheck
          className={`${iconClasses} text-[#2AABEE] shrink-0`}
          strokeWidth={2.4}
        />
      </span>
    );
  }

  const colors = variantColors[variant];
  const gradientId = `verified-badge-grad-${variant}-${size}`;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 align-middle select-none transition-transform duration-150 hover:scale-105 ${className}`}
      title={showTooltip ? title : undefined}
      aria-label={title}
      style={{
        filter: `drop-shadow(0 1px 2px ${colors.glow})`,
      }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${classes} shrink-0 block`}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="12"
            y1="2"
            x2="12"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.gradientStart} />
            <stop offset="100%" stopColor={colors.gradientEnd} />
          </linearGradient>
        </defs>

        {/* 12-lobed official rosette badge path (Lucide BadgeCheck geometry) */}
        <path
          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          fill={`url(#${gradientId})`}
        />

        {/* Crisp vector checkmark with rounded stroke caps */}
        <path
          d="M9.25 12.2 11.35 14.3 15.65 9.85"
          stroke="#FFFFFF"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
