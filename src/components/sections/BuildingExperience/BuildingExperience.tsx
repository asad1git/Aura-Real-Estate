"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { buildingStore } from "./store";
import { BuildingCanvas } from "./BuildingCanvas";
import { OverlayText } from "./OverlayText";

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

    // We animate the proxy object's progress from 0 to 1 over the scroll distance
    gsap.to(buildingStore, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%", // 4x screen height for the scroll experience
        pin: true,
        scrub: 1, // Smooth scrubbing
      },
    });

  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden">
      {/* 3D Canvas Context */}
      <div className="absolute inset-0 z-0">
        <BuildingCanvas />
      </div>

      {/* HTML DOM Overlay Context */}
      <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
        <OverlayText />
      </div>
    </section>
  );
}
