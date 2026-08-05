import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildingStore } from "./store";

// Utility for smooth step interpolation
const smoothStep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

export function BuildingModel() {
  const foundationRef = useRef<THREE.Mesh>(null);
  const columnsRef = useRef<THREE.Group>(null);
  const groundFloorRef = useRef<THREE.Mesh>(null);
  const upperFloorRef = useRef<THREE.Mesh>(null);
  const roofRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Group>(null);
  const poolRef = useRef<THREE.Mesh>(null);
  const treesRef = useRef<THREE.Group>(null);

  // Premium Materials
  const materials = useMemo(() => ({
    concrete: new THREE.MeshStandardMaterial({ color: "#d4d4d4", roughness: 0.8, metalness: 0.1 }),
    darkWood: new THREE.MeshStandardMaterial({ color: "#2a1e12", roughness: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({ 
      color: "#ffffff", 
      transmission: 0.9, 
      opacity: 1, 
      metalness: 0.2, 
      roughness: 0.05, 
      ior: 1.5, 
      thickness: 0.5,
      transparent: true 
    }),
    water: new THREE.MeshStandardMaterial({ color: "#4ab9d9", roughness: 0.1, metalness: 0.8 }),
    grass: new THREE.MeshStandardMaterial({ color: "#2d4c1e", roughness: 1 }),
  }), []);

  useFrame(() => {
    const p = buildingStore.progress;

    // Timeline mapping:
    // 0.00 - 0.10: Empty land -> Foundation
    // 0.10 - 0.25: Foundation -> Columns
    // 0.25 - 0.40: Columns -> Ground Floor
    // 0.40 - 0.55: Upper Floor
    // 0.55 - 0.65: Roof
    // 0.65 - 0.75: Glass / Windows
    // 0.75 - 0.85: Pool
    // 0.85 - 1.00: Trees & Landscaping

    // Foundation (0.0 to 0.1)
    if (foundationRef.current) {
      const scale = smoothStep(0.0, 0.1, p);
      foundationRef.current.scale.set(scale, scale, scale);
      foundationRef.current.position.y = (scale - 1) * 0.5;
    }

    // Columns (0.1 to 0.25)
    if (columnsRef.current) {
      const scale = smoothStep(0.1, 0.25, p);
      columnsRef.current.scale.y = scale;
      columnsRef.current.position.y = (scale - 1) * 2; // Grow upwards
    }

    // Ground Floor (0.25 to 0.4)
    if (groundFloorRef.current) {
      const scale = smoothStep(0.25, 0.4, p);
      groundFloorRef.current.scale.set(scale, scale, scale);
      groundFloorRef.current.position.y = 2 + (scale - 1) * 2;
    }

    // Upper Floor Cantilever (0.4 to 0.55)
    if (upperFloorRef.current) {
      const scale = smoothStep(0.4, 0.55, p);
      upperFloorRef.current.scale.set(scale, scale, scale);
      upperFloorRef.current.position.y = 5 + (scale - 1) * 2;
    }

    // Roof (0.55 to 0.65)
    if (roofRef.current) {
      const scale = smoothStep(0.55, 0.65, p);
      roofRef.current.scale.set(scale, scale, scale);
      roofRef.current.position.y = 8 + (scale - 1) * 2;
    }

    // Glass (0.65 to 0.75)
    if (glassRef.current) {
      const alpha = smoothStep(0.65, 0.75, p);
      // We scale Y to make them "slide" down like luxury automated blinds
      glassRef.current.scale.y = alpha;
      glassRef.current.position.y = 4 + (alpha - 1) * 4;
    }

    // Pool (0.75 to 0.85)
    if (poolRef.current) {
      const scale = smoothStep(0.75, 0.85, p);
      poolRef.current.scale.set(scale, 1, scale);
    }

    // Trees (0.85 to 1.0)
    if (treesRef.current) {
      const scale = smoothStep(0.85, 1.0, p);
      treesRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* 1. Foundation */}
      <mesh ref={foundationRef} position={[0, 0, 0]} receiveShadow castShadow material={materials.concrete}>
        <boxGeometry args={[20, 1, 15]} />
      </mesh>

      {/* 2. Concrete Columns */}
      <group ref={columnsRef} position={[0, 0.5, 0]}>
        {[-8, -4, 0, 4, 8].map((x, i) => (
          <mesh key={`col-${i}`} position={[x, 2, -6]} castShadow receiveShadow material={materials.concrete}>
            <boxGeometry args={[0.8, 4, 0.8]} />
          </mesh>
        ))}
      </group>

      {/* 3. Ground Floor Walls (Inner Core) */}
      <mesh ref={groundFloorRef} position={[0, 2.5, -2]} castShadow receiveShadow material={materials.darkWood}>
        <boxGeometry args={[14, 4, 8]} />
      </mesh>

      {/* 4. Upper Floor Cantilever */}
      <mesh ref={upperFloorRef} position={[2, 5.5, 0]} castShadow receiveShadow material={materials.concrete}>
        <boxGeometry args={[22, 2, 16]} />
      </mesh>

      {/* 5. Roof */}
      <mesh ref={roofRef} position={[0, 7.5, -2]} castShadow receiveShadow material={materials.darkWood}>
        <boxGeometry args={[24, 0.5, 18]} />
      </mesh>

      {/* 6. Premium Glass Panels */}
      <group ref={glassRef} position={[0, 4, 0]}>
        {/* Ground floor front glass */}
        <mesh position={[0, -1.5, 2.1]} castShadow material={materials.glass}>
          <planeGeometry args={[14, 4]} />
        </mesh>
        {/* Upper floor cantilever glass */}
        <mesh position={[2, 1.5, 8.1]} castShadow material={materials.glass}>
          <planeGeometry args={[22, 2]} />
        </mesh>
      </group>

      {/* 7. Infinity Pool */}
      <mesh ref={poolRef} position={[-4, 0.4, 8]} receiveShadow material={materials.water}>
        <boxGeometry args={[10, 0.2, 6]} />
      </mesh>
      {/* Pool Deck */}
      <mesh position={[-4, 0.2, 8]} receiveShadow material={materials.concrete}>
        <boxGeometry args={[12, 0.4, 8]} />
      </mesh>

      {/* 8. Landscaping / Trees */}
      <group ref={treesRef} position={[0, 0, 0]}>
        <mesh position={[8, 2, 8]} castShadow material={materials.grass}>
          <sphereGeometry args={[2, 16, 16]} />
        </mesh>
        <mesh position={[8, 1, 8]} castShadow material={materials.darkWood}>
          <cylinderGeometry args={[0.2, 0.4, 2]} />
        </mesh>

        <mesh position={[-9, 3, 5]} castShadow material={materials.grass}>
          <sphereGeometry args={[3, 16, 16]} />
        </mesh>
        <mesh position={[-9, 1.5, 5]} castShadow material={materials.darkWood}>
          <cylinderGeometry args={[0.3, 0.5, 3]} />
        </mesh>
      </group>
    </group>
  );
}
