"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { PropertyCard, type Property } from "@/components/ui/PropertyCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURED_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "The Glass Pavilion",
    location: "Beverly Hills, CA",
    price: "$24,500,000",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
    beds: 5,
    baths: 7,
    sqft: 8500,
  },
  {
    id: "2",
    title: "Oceanfront Estate",
    location: "Malibu, CA",
    price: "$32,000,000",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    beds: 6,
    baths: 8,
    sqft: 10200,
  },
  {
    id: "3",
    title: "Modernist Retreat",
    location: "Aspen, CO",
    price: "$18,900,000",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    beds: 4,
    baths: 5,
    sqft: 6400,
  }
];

export function FeaturedProperties() {
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
          start: "top 80%",
        }
      }
    );

    // Cards stagger reveal with clipping mask for premium effect
    gsap.fromTo(
      cardsRef.current,
      { 
        autoAlpha: 0, 
        y: 100,
        clipPath: "inset(20% 0% 0% 0%)"
      },
      {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        }
      }
    );
  }, []);

  return (
    <section 
      id="properties"
      ref={sectionRef} 
      className="py-32 px-6 md:px-12 bg-background w-full"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-foreground">
              Exclusive Portfolio
            </h2>
            <p className="text-muted-foreground text-lg font-light tracking-wide">
              A curated selection of the world's most extraordinary homes, defined by exceptional architecture and uncompromising quality.
            </p>
          </div>
          <button className="hidden md:block border-b border-foreground pb-1 text-sm font-medium tracking-widest uppercase hover:text-muted-foreground hover:border-muted-foreground transition-colors">
            View All Properties
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {FEATURED_PROPERTIES.map((property, index) => (
            <div key={property.id} ref={(el) => { cardsRef.current[index] = el; }}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center md:hidden">
          <button className="border-b border-foreground pb-1 text-sm font-medium tracking-widest uppercase hover:text-muted-foreground hover:border-muted-foreground transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
}
