"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SHOWCASE_ITEMS = [
  {
    id: "s1",
    title: "Minimalist Masterpiece",
    location: "Tokyo, Japan",
    description: "A breathtaking exercise in restraint and materiality.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "s2",
    title: "The Desert Oasis",
    location: "Palm Springs, CA",
    description: "Seamless indoor-outdoor living in the heart of the desert.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  },
  {
    id: "s3",
    title: "Alpine Sanctuary",
    location: "Swiss Alps",
    description: "Unmatched elevation and panoramic views.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2134&auto=format&fit=crop",
  },
];

export function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGsapContext(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    const panels = panelsRef.current;
    
    // Use matchMedia to only run complex animations on desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const totalScroll = `${-(panels.length - 1) * 100}vw`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${panels.length * 100}%`,
        }
      });

      tl.to(scrollContainerRef.current, {
        x: totalScroll,
        ease: "none",
      });

      panels.forEach((panel, i) => {
        if (!panel || i === 0) return;

        const imageContainer = panel.querySelector(".showcase-image");
        const textContent = panel.querySelector(".showcase-text");

        gsap.fromTo(
          imageContainer,
          { scale: 1.2, xPercent: 20 },
          {
            scale: 1,
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tl,
              start: "left right",
              end: "left center",
              scrub: true,
            }
          }
        );

        gsap.fromTo(
          textContent?.children || [],
          { autoAlpha: 0, x: 50 },
          {
            autoAlpha: 1,
            x: 0,
            stagger: 0.1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tl,
              start: "left center",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
      
      return () => {
        // Cleanup when breakpoint changes
        tl.kill();
      };
    });
    
    // Mobile animations (simple fade up)
    mm.add("(max-width: 1023px)", () => {
      panels.forEach((panel) => {
        if (!panel) return;
        
        const imageContainer = panel.querySelector(".showcase-image");
        const textContent = panel.querySelector(".showcase-text");
        
        gsap.fromTo(
          imageContainer,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
            }
          }
        );
        
        gsap.fromTo(
          textContent?.children || [],
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
            }
          }
        );
      });
    });

  }, []);

  return (
    <section ref={sectionRef} className="lg:h-screen w-full lg:overflow-hidden bg-background">
      <div 
        ref={scrollContainerRef} 
        className="flex flex-col lg:flex-row h-full w-full lg:w-[300vw]"
      >
        {SHOWCASE_ITEMS.map((item, index) => (
          <div 
            key={item.id} 
            ref={(el) => { panelsRef.current[index] = el; }}
            className="w-full lg:w-screen min-h-screen lg:h-full flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 lg:p-24 gap-8 lg:gap-12"
          >
            {/* Text Side */}
            <div className="showcase-text w-full lg:w-1/3 flex flex-col z-10 lg:pl-12 order-2 lg:order-1 mt-8 lg:mt-0">
              <span className="text-muted-foreground tracking-widest uppercase text-sm mb-2 lg:mb-4 block font-medium">
                0{index + 1} / {item.location}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-foreground tracking-tight leading-[1.1] mb-4 lg:mb-6">
                {item.title}
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground font-light max-w-md mb-6 lg:mb-8">
                {item.description}
              </p>
              <div>
                <button className="border-b border-foreground pb-1 text-sm font-medium tracking-widest uppercase hover:text-muted-foreground hover:border-muted-foreground transition-colors">
                  Explore Project
                </button>
              </div>
            </div>

            {/* Image Side */}
            <div className="w-full lg:w-2/3 h-[40vh] md:h-[50vh] lg:h-[80vh] relative overflow-hidden rounded-sm order-1 lg:order-2 mt-20 lg:mt-0">
              <div className="showcase-image w-full h-full relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
