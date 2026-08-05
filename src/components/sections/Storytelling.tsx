"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";

export function Storytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useGsapContext(() => {
    if (!sectionRef.current || !containerRef.current) return;

    // Master ScrollTrigger timeline for the pinned section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%", // Scroll 3x the screen height
        pin: true,
        scrub: 1, // Smooth scrubbing with 1 second lag
      },
    });

    // 1. Fade in first large typography
    tl.fromTo(
      text1Ref.current,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 1 }
    );

    // 2. Fade out first, fade in second, change background color
    tl.to(sectionRef.current, { backgroundColor: "var(--color-secondary)", duration: 1 }, "+=0.5")
      .to(text1Ref.current, { autoAlpha: 0, y: -50, duration: 1 }, "<")
      .fromTo(text2Ref.current, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, "<0.5");

    // 3. Image reveals with clip-path mask
    tl.fromTo(
      imageRef.current,
      { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.5, ease: "power2.inOut" },
      "+=0.5"
    );

    // 4. Fade out second text, fade in third text and paragraph
    tl.to(text2Ref.current, { autoAlpha: 0, duration: 1 }, "+=0.5")
      .fromTo(text3Ref.current, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, "<")
      .fromTo(pRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 }, "<0.3");

  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center transition-colors duration-300"
    >
      <div 
        ref={containerRef} 
        className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center"
      >
        {/* Absolute positioned huge typography for cross-fading */}
        <h2 
          ref={text1Ref} 
          className="absolute text-5xl md:text-7xl lg:text-9xl font-serif text-foreground text-center tracking-tighter invisible"
        >
          Spaces that inspire.
        </h2>

        <h2 
          ref={text2Ref} 
          className="absolute text-5xl md:text-7xl lg:text-9xl font-serif text-foreground text-center tracking-tighter invisible z-10"
        >
          Form meets function.
        </h2>

        {/* Image Mask Reveal */}
        <div 
          ref={imageRef} 
          className="absolute inset-0 z-0 m-auto w-[90%] md:w-[60%] h-[50vh] md:h-[60vh] overflow-hidden rounded-2xl invisible"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2127&auto=format&fit=crop')" }}
          />
        </div>

        {/* Final text and paragraph overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <h2 
            ref={text3Ref} 
            className="text-4xl md:text-6xl lg:text-8xl font-serif text-foreground text-center tracking-tighter invisible"
          >
            Timeless Elegance.
          </h2>
          <p 
            ref={pRef}
            className="mt-6 text-lg md:text-2xl text-foreground/90 max-w-2xl text-center font-light invisible"
          >
            Every curve, every material, meticulously selected to create an environment that transcends ordinary living.
          </p>
        </div>
      </div>
    </section>
  );
}
