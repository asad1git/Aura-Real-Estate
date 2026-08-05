import { useRef } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/hooks/use-gsap";

// Utility to split text into words for animation
const SplitTextWords = ({ text }: { text: string }) => {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.15em] pb-2">
          <span className="word-inner inline-block translate-y-[120%] pr-[0.15em]">{word}</span>
        </span>
      ))}
    </>
  );
};

export function OverlayText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current.parentElement, // The pinned section
        start: "top top",
        end: "+=400%", 
        scrub: 1,
      },
    });

    const milestones = containerRef.current.querySelectorAll(".milestone");

    milestones.forEach((milestone, index) => {
      const words = milestone.querySelectorAll(".word-inner");
      
      // Each milestone takes up roughly 1/5th of the scroll timeline
      // We fade it in, hold it, then fade it out.
      
      const startTime = index * 20; // 0, 20, 40, 60, 80
      
      // Animate words in
      tl.to(words, {
        y: "0%",
        duration: 2,
        stagger: 0.2,
        ease: "power2.out",
      }, startTime);

      // Fade milestone out before the next one starts (unless it's the last one)
      if (index < milestones.length - 1) {
        tl.to(milestone, {
          autoAlpha: 0,
          y: -30,
          duration: 2,
          ease: "power2.inOut",
        }, startTime + 10);
      }
    });

  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center text-center">
      
      <h2 className="milestone absolute text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-tighter w-full">
        <SplitTextWords text="Every dream begins with a foundation." />
      </h2>

      <h2 className="milestone absolute text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-tighter w-full invisible">
        <SplitTextWords text="Crafted with precision." />
      </h2>

      <h2 className="milestone absolute text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-tighter w-full invisible">
        <SplitTextWords text="Luxury takes shape." />
      </h2>

      <h2 className="milestone absolute text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-tighter w-full invisible">
        <SplitTextWords text="Designed to inspire." />
      </h2>

      <h2 className="milestone absolute text-4xl md:text-6xl lg:text-8xl font-serif text-white tracking-tighter w-full invisible">
        <SplitTextWords text="Welcome home." />
      </h2>

    </div>
  );
}
