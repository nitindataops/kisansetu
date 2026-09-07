import React from 'react';

/**
 * NaturalAmbiance: Clean, subtle background layer for KisanSetu.
 * Free of floating circles, particles, or distracting animations.
 */
export const NaturalAmbiance: React.FC = () => {
  return (
    <div 
      className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
      aria-hidden="true"
    />
  );
};

