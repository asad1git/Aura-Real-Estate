"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/hooks/use-gsap";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const [cursorText, setCursorText] = useState("");
  const [cursorImage, setCursorImage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useGsapContext(() => {
    // Check if device has a fine pointer (mouse) instead of touch
    if (typeof window !== "undefined") {
      setIsDesktop(window.matchMedia("(pointer: fine)").matches);
    }

    if (!cursorRef.current || !isDesktop) return;

    // Use GSAP quickSetter for true instant 1-to-1 tracking without animation loops
    const xSet = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySet = gsap.quickSetter(cursorRef.current, "y", "px");

    let activeMagneticElement: HTMLElement | null = null;

    const onMouseMove = (e: MouseEvent) => {
      // If hovering over a magnetic element, lock the cursor slightly to its center
      if (activeMagneticElement) {
        const rect = activeMagneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Move the cursor partially towards the center of the button
        xSet(centerX + (e.clientX - centerX) * 0.1);
        ySet(centerY + (e.clientY - centerY) * 0.1);
      } else {
        xSet(e.clientX);
        ySet(e.clientY);
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Look for custom data attributes traversing up the DOM tree
      const magneticTarget = target.closest('[data-cursor="magnetic"]') as HTMLElement;
      const textTarget = target.closest('[data-cursor-text]');
      const imageTarget = target.closest('[data-cursor-image]');
      const pointerTarget = target.closest('a, button, [role="button"], input, select, textarea');

      if (magneticTarget) {
        activeMagneticElement = magneticTarget;
      }

      if (textTarget) {
        setCursorText(textTarget.getAttribute("data-cursor-text") || "");
        setIsActive(true);
      } else if (imageTarget) {
        setCursorImage(imageTarget.getAttribute("data-cursor-image") || "");
        setIsActive(true);
      } else if (pointerTarget) {
        setIsActive(true);
        setCursorText("");
        setCursorImage("");
      } else {
        setIsActive(false);
        setCursorText("");
        setCursorImage("");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magneticTarget = target.closest('[data-cursor="magnetic"]');
      
      if (magneticTarget) {
        activeMagneticElement = null;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, [isDesktop]);

  // Hide default cursor globally on desktop
  useEffect(() => {
    if (isDesktop) {
      document.body.style.cursor = "none";
      
      // Ensure all clickable elements hide their cursor too
      const style = document.createElement("style");
      style.innerHTML = `
        * { cursor: none !important; }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.body.style.cursor = "";
        document.head.removeChild(style);
      };
    }
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div 
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2",
        // Avoid 'transition-all' as it conflicts with GSAP transforms and causes severe lag!
        // We only transition the dimensions and border-radius.
        "transition-[width,height,background-color] duration-300 ease-out",
        // ALWAYS use mix-blend-difference with bg-white so it dynamically contrasts any background (black on white, white on black)
        "mix-blend-difference bg-white",
        isActive || cursorText || cursorImage ? "w-16 h-16" : "w-4 h-4",
        "rounded-full"
      )}
    >
      {/* Text Label */}
      {cursorText && (
        <span 
          ref={textRef} 
          className="text-[10px] font-medium tracking-widest uppercase text-black absolute"
        >
          {cursorText}
        </span>
      )}

      {/* Image Preview (e.g. hovering over a project name in a list) */}
      {cursorImage && (
        <div 
          ref={imageContainerRef}
          className="absolute inset-0 w-32 h-32 -left-8 -top-8 rounded-sm overflow-hidden border border-border bg-background transition-opacity duration-300"
        >
          <Image 
            src={cursorImage} 
            alt="Preview" 
            fill 
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
