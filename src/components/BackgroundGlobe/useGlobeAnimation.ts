import { useState, useEffect, useRef } from 'react';

interface GlobeAnimationOptions {
  rotationSpeed?: number; // degrees per second
  pauseOnHover?: boolean;
  respectMotionPreference?: boolean;
}

export const useGlobeAnimation = ({
  rotationSpeed = 4, // 4 degrees per second = 90 seconds for full rotation
  pauseOnHover = true,
  respectMotionPreference = true
}: GlobeAnimationOptions = {}) => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (!respectMotionPreference) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [respectMotionPreference]);

  // Animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = (currentTime: number) => {
      if (lastTimeRef.current !== undefined && !isPaused) {
        const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
        setRotation(prev => (prev + rotationSpeed * deltaTime) % 360);
      }
      
      lastTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotationSpeed, isPaused, prefersReducedMotion]);

  // Hover handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
      // Reset the time reference to prevent jumps
      lastTimeRef.current = undefined;
    }
  };

  // Manual controls
  const pause = () => setIsPaused(true);
  const resume = () => {
    setIsPaused(false);
    lastTimeRef.current = undefined;
  };
  const reset = () => setRotation(0);

  // CSS transform for the globe
  const globeStyle = {
    transform: prefersReducedMotion ? 'none' : `rotate(${rotation}deg)`,
    transition: prefersReducedMotion ? 'none' : 'none', // Smooth animation via requestAnimationFrame
  };

  // Container props for hover handling
  const containerProps = pauseOnHover ? {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ref: containerRef,
  } : { ref: containerRef };

  return {
    rotation,
    isPaused,
    prefersReducedMotion,
    globeStyle,
    containerProps,
    controls: {
      pause,
      resume,
      reset,
    },
  };
}; 