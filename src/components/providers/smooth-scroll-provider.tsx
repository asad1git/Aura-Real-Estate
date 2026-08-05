"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger to avoid warnings
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Perfect synchronization between Lenis and GSAP ScrollTrigger
    // Disable lag smoothing in GSAP to prevent any jitter when scrolling
    gsap.ticker.lagSmoothing(0);
    
    // Update ScrollTrigger whenever GSAP updates
    const updateScrollTrigger = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(updateScrollTrigger);

    return () => {
      gsap.ticker.remove(updateScrollTrigger);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.05,
        duration: 1.2,
        smoothWheel: true,
        // Support for reduced motion preferences
        syncTouch: true,
      }}
      autoRaf={false} // Disable auto-raf so GSAP ticker drives it for perfect sync
    >
      {/* We need a nested component to listen to scroll because useLenis needs ReactLenis context */}
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

// Inner component to wire Lenis scroll to ScrollTrigger
function ScrollTriggerSync() {
  useLenis((lenis) => {
    ScrollTrigger.update();
  });
  return null;
}
