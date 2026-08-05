"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { PropertyCard, type Property } from "@/components/ui/PropertyCard";
import { Navbar } from "@/components/layout/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Extended Mock Database
const ALL_PROPERTIES: Property[] = [
  { id: "1", title: "The Glass Pavilion", location: "Beverly Hills, CA", price: "$24,500,000", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop", beds: 5, baths: 7, sqft: 8500 },
  { id: "2", title: "Oceanfront Estate", location: "Malibu, CA", price: "$32,000,000", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop", beds: 6, baths: 8, sqft: 10200 },
  { id: "3", title: "Modernist Retreat", location: "Aspen, CO", price: "$18,900,000", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop", beds: 4, baths: 5, sqft: 6400 },
  { id: "4", title: "Penthouse Collection", location: "New York, NY", price: "$45,000,000", imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop", beds: 4, baths: 4, sqft: 5200 },
  { id: "5", title: "Desert Sanctuary", location: "Palm Springs, CA", price: "$12,500,000", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", beds: 4, baths: 5, sqft: 4800 },
  { id: "6", title: "Alpine Chalet", location: "Swiss Alps", price: "$28,000,000", imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2134&auto=format&fit=crop", beds: 7, baths: 9, sqft: 12000 },
];

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-desc" | "price-asc" | "newest">("newest");
  const [activeLocation, setActiveLocation] = useState<string>("All");

  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Derived state for locations filter
  const locations = useMemo(() => {
    const locs = Array.from(new Set(ALL_PROPERTIES.map(p => p.location.split(",")[0])));
    return ["All", ...locs];
  }, []);

  // Filtering & Sorting Logic
  const filteredProperties = useMemo(() => {
    let result = [...ALL_PROPERTIES];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      );
    }

    // Location
    if (activeLocation !== "All") {
      result = result.filter(p => p.location.includes(activeLocation));
    }

    // Sort
    result.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
      
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "price-asc") return priceA - priceB;
      return 0; // "newest" mock (default order)
    });

    return result;
  }, [searchQuery, sortBy, activeLocation]);

  // Entrance Animations
  useGsapContext(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      headerRef.current?.children || [],
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
      0.2
    );

    tl.fromTo(
      filterRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
      0.6
    );

    // Initial grid reveal
    gsap.fromTo(
      cardsRef.current,
      { autoAlpha: 0, y: 50, scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  // Animation on Filter Change
  useEffect(() => {
    if (!gridRef.current) return;
    
    // Simple fade in/up on the new rendered DOM elements
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".filtered-card",
        { autoAlpha: 0, y: 20, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [filteredProperties]);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-40 pb-12 px-6 md:px-12 w-full">
        <div ref={headerRef} className="max-w-7xl mx-auto flex flex-col">
          <span className="text-muted-foreground uppercase tracking-widest text-sm font-medium mb-4">
            Curated Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-foreground tracking-tight mb-6">
            The Portfolio
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            Explore our exclusive collection of the world's most extraordinary homes, defined by exceptional architecture and uncompromising quality.
          </p>
        </div>
      </section>

      {/* Filter Bar (Sticky) */}
      <section 
        ref={filterRef}
        className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-y border-border py-4 px-6 md:px-12 w-full mb-12 invisible"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">
          
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 pl-8 pr-4 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <div className="flex w-full md:w-auto items-center gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {/* Location Pills */}
            <div className="flex gap-2">
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setActiveLocation(loc)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors border",
                    activeLocation === loc 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-transparent text-foreground border-border hover:border-primary"
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="text-muted-foreground w-4 h-4" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-transparent text-sm font-medium text-foreground py-2 pr-6 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
              </select>
              <ChevronDown className="absolute right-0 pointer-events-none text-muted-foreground w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Property Grid */}
      <section className="px-6 md:px-12 pb-32 w-full flex-grow">
        <div ref={gridRef} className="max-w-7xl mx-auto">
          {filteredProperties.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-serif text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveLocation("All"); }}
                className="mt-6 border-b border-foreground pb-1 text-sm font-medium tracking-widest uppercase hover:text-muted-foreground transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="filtered-card invisible" // Invisible class prevents FOUC before GSAP takes over
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
