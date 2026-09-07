import React, { useEffect, useState, useRef } from 'react';

/**
 * LivingFarmBackground: Full-Page Cinematic Indian Agriculture Environment.
 * 
 * Provides a continuous, photographic agricultural backdrop spanning the entire
 * KisanSetu Home Page (from top Navbar to Footer).
 * 
 * Features:
 * - Real photographic Indian farm landscape with lush crops, fertile soil, and morning daylight.
 * - Extremely subtle, slow natural breathing motion and calm camera perspective.
 * - Gentle mouse/scroll parallax with smooth damping (desktop only).
 * - Full prefers-reduced-motion accessibility support.
 * - Unified translucent readability overlay ensuring WCAG readability across all sections.
 * - Zero artificial 3D polygons, neon lights, floating circles, or random particles.
 */
export const LivingFarmBackground: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Scroll parallax handler (passive, throttled via RAF)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Subtle desktop mouse parallax
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch && !mediaQuery.matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        targetMouseRef.current = { x: normX * 12, y: normY * 8 }; // Max 12px horizontal, 8px vertical
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Smooth dampening loop for mouse parallax
      const animateParallax = () => {
        const factor = 0.04; // Gentle smoothing
        currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * factor;
        currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * factor;

        setMouseOffset({
          x: currentMouseRef.current.x,
          y: currentMouseRef.current.y,
        });

        rafRef.current = requestAnimationFrame(animateParallax);
      };

      rafRef.current = requestAnimationFrame(animateParallax);

      return () => {
        mediaQuery.removeEventListener('change', handleMotionChange);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Calculate subtle scroll offset (capped to prevent extreme translation)
  const scrollOffset = prefersReducedMotion ? 0 : Math.min(scrollY * 0.05, 80);

  return (
    <div
      id="living-farm-background-container"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Real Photographic Agriculture Landscape Layer */}
      <div
        className={`absolute inset-[-4%] w-[108%] h-[108%] transition-transform ease-out will-change-transform ${
          prefersReducedMotion ? '' : 'animate-farm-breathe'
        }`}
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${mouseOffset.x}px, ${mouseOffset.y - scrollOffset}px, 0)`,
          transitionDuration: '100ms',
        }}
      >
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/indian_farm_landscape_mobile.webp"
            type="image/webp"
          />
          <source
            srcSet="/images/indian_farm_landscape.webp"
            type="image/webp"
          />
          <img
            src="/images/indian_farm_landscape.jpg"
            alt=""
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* 2. Natural Sunlight Golden Hour Breathing Shift */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFF4DC]/20 to-[#E9AF46]/15 mix-blend-soft-light pointer-events-none ${
          prefersReducedMotion ? 'opacity-30' : 'animate-sunlight-shift'
        }`}
      />

      {/* 3. Subtle Atmospheric Rural Haze Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#FBFAF4]/35 via-transparent to-[#26332B]/10 pointer-events-none"
      />

      {/* 4. Unified Transparent Readability Glaze */}
      {/* Ensures text and interactive elements remain 100% crisp and readable across every section */}
      <div
        className="absolute inset-0 bg-[#FBFAF4]/75 backdrop-blur-[1px] pointer-events-none"
      />

      {/* 5. Subtle Top & Bottom Vignette for Cinematic Frame */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#FBFAF4]/60 via-transparent to-[#FBFAF4]/70 pointer-events-none"
      />
    </div>
  );
};
