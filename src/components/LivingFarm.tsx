import React from 'react';

interface StalkProps {
  height?: number;
  speed?: 'slow' | 'medium' | 'fast';
  delay?: string;
  stemColor?: string;
  grainColor?: string;
  leafColor?: string;
  className?: string;
}

const WheatStalk: React.FC<StalkProps> = ({ 
  height = 85, 
  speed = 'medium', 
  delay = '0s', 
  stemColor = '#245C3A',
  grainColor = '#D6A63A',
  leafColor = '#5F8F45',
  className = '' 
}) => {
  const speedClass = 
    speed === 'slow' 
      ? 'animate-sway-slow' 
      : speed === 'fast' 
        ? 'animate-sway-fast' 
        : 'animate-sway-medium';

  return (
    <div 
      className={`inline-block origin-bottom transition-transform select-none ${speedClass} ${className}`}
      style={{ animationDelay: delay }}
    >
      <svg 
        width="28" 
        height={height} 
        viewBox="0 0 24 95" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Main Crop Stem - Deep Forest Green */}
        <path 
          d="M12 95 Q11.5 50 12 12" 
          stroke={stemColor} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />

        {/* Lower Leaves - Harvest Green */}
        <path 
          d="M12 60 Q4 54 2 65" 
          stroke={leafColor} 
          strokeWidth="1.6" 
          fill="none" 
          strokeLinecap="round" 
        />
        <path 
          d="M12 70 Q20 63 23 74" 
          stroke={leafColor} 
          strokeWidth="1.6" 
          fill="none" 
          strokeLinecap="round" 
        />

        {/* Wheat Grains / Spikelets - Golden Harvest */}
        {/* Top spikelet */}
        <ellipse cx="12" cy="12" rx="2.5" ry="5.5" fill={grainColor} />
        <line x1="12" y1="7" x2="12" y2="1" stroke={grainColor} strokeWidth="1" strokeLinecap="round" />

        {/* Alternating wheat kernels & awns */}
        <ellipse cx="9" cy="20" rx="2.6" ry="4.8" transform="rotate(-28 9 20)" fill={grainColor} />
        <ellipse cx="15" cy="20" rx="2.6" ry="4.8" transform="rotate(28 15 20)" fill={grainColor} />
        <line x1="7" y1="18" x2="3.5" y2="12" stroke={grainColor} strokeWidth="0.8" />
        <line x1="17" y1="18" x2="20.5" y2="12" stroke={grainColor} strokeWidth="0.8" />

        <ellipse cx="8.5" cy="28" rx="2.8" ry="5.2" transform="rotate(-30 8.5 28)" fill={grainColor} />
        <ellipse cx="15.5" cy="28" rx="2.8" ry="5.2" transform="rotate(30 15.5 28)" fill={grainColor} />
        <line x1="6.5" y1="26" x2="2.5" y2="19" stroke={grainColor} strokeWidth="0.8" />
        <line x1="17.5" y1="26" x2="21.5" y2="19" stroke={grainColor} strokeWidth="0.8" />

        <ellipse cx="8.5" cy="37" rx="2.8" ry="5.2" transform="rotate(-30 8.5 37)" fill={grainColor} />
        <ellipse cx="15.5" cy="37" rx="2.8" ry="5.2" transform="rotate(30 15.5 37)" fill={grainColor} />
        <line x1="6.5" y1="35" x2="3" y2="28" stroke={grainColor} strokeWidth="0.8" />
        <line x1="17.5" y1="35" x2="21" y2="28" stroke={grainColor} strokeWidth="0.8" />

        <ellipse cx="9" cy="46" rx="2.6" ry="4.8" transform="rotate(-25 9 46)" fill={grainColor} />
        <ellipse cx="15" cy="46" rx="2.6" ry="4.8" transform="rotate(25 15 46)" fill={grainColor} />
      </svg>
    </div>
  );
};

export const LivingFarm: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Staggered array of agricultural stalks with multi-tonal Harvest & Earth values
  const stalks = [
    { height: 80, speed: 'slow' as const, delay: '0s', stem: '#245C3A', grain: '#D6A63A', leaf: '#5F8F45' },
    { height: 65, speed: 'fast' as const, delay: '0.6s', stem: '#2A6641', grain: '#DEAF45', leaf: '#6CA150' },
    { height: 90, speed: 'medium' as const, delay: '1.2s', stem: '#1E4F32', grain: '#C4962D', leaf: '#55823D' },
    { height: 70, speed: 'slow' as const, delay: '2.0s', stem: '#245C3A', grain: '#D6A63A', leaf: '#5F8F45' },
    { height: 85, speed: 'medium' as const, delay: '0.3s', stem: '#265F3C', grain: '#E5B94E', leaf: '#649749' },
    { height: 75, speed: 'fast' as const, delay: '1.7s', stem: '#1E4F32', grain: '#D6A63A', leaf: '#588840' },
    { height: 95, speed: 'slow' as const, delay: '2.5s', stem: '#245C3A', grain: '#C99930', leaf: '#5F8F45' },
    { height: 68, speed: 'medium' as const, delay: '0.9s', stem: '#2E6E47', grain: '#DEAF45', leaf: '#6CA150' },
    { height: 82, speed: 'fast' as const, delay: '1.4s', stem: '#245C3A', grain: '#D6A63A', leaf: '#5F8F45' },
    { height: 88, speed: 'slow' as const, delay: '0.4s', stem: '#1E4F32', grain: '#DDAE42', leaf: '#55823D' },
    { height: 72, speed: 'medium' as const, delay: '2.1s', stem: '#28633E', grain: '#D6A63A', leaf: '#629447' },
    { height: 92, speed: 'fast' as const, delay: '1.0s', stem: '#245C3A', grain: '#C4962D', leaf: '#5F8F45' },
    { height: 78, speed: 'slow' as const, delay: '1.8s', stem: '#2A6641', grain: '#E2B54A', leaf: '#689C4E' },
    { height: 86, speed: 'medium' as const, delay: '0.7s', stem: '#1E4F32', grain: '#D6A63A', leaf: '#55823D' },
    { height: 69, speed: 'fast' as const, delay: '2.3s', stem: '#245C3A', grain: '#DDAE42', leaf: '#5F8F45' },
    { height: 82, speed: 'slow' as const, delay: '1.1s', stem: '#265F3C', grain: '#D6A63A', leaf: '#629447' },
    { height: 90, speed: 'medium' as const, delay: '0.2s', stem: '#1E4F32', grain: '#C4962D', leaf: '#55823D' },
    { height: 74, speed: 'fast' as const, delay: '1.5s', stem: '#245C3A', grain: '#DEAF45', leaf: '#5F8F45' },
    { height: 88, speed: 'slow' as const, delay: '2.4s', stem: '#2A6641', grain: '#D6A63A', leaf: '#689C4E' },
    { height: 66, speed: 'medium' as const, delay: '0.8s', stem: '#1E4F32', grain: '#E2B54A', leaf: '#55823D' },
  ];

  return (
    <div 
      className={`relative w-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-label="Living Farm decorative crops animation"
    >
      {/* Soft soil & grass base gradient */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#EEF3E8] via-[#EEF3E8]/60 to-transparent z-10" />

      {/* Layer 1: Background Subtle Crops */}
      <div className="flex items-end justify-between w-full px-2 opacity-35 blur-[0.4px] transform translate-y-3">
        {stalks.map((s, i) => (
          <WheatStalk
            key={`bg-${i}`}
            height={Math.round(s.height * 0.78)}
            speed={s.speed}
            delay={`${(parseFloat(s.delay) + 1.5) % 3}s`}
            stemColor="#2A6641"
            grainColor="#C4962D"
            leafColor="#6CA150"
            className="flex-shrink-0 -mx-1"
          />
        ))}
      </div>

      {/* Layer 2: Foreground Living Farm Wheat Silhouettes */}
      <div className="flex items-end justify-between w-full px-1 relative z-20">
        {stalks.map((s, i) => (
          <WheatStalk
            key={`fg-${i}`}
            height={s.height}
            speed={s.speed}
            delay={s.delay}
            stemColor={s.stem}
            grainColor={s.grain}
            leafColor={s.leaf}
            className="flex-shrink-0 -mx-0.5 sm:mx-0"
          />
        ))}
      </div>
    </div>
  );
};
