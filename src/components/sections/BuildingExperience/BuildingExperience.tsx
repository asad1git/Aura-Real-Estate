"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { buildingStore } from "./store";
import { BuildingCanvas } from "./BuildingCanvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BuildingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!sectionRef.current) return;

    // Reset progress on mount just in case of hot reloads
    buildingStore.progress = 0;

    // Single unified trigger that pins the section and drives the animation perfectly in sync.
    // We use scrub: 0.5 to keep it smooth without causing a massive startup lag.
    gsap.to(buildingStore, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%", 
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true, // Forces recalculation on layout shifts
      },
    });

    // CRITICAL FIX: Next.js lazy-loads images in the sections above (FeaturedProperties, About).
    // This causes the DOM height to change AFTER GSAP has calculated the trigger start points.
    // By forcing a refresh after the initial render, we guarantee the math is 100% accurate 
    // and the animation starts exactly at 0.0 progress.
    const stRefresh = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    return () => clearTimeout(stRefresh);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden">
      {/* 3D Canvas Context */}
      <div className="absolute inset-0 z-0">
        <BuildingCanvas />
      </div>
    </section>
  );
}
