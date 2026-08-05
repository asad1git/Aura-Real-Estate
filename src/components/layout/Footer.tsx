"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FOOTER_LINKS = {
  properties: [
    { label: "Los Angeles", href: "#" },
    { label: "New York", href: "#" },
    { label: "London", href: "#" },
    { label: "Dubai", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Advisors", href: "#" },
    { label: "Journal", href: "#" },
    { label: "Careers", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Settings", href: "#" },
  ]
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!footerRef.current || !contentRef.current) return;

    // Elegant slide-up reveal when the footer enters the viewport
    gsap.fromTo(
      contentRef.current.children,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        }
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="bg-primary text-primary-foreground py-20 px-6 md:px-12 w-full border-t border-border/10 overflow-hidden">
      <div ref={contentRef} className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Top Section: Newsletter & Brand */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-primary-foreground/10 pb-20">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-6">
              Subscribe to the Journal
            </h2>
            <p className="text-primary-foreground/70 font-light mb-8">
              Receive exclusive insights into the global luxury real estate market and architectural marvels.
            </p>
            <form className="relative flex items-center group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-primary-foreground/30 py-4 pr-12 text-primary-foreground focus:outline-none focus:border-primary-foreground transition-colors placeholder:text-primary-foreground/30 font-light"
              />
              <button 
                type="submit" 
                className="absolute right-0 text-primary-foreground/50 group-hover:text-primary-foreground transition-colors hover:-translate-y-1 duration-300"
                aria-label="Subscribe"
              >
                <ArrowRight size={24} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          <div className="flex flex-col lg:items-end text-left lg:text-right">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-6">
              Aura <span className="text-primary-foreground/50 text-2xl tracking-widest uppercase font-sans font-medium block mt-2">Real Estate</span>
            </h1>
            <p className="text-primary-foreground/60 font-light max-w-xs">
              420 Luxury Lane, Suite 100<br />
              Beverly Hills, CA 90210
            </p>
            <a href="mailto:contact@aurarealestate.com" className="mt-4 text-primary-foreground hover:text-primary-foreground/70 transition-colors font-medium border-b border-primary-foreground/30 hover:border-primary-foreground pb-1 inline-block">
              contact@aurarealestate.com
            </a>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-primary-foreground/10 pb-20">
          <div className="flex flex-col gap-6">
            <h4 className="text-sm tracking-widest uppercase font-medium text-primary-foreground/50">Properties</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.properties.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-primary-foreground hover:text-primary-foreground/70 transition-colors font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-sm tracking-widest uppercase font-medium text-primary-foreground/50">Company</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-primary-foreground hover:text-primary-foreground/70 transition-colors font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-sm tracking-widest uppercase font-medium text-primary-foreground/50">Legal</h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-primary-foreground hover:text-primary-foreground/70 transition-colors font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="text-sm tracking-widest uppercase font-medium text-primary-foreground/50">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/40 font-light">
          <p>&copy; {new Date().getFullYear()} Aura Real Estate. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with precision.</p>
        </div>
      </div>
    </footer>
  );
}
