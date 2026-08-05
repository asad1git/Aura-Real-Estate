import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "./Loader";
import { EnvironmentSetup } from "./EnvironmentSetup";
import { CameraRig } from "./CameraRig";
import { BuildingModel } from "./BuildingModel";

export function BuildingCanvas() {
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 15, 35], fov: 45 }}
      dpr={[1, 2]} // Optimize pixel ratio for high DPI displays while preserving performance
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={<Loader />}>
        <EnvironmentSetup />
        <CameraRig />
        <BuildingModel />
      </Suspense>
    </Canvas>
  );
}
