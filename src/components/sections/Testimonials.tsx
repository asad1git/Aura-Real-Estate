"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The Agency's absolute discretion and market knowledge allowed us to acquire a truly generational asset. Their service is unmatched in the luxury space.",
    author: "Elena Rostova",
    title: "International Investor",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
  },
  {
    id: 2,
    quote: "Every detail was managed with precision. From the initial private viewing to the final closing, the experience was seamless and distinctly premium.",
    author: "Jameson Sterling",
    title: "Tech Entrepreneur",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    quote: "We trusted them with selling our historic compound. Their global marketing reach and network found the perfect buyer within weeks, not months.",
    author: "Sarah & David Chen",
    title: "Philanthropists",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  // GSAP Entrance
  useGsapContext(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  // GSAP Quote Animation on Slide Change
  useEffect(() => {
    if (!quoteRef.current) return;
    
    // Quick fade out/in effect for the active quote text to make the transition feel dynamic
    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  }, []);

  // Autoplay Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, nextSlide]);

  return (
    <section 
      ref={sectionRef} 
      className="py-32 px-6 md:px-12 bg-white w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <span className="text-muted-foreground uppercase tracking-widest text-sm font-medium mb-12 block text-center">
          Client Relationships
        </span>

        <div 
          className="relative w-full max-w-4xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Slider Track */}
          {/* Removed fixed height (h-[450px]), letting the tallest item dictate the height naturally */}
          <div className="overflow-hidden relative w-full pb-4">
            <div 
              ref={sliderRef}
              className="flex w-full items-stretch transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center px-4 md:px-12 py-4"
                >
                  <Quote className="text-border mb-6 w-12 h-12 rotate-180 opacity-50 shrink-0" />
                  
                  <blockquote 
                    ref={currentIndex === testimonial.id - 1 ? quoteRef : null}
                    className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground tracking-tight leading-relaxed mb-8"
                  >
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4 mt-auto shrink-0">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden grayscale shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-foreground tracking-wide">{testimonial.author}</span>
                      <span className="text-sm text-muted-foreground font-light">{testimonial.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button 
              onClick={() => {
                setIsAutoPlaying(false);
                prevSlide();
              }}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentIndex === idx ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={() => {
                setIsAutoPlaying(false);
                nextSlide();
              }}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
