"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { label: "Billion Sold", value: 2.4, prefix: "$", suffix: "B+" },
  { label: "Global Markets", value: 12, prefix: "", suffix: "" },
  { label: "Years of Excellence", value: 25, prefix: "", suffix: "+" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statValuesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const collageRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!sectionRef.current) return;

    // 1. Text Reveal Timeline
    gsap.fromTo(
      textRef.current?.children || [],
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        }
      }
    );

    // 2. Statistics Counter Animation
    statsRef.current.forEach((stat, index) => {
      const targetValue = STATS[index].value;
      const valueElement = statValuesRef.current[index];
      
      if (!stat || !valueElement) return;

      gsap.fromTo(
        stat,
        { autoAlpha: 0, scale: 0.9 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
          }
        }
      );

      // Counter animation logic
      const counter = { val: 0 };
      const isDecimal = targetValue % 1 !== 0;

      gsap.to(counter, {
        val: targetValue,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 85%",
        },
        onUpdate: () => {
          if (valueElement) {
            valueElement.innerText = isDecimal 
              ? counter.val.toFixed(1) 
              : Math.round(counter.val).toString();
          }
        }
      });
    });

    // 3. Image Collage Stagger Reveal
    gsap.fromTo(
      collageRef.current?.children || [],
      { autoAlpha: 0, y: 100, clipPath: "inset(20% 0% 0% 0%)" },
      {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: collageRef.current,
          start: "top 70%",
        }
      }
    );

  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-12 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
        
        {/* Left Column: Editorial Text & Stats */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div ref={textRef} className="mb-16">
            <span className="text-muted-foreground uppercase tracking-widest text-sm font-medium mb-6 block">
              The Agency
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground tracking-tight leading-[1.1] mb-8">
              Redefining the <br />art of luxury real estate.
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg">
              Since 1999, we have represented the most significant properties in the world. Our approach blends absolute discretion with cutting-edge global marketing, ensuring our clients receive an unparalleled level of service.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-border pt-12">
            {STATS.map((stat, index) => (
              <div 
                key={stat.label} 
                ref={(el) => { statsRef.current[index] = el; }}
                className="flex flex-col"
              >
                <div className="text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-2 flex items-baseline">
                  {stat.prefix && <span className="text-2xl mr-1">{stat.prefix}</span>}
                  <span ref={(el) => { statValuesRef.current[index] = el; }}>0</span>
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Image Collage */}
        <div ref={collageRef} className="w-full lg:w-1/2 grid grid-cols-2 gap-4 h-[600px] relative">
          <div className="col-span-1 h-full pt-12 relative overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1935&auto=format&fit=crop"
              alt="Architecture Detail"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="col-span-1 h-full pb-12 relative overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              alt="Office Space"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          </div>
          
          {/* Decorative floating element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-6 rounded-full border border-border shadow-lg z-10 hidden sm:block">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 2L2 22l10-5 10 5L12 2z"/>
            </svg>
          </div>
        </div>
        
      </div>
    </section>
  );
}
