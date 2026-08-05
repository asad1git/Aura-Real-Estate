import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildingStore } from "./store";

export function CameraRig() {
  const group = useRef<THREE.Group>(null);
  const targetPosition = new THREE.Vector3();
  const lookAtTarget = new THREE.Vector3(0, 3, 0);

  useFrame((state) => {
    // Unclamped progress perfectly syncs camera movement with the scroll pin
    const p = buildingStore.progress;

    // --- Cinematic Camera Spline Logic ---
    // Start wide and high
    // Smoothly dolly in, orbit around the corner, and lower the tilt
    
    // Radius reduces from 35 to 20 (Dolly In)
    const radius = 35 - (p * 15);
    
    // Angle orbits from 45deg (corner) to 15deg (nearly front)
    const angle = (Math.PI / 4) - (p * Math.PI / 6);
    
    // Height tilts down from 15 to 4 (ground level perspective at the end)
    const height = 15 - (p * 11);

    targetPosition.set(
      Math.sin(angle) * radius,
      height,
      Math.cos(angle) * radius
    );

    // Lerp the camera position for buttery smooth lag (adds weight)
    state.camera.position.lerp(targetPosition, 0.03);
    
    // Lerp the look-at target slightly upwards as we get closer
    const lookY = 2 + (p * 2);
    lookAtTarget.set(0, lookY, 0);
    
    state.camera.lookAt(lookAtTarget);
  });

  return <group ref={group} />;
}
