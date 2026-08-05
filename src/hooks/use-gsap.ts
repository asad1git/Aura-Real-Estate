import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";

// Isomorphic layout effect to avoid warnings on SSR
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGsapContext(
  setup: (context: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(setup);
    
    return () => {
      ctx.revert();
    };
  }, deps);
}
