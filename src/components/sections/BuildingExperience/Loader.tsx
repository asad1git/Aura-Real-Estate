import { Html, useProgress } from "@react-three/drei";

export function Loader() {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-4 text-white">
        <span className="font-serif text-sm tracking-widest uppercase text-white/50">
          Loading Architecture
        </span>
        <div className="w-48 h-[1px] bg-white/20 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}
