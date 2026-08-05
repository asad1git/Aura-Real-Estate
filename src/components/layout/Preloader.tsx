"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/hooks/use-gsap";

const PRELOAD_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop"
];

export function Preloader() {
  const [isComplete, setIsComplete] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);

  useGsapContext(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        // Enable scrolling after preloader finishes
        document.body.style.overflow = "";
      }
    });

    // Lock scrolling initially
    document.body.style.overflow = "hidden";

    // Fake progress animation paired with image preloading
    const counter = { val: 0 };
    
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (percentageRef.current) {
          percentageRef.current.innerText = Math.round(counter.val).toString();
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${counter.val}%`;
        }
      }
    })
    // Animate logo text
    .fromTo(
      logoTextRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=1" // Overlap with the end of the progress bar
    )
    // Slide up and fade out the preloader
    .to(
      containerRef.current,
      { 
        yPercent: -100, 
        duration: 1.2, 
        ease: "power4.inOut",
        delay: 0.5 
      }
    );
  }, []);

  // Preload Images in background
  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* Logo Animation */}
        <div ref={logoTextRef} className="invisible flex flex-col items-center mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
            Aura <span className="text-white/50 text-xl tracking-widest uppercase font-sans font-medium block mt-2">Real Estate</span>
          </h1>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-12 w-full max-w-sm px-6 mx-auto flex flex-col gap-4">
        <div className="flex justify-between items-center text-xs tracking-widest font-medium text-white/50 uppercase">
          <span>Loading Experience</span>
          <span><span ref={percentageRef}>0</span>%</span>
        </div>
        <div className="w-full h-[2px] bg-white/20 relative overflow-hidden">
          <div 
            ref={progressBarRef}
            className="absolute top-0 left-0 h-full bg-white w-0"
          />
        </div>
      </div>
    </div>
  );
}
