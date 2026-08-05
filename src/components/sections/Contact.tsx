"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);

  const [formData, setFormData] = useState({ name: "", email: "", inquiry: "" });
  const [errors, setErrors] = useState({ name: "", email: "", inquiry: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Entrance Animation
  useGsapContext(() => {
    if (!sectionRef.current || !cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { autoAlpha: 0, y: 100, scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  // Magnetic Button Effect
  useGsapContext(() => {
    const button = buttonRef.current;
    const text = buttonTextRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      // Calculate mouse position relative to center of button
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Move button container slightly
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.8,
        ease: "power3.out",
      });

      // Move text slightly more for parallax
      gsap.to(text, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
      gsap.to(text, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", inquiry: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formData.inquiry.trim()) {
      newErrors.inquiry = "Please provide details about your inquiry";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: "", email: "", inquiry: "" });
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };

  return (
    <section 
      id="contact"
      ref={sectionRef} 
      className="relative min-h-screen w-full flex items-center justify-center py-32 px-6 md:px-12"
    >
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?q=80&w=2070&auto=format&fit=crop')" 
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/60" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left Typography */}
        <div className="w-full lg:w-1/2 flex flex-col text-white text-center lg:text-left">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter leading-[1.1] mb-8 drop-shadow-xl">
            Ready to <br />elevate your <br />lifestyle?
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-md mx-auto lg:mx-0 drop-shadow-md">
            Connect with our private client advisory team to begin your journey.
          </p>
        </div>

        {/* Right Form - Glass Card */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <div ref={cardRef} className="glass-dark p-8 md:p-12 rounded-xl invisible">
            <h3 className="text-2xl font-serif text-white tracking-tight mb-8">
              Private Inquiry
            </h3>

            {isSuccess ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-serif text-white mb-2">Message Received</h4>
                <p className="text-white/60 font-light text-sm">An advisor will be in touch with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs tracking-widest uppercase text-white/60 font-medium">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn(
                      "bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors font-light placeholder:text-white/20 rounded-none",
                      errors.name && "border-destructive focus:border-destructive"
                    )}
                    placeholder="Elena Rostova"
                  />
                  {errors.name && <span className="text-destructive text-xs mt-1">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs tracking-widest uppercase text-white/60 font-medium">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={cn(
                      "bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors font-light placeholder:text-white/20 rounded-none",
                      errors.email && "border-destructive focus:border-destructive"
                    )}
                    placeholder="elena@example.com"
                  />
                  {errors.email && <span className="text-destructive text-xs mt-1">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label htmlFor="inquiry" className="text-xs tracking-widest uppercase text-white/60 font-medium">Your Inquiry</label>
                  <textarea
                    id="inquiry"
                    rows={3}
                    value={formData.inquiry}
                    onChange={(e) => setFormData({ ...formData, inquiry: e.target.value })}
                    className={cn(
                      "bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors font-light placeholder:text-white/20 resize-none rounded-none",
                      errors.inquiry && "border-destructive focus:border-destructive"
                    )}
                    placeholder="I am interested in..."
                  />
                  {errors.inquiry && <span className="text-destructive text-xs mt-1">{errors.inquiry}</span>}
                </div>

                {/* Magnetic Submit Button */}
                <div className="flex justify-start">
                  <button
                    ref={buttonRef}
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-40 h-14 bg-white rounded-full flex items-center justify-center text-black font-medium tracking-wide transition-colors hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span ref={buttonTextRef} className="block pointer-events-none">
                      {isSubmitting ? "Sending..." : "Submit"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
