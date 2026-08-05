import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Vignette, Noise } from "@react-three/postprocessing";
import { Loader } from "./Loader";
import { EnvironmentSetup } from "./EnvironmentSetup";
import { CameraRig } from "./CameraRig";
import { BuildingModel } from "./BuildingModel";

export function BuildingCanvas() {
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 15, 35], fov: 45 }}
      dpr={[1, 2]} // Crisp rendering on high-density displays
      gl={{ 
        antialias: true, 
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping, // Photographic color grading
        toneMappingExposure: 1.1 // Slightly brighter for that sharp cinematic look
      }}
    >
      <Suspense fallback={<Loader />}>
        <EnvironmentSetup />
        <CameraRig />
        <BuildingModel />
        
        {/* Cinematic Post-Processing Pipeline */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Noise opacity={0.035} />
          <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
