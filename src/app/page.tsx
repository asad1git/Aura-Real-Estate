import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";

// Lazy load below-the-fold sections for maximum initial performance
const About = dynamic(() => import("@/components/sections/About").then(mod => mod.About), { ssr: true });
const Storytelling = dynamic(() => import("@/components/sections/Storytelling").then(mod => mod.Storytelling), { ssr: true });
const FeaturedProperties = dynamic(() => import("@/components/sections/FeaturedProperties").then(mod => mod.FeaturedProperties), { ssr: true });
const HorizontalShowcase = dynamic(() => import("@/components/sections/HorizontalShowcase").then(mod => mod.HorizontalShowcase), { ssr: true });
const Neighborhoods = dynamic(() => import("@/components/sections/Neighborhoods").then(mod => mod.Neighborhoods), { ssr: true });
const Gallery = dynamic(() => import("@/components/sections/Gallery").then(mod => mod.Gallery), { ssr: true });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(mod => mod.Testimonials), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact").then(mod => mod.Contact), { ssr: true });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <About />
      <FeaturedProperties />
      
      <div id="architecture">
        <Storytelling />
      </div>
      
      <Neighborhoods />
      
      <div id="journal">
        <HorizontalShowcase />
      </div>
      
      <Gallery />
      <Testimonials />
      <Contact />
    </main>
  );
}
