"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGsapContext } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Properties", href: "#properties" },
  { label: "Architecture", href: "#architecture" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Handle scroll for shrink and blur
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Active section highlighting logic
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let currentSection = "";
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations for Navbar state
  useGsapContext(() => {
    if (!headerRef.current) return;

    if (isScrolled) {
      gsap.to(headerRef.current, {
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        backgroundColor: "rgba(var(--background-rgb, 253, 252, 251), 0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(headerRef.current, {
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        borderBottom: "1px solid transparent",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [isScrolled]);

  // Mobile Menu Animation
  useGsapContext(() => {
    if (!mobileMenuRef.current) return;

    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "expo.out",
      });
      // Stagger links
      gsap.fromTo(
        ".mobile-link",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.1 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        autoAlpha: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isMobileMenuOpen]);

  // Link Hover animations
  const handleMouseEnter = (index: number) => {
    const el = linksRef.current[index];
    if (el) {
      gsap.to(el.querySelector('.indicator'), {
        scaleX: 1,
        transformOrigin: "left",
        duration: 0.3,
        ease: "power3.out"
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const el = linksRef.current[index];
    if (el) {
      gsap.to(el.querySelector('.indicator'), {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.3,
        ease: "power3.in"
      });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 w-full transition-colors"
      >
        <div className="flex items-center">
          <Link href="/" className="text-xl font-serif tracking-tight font-medium" aria-label="Home">
            Aura <span className="text-muted-foreground font-sans text-sm ml-1 uppercase tracking-widest">Real Estate</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <Link
                key={link.label}
                href={link.href}
                ref={(el) => { linksRef.current[i] = el; }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                className={cn(
                  "relative text-sm font-medium tracking-wide transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                <span 
                  className={cn(
                    "indicator absolute -bottom-1 left-0 h-[1px] w-full bg-primary origin-left scale-x-0",
                    isActive && "scale-x-100"
                  )} 
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex">
          <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors">
            Inquire
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative z-50 p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center invisible opacity-0 md:hidden"
      >
        <nav className="flex flex-col items-center gap-8 text-center" aria-label="Mobile Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "mobile-link font-serif text-4xl tracking-tight transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <button className="mobile-link mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium transition-colors">
            Inquire
          </button>
        </nav>
      </div>
    </>
  );
}
