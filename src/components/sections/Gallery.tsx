"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { X, Expand } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GALLERY_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    alt: "Luxury living room with ocean view",
    className: "aspect-[4/3]",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    alt: "Modern architecture exterior",
    className: "aspect-[3/4]",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
    alt: "Minimalist kitchen design",
    className: "aspect-square",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
    alt: "Elegant master bedroom",
    className: "aspect-[3/4]",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    alt: "Beachfront estate",
    className: "aspect-[16/9]",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1935&auto=format&fit=crop",
    alt: "Architectural staircase",
    className: "aspect-[3/4]",
  },
];

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!sectionRef.current) return;

    const items = gsap.utils.toArray<HTMLElement>(".gallery-item");
    
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 50, scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <section ref={sectionRef} className="py-32 px-6 md:px-12 bg-background w-full">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-muted-foreground uppercase tracking-widest text-sm font-medium mb-4 block">
              The Details
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight mb-4">
              A Closer Look
            </h2>
          </div>

          {/* CSS Columns Masonry */}
          <div ref={galleryRef} className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {GALLERY_IMAGES.map((img) => (
              <div 
                key={img.id} 
                className="gallery-item group relative overflow-hidden rounded-sm cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(img.src)}
              >
                <div className={cn("relative w-full overflow-hidden", img.className)}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <Expand className="text-white w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <div 
            className="relative w-full max-w-6xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Lightbox image"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
