"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SplitTextWords = ({ text }: { text: string }) => {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.15em] pb-2">
          <span className="word-inner inline-block translate-y-[120%] pr-[0.15em]">{word}</span>
        </span>
      ))}
    </>
  );
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    // 1. Initial Timeline Sequence
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Background scale in
    tl.fromTo(
      bgRef.current,
      { scale: 1.1, filter: "brightness(0.5)" },
      { scale: 1, filter: "brightness(0.7)", duration: 2.5, ease: "power2.out" },
      0
    );

    // Title reveal (word by word)
    const words = titleRef.current?.querySelectorAll(".word-inner");
    if (words) {
      tl.to(
        words,
        { y: "0%", duration: 1.2, stagger: 0.1, ease: "expo.out" },
        0.5 // Start slightly after bg
      );
    }

    // Description fade in
    tl.fromTo(
      descRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 1 },
      1.2
    );

    // Buttons appear
    tl.fromTo(
      buttonsRef.current?.children || [],
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
      1.5
    );

    // Scroll indicator animate
    tl.fromTo(
      scrollIndicatorRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1 },
      2
    );

    // Bouncing animation for scroll indicator
    const dot = scrollIndicatorRef.current?.querySelector(".dot");
    if (dot) {
      gsap.to(dot, {
        y: 12,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // 2. Parallax on Scroll
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image & Overlay */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 origin-center bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-20">
        <h1 
          ref={titleRef} 
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.1] max-w-5xl mb-6"
        >
          <SplitTextWords text="Defining the future of luxury living." />
        </h1>
        
        <p 
          ref={descRef} 
          className="text-lg md:text-xl text-white/80 max-w-2xl font-light tracking-wide mb-10 invisible"
        >
          Discover curated architectural masterpieces and exclusive properties designed for the extraordinary.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center gap-4 invisible">
          <button className="bg-white text-black px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white/90 transition-colors">
            Explore Portfolio
          </button>
          <button className="glass text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white/10 transition-colors border border-white/20 backdrop-blur-md">
            Schedule Viewing
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 invisible"
      >
        <span className="text-white/60 text-xs uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div className="dot absolute top-0 left-0 w-full h-1/3 bg-white" />
        </div>
      </div>
    </section>
  );
}
