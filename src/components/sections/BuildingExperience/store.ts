// Global store for GSAP -> R3F communication
// We use a simple proxy object to avoid React re-renders on every scroll tick.
export const buildingStore = {
  progress: 0,
};
