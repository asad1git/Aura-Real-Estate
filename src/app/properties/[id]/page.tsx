"use client";

import { use, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Check, Download, Mail, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard, type Property } from "@/components/ui/PropertyCard";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Extended Mock Data for Detail View
const MOCK_PROPERTY = {
  id: "1",
  title: "The Glass Pavilion",
  location: "Beverly Hills, CA",
  price: "$24,500,000",
  description: "A monumental achievement in residential architecture. Set on a promontory with sweeping views from downtown to the ocean, this modernist masterpiece offers an unparalleled lifestyle of privacy and prestige. Featuring seamless indoor-outdoor living, curated materials from around the globe, and state-of-the-art smart home integration.",
  beds: 5,
  baths: 7,
  sqft: 8500,
  lotSize: "1.2 Acres",
  yearBuilt: 2023,
  amenities: [
    "Infinity Edge Pool", "Home Theater", "Wine Cellar", 
    "Wellness Center & Spa", "Tennis Court", "Smart Home Automation",
    "Gourmet Chef's Kitchen", "Private Gated Driveway"
  ],
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  ],
  agent: {
    name: "Alexander Vance",
    title: "Senior Partner",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    phone: "+1 (310) 555-0199",
    email: "alexander@aurarealestate.com"
  }
};

const SIMILAR_PROPERTIES: Property[] = [
  { id: "2", title: "Oceanfront Estate", location: "Malibu, CA", price: "$32,000,000", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop", beds: 6, baths: 8, sqft: 10200 },
  { id: "5", title: "Desert Sanctuary", location: "Palm Springs, CA", price: "$12,500,000", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", beds: 4, baths: 5, sqft: 4800 },
];

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React 19 unwrapping for params
  const { id } = use(params);
  const property = MOCK_PROPERTY; // In reality, fetch based on ID

  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scroll Animations
  useGsapContext(() => {
    // 1. Initial Reveal
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current?.children || [],
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
      0.2
    );

    tl.fromTo(
      galleryRef.current?.children || [],
      { autoAlpha: 0, scale: 0.95 },
      { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
      0.5
    );

    // 2. Scroll Reveals
    const animateSection = (selector: string) => {
      gsap.utils.toArray(selector).forEach((el: any) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });
    };

    animateSection(".reveal-up");
  }, []);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pb-32">
      <Navbar />
      
      {/* Property Header */}
      <section className="pt-32 px-6 md:px-12 w-full max-w-7xl mx-auto">
        <div ref={headerRef} className="flex flex-col">
          <Link href="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm uppercase tracking-widest font-medium mb-8 w-max">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-4">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground font-light text-lg">
                <MapPin size={18} /> {property.location}
              </div>
            </div>
            <div className="text-3xl md:text-5xl font-medium tracking-tight">
              {property.price}
            </div>
          </div>
        </div>

        {/* Hero Gallery (Bento Grid) */}
        <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[60vh] md:h-[70vh] mb-16">
          <div className="md:col-span-3 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer">
            <Image 
              src={property.images[0]} 
              alt="Main Exterior" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          <div className="hidden md:block relative rounded-xl overflow-hidden group cursor-pointer">
            <Image src={property.images[1]} alt="Interior 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="hidden md:block relative rounded-xl overflow-hidden group cursor-pointer">
            <Image src={property.images[2]} alt="Interior 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Details (Left 2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-16">
            
            {/* Quick Stats */}
            <div ref={statsRef} className="reveal-up grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border">
              <div className="flex flex-col gap-2">
                <BedDouble className="text-muted-foreground mb-2" size={24} />
                <span className="text-2xl font-serif">{property.beds}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Bedrooms</span>
              </div>
              <div className="flex flex-col gap-2">
                <Bath className="text-muted-foreground mb-2" size={24} />
                <span className="text-2xl font-serif">{property.baths}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Bathrooms</span>
              </div>
              <div className="flex flex-col gap-2">
                <Maximize className="text-muted-foreground mb-2" size={24} />
                <span className="text-2xl font-serif">{property.sqft.toLocaleString()}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Square Feet</span>
              </div>
              <div className="flex flex-col gap-2">
                <MapPin className="text-muted-foreground mb-2" size={24} />
                <span className="text-2xl font-serif">{property.lotSize}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Lot Size</span>
              </div>
            </div>

            {/* Overview */}
            <div className="reveal-up flex flex-col gap-6">
              <h3 className="text-2xl font-serif">Property Overview</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="reveal-up flex flex-col gap-6">
              <h3 className="text-2xl font-serif">Amenities</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map(amenity => (
                  <li key={amenity} className="flex items-center gap-3 text-muted-foreground font-light">
                    <Check size={18} className="text-primary" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Floor Plan & Map Placeholders */}
            <div className="reveal-up flex flex-col gap-6 border-t border-border pt-16">
              <h3 className="text-2xl font-serif">Floor Plans & Documents</h3>
              <button className="flex items-center gap-4 w-max px-6 py-4 border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all rounded-full text-sm tracking-widest uppercase font-medium">
                <Download size={18} />
                Download Floor Plans (PDF)
              </button>
            </div>

            <div className="reveal-up flex flex-col gap-6 border-t border-border pt-16">
              <h3 className="text-2xl font-serif">Location</h3>
              <div className="w-full h-[400px] bg-secondary rounded-xl flex items-center justify-center border border-border">
                <p className="text-muted-foreground font-light flex items-center gap-2">
                  <MapPin /> Map Integration Placeholder
                </p>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar (Right 1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 flex flex-col gap-8">
              
              {/* Agent Profile */}
              <div className="reveal-up bg-secondary p-8 rounded-xl border border-border flex flex-col items-center text-center">
                <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4">
                  <Image src={property.agent.image} alt={property.agent.name} fill className="object-cover grayscale" />
                </div>
                <h4 className="text-xl font-serif mb-1">{property.agent.name}</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-6">
                  {property.agent.title}
                </p>
                
                <div className="flex gap-4 w-full mb-8">
                  <a href={`tel:${property.agent.phone}`} className="flex-1 flex items-center justify-center gap-2 py-3 border border-border hover:bg-foreground hover:text-background transition-colors rounded-full text-sm">
                    <Phone size={16} /> Call
                  </a>
                  <a href={`mailto:${property.agent.email}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-full text-sm">
                    <Mail size={16} /> Email
                  </a>
                </div>

                {/* Inquiry Form */}
                <form onSubmit={handleInquiry} className="w-full flex flex-col gap-4 text-left">
                  <h5 className="font-medium text-sm border-b border-border pb-2 mb-2">Request a Private Viewing</h5>
                  
                  {isSuccess ? (
                    <div className="py-8 text-center animate-in fade-in text-primary font-medium">
                      Request sent successfully.
                    </div>
                  ) : (
                    <>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Full Name" 
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm"
                      />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="Email Address" 
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm"
                      />
                      <textarea 
                        rows={3}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="I would like to schedule a viewing..." 
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none rounded-sm"
                      />
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-full text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-70"
                      >
                        {isSubmitting ? "Sending..." : "Send Request"}
                      </button>
                    </>
                  )}
                </form>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Similar Properties */}
      <section className="reveal-up pt-32 px-6 md:px-12 w-full max-w-7xl mx-auto border-t border-border mt-16">
        <h3 className="text-3xl font-serif mb-12">Similar Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SIMILAR_PROPERTIES.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

    </main>
  );
}
