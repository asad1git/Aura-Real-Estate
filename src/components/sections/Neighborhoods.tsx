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

const NEIGHBORHOODS = [
  {
    id: "n1",
    name: "Beverly Hills",
    description: "The epitome of global luxury and legendary estates.",
    propertiesCount: 42,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "n2",
    name: "Malibu",
    description: "Exclusive oceanfront sanctuaries and architectural marvels.",
    propertiesCount: 28,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  },
  {
    id: "n3",
    name: "Bel Air",
    description: "Private, gated compounds surrounded by lush landscapes.",
    propertiesCount: 35,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
  }
];

export function Neighborhoods() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGsapContext(() => {
    if (!sectionRef.current) return;

    // Header reveal
    gsap.fromTo(
      headerRef.current?.children || [],
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        }
      }
    );

    // Stagger reveal the large landscape cards
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 50, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      );
    });

  }, []);

  return (
    <section 
      id="neighborhoods"
      ref={sectionRef} 
      className="py-32 px-6 md:px-12 bg-secondary w-full"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="flex flex-col items-center text-center mb-20">
          <span className="text-muted-foreground uppercase tracking-widest text-sm font-medium mb-4 block">
            Locations
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-foreground tracking-tight mb-6">
            Curated Neighborhoods
          </h2>
          <p className="text-lg text-secondary-foreground/70 font-light max-w-2xl">
            Explore the most sought-after enclaves. From the coastal cliffs to the hidden canyons, discover where you belong.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {NEIGHBORHOODS.map((neighborhood, index) => (
            <div 
              key={neighborhood.id} 
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden rounded-sm cursor-pointer"
            >
              <Image
                src={neighborhood.image}
                alt={neighborhood.name}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
              
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
              
              {/* Hover sweep overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10 text-white">
                <div className="overflow-hidden mb-2">
                  <h3 className="text-3xl md:text-5xl font-serif tracking-tight translate-y-[10px] opacity-90 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                    {neighborhood.name}
                  </h3>
                </div>
                
                <div className="overflow-hidden">
                  <p className="text-white/80 text-lg md:text-xl font-light max-w-xl translate-y-[20px] opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                    {neighborhood.description}
                  </p>
                </div>

                <div className="absolute top-8 right-8 md:top-12 md:right-12">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm tracking-widest uppercase px-4 py-2 rounded-full font-medium">
                    {neighborhood.propertiesCount} Active Listings
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
