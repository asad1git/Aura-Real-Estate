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
  const foundationRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const groundGlassRef = useRef<THREE.Group>(null);
  const upperFloorRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const upperGlassRef = useRef<THREE.Group>(null);
  const poolRef = useRef<THREE.Group>(null);
  const landscapingRef = useRef<THREE.Group>(null);
  const interiorLightsRef = useRef<THREE.Group>(null);

  // Premium Architectural Materials
  const materials = useMemo(() => ({
    // Light ultra-smooth concrete for foundation and floors
    lightConcrete: new THREE.MeshStandardMaterial({ color: "#e8e8e8", roughness: 0.7, metalness: 0.1 }),
    // Dark textured concrete for structural cores
    darkConcrete: new THREE.MeshStandardMaterial({ color: "#2d2d2d", roughness: 0.9, metalness: 0.2 }),
    // Rich walnut wood for soffits and decking
    walnutWood: new THREE.MeshStandardMaterial({ color: "#3a2416", roughness: 0.8, metalness: 0.0 }),
    // Matte black anodized aluminum for frames
    blackMetal: new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.4, metalness: 0.8 }),
    // High-end architectural glass (very transparent, reflective)
    glass: new THREE.MeshPhysicalMaterial({ 
      color: "#f0f8ff", 
      transmission: 0.95, 
      opacity: 1, 
      metalness: 0.1, 
      roughness: 0.05, 
      ior: 1.52, 
      thickness: 0.1,
      transparent: true 
    }),
    // Glowing pool water
    water: new THREE.MeshPhysicalMaterial({ 
      color: "#2bd9ff", 
      transmission: 0.8, 
      opacity: 0.9, 
      metalness: 0.1, 
      roughness: 0.1,
      transparent: true,
      emissive: "#0a4b66",
      emissiveIntensity: 0.5
    }),
    // Deep green manicured grass
    grass: new THREE.MeshStandardMaterial({ color: "#1a2f18", roughness: 1 }),
    // Glowing interior lights
    warmLight: new THREE.MeshBasicMaterial({ color: "#ffeedd" }),
  }), []);

  useFrame(() => {
    const p = buildingStore.progress;

    // Timeline mapping:
    // 0.00 - 0.15: Foundation & Pool excavation
    // 0.15 - 0.30: Structural Core & Black metal frames
    // 0.30 - 0.45: Ground Glass (Sliding down)
    // 0.45 - 0.60: Upper Floor slab & Cantilever
    // 0.60 - 0.75: Upper Glass & Roof
    // 0.75 - 0.90: Pool filling & Wood decking
    // 0.90 - 1.00: Landscaping & Interior Lights

    // 1. Foundation & Pool Shell (0.0 to 0.15)
    if (foundationRef.current) {
      const scale = smoothStep(0.0, 0.15, p);
      foundationRef.current.scale.set(scale, scale, scale);
      foundationRef.current.position.y = (scale - 1) * 1;
    }

    // 2. Structural Core & Frames (0.15 to 0.30)
    if (coreRef.current) {
      const scale = smoothStep(0.15, 0.30, p);
      coreRef.current.scale.y = scale;
      coreRef.current.position.y = (scale - 1) * 2;
    }

    // 3. Ground Glass (0.30 to 0.45)
    if (groundGlassRef.current) {
      const scale = smoothStep(0.30, 0.45, p);
      groundGlassRef.current.scale.y = scale;
      groundGlassRef.current.position.y = (scale - 1) * 2;
    }

    // 4. Upper Floor Cantilever (0.45 to 0.60)
    if (upperFloorRef.current) {
      const scale = smoothStep(0.45, 0.60, p);
      upperFloorRef.current.scale.set(scale, scale, scale);
      upperFloorRef.current.position.y = (scale - 1) * 2;
    }

    // 5. Roof & Upper Glass (0.60 to 0.75)
    if (roofRef.current) {
      const scale = smoothStep(0.60, 0.75, p);
      roofRef.current.scale.set(scale, scale, scale);
      roofRef.current.position.y = (scale - 1) * 2;
    }
    if (upperGlassRef.current) {
      const scale = smoothStep(0.60, 0.75, p);
      upperGlassRef.current.scale.y = scale;
      upperGlassRef.current.position.y = (scale - 1) * 2;
    }

    // 6. Pool Filling & Deck (0.75 to 0.90)
    if (poolRef.current) {
      const scale = smoothStep(0.75, 0.90, p);
      poolRef.current.scale.y = scale; // Water level rises
      poolRef.current.position.y = (scale - 1) * 0.5;
    }

    // 7. Landscaping & Lights (0.90 to 1.0)
    if (landscapingRef.current) {
      const scale = smoothStep(0.90, 1.0, p);
      landscapingRef.current.scale.set(scale, scale, scale);
    }
    if (interiorLightsRef.current) {
      const alpha = smoothStep(0.90, 1.0, p);
      interiorLightsRef.current.children.forEach((light: any) => {
        if (light.intensity !== undefined) light.intensity = alpha * 2;
      });
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* 1. Foundation & Plinth */}
      <group ref={foundationRef}>
        {/* Main concrete plinth */}
        <mesh position={[0, 0.5, -2]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[24, 1, 16]} />
        </mesh>
        {/* Entrance steps */}
        <mesh position={[0, 0.25, 6.5]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[8, 0.5, 3]} />
        </mesh>
        <mesh position={[0, 0.75, 5.5]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[6, 0.5, 2]} />
        </mesh>
      </group>

      {/* 2. Structural Core & Metal Columns */}
      <group ref={coreRef} position={[0, 1, 0]}>
        {/* Dark concrete solid wall (left side) */}
        <mesh position={[-8, 2, -4]} receiveShadow castShadow material={materials.darkConcrete}>
          <boxGeometry args={[4, 4, 10]} />
        </mesh>
        {/* Dark concrete solid wall (rear) */}
        <mesh position={[2, 2, -8]} receiveShadow castShadow material={materials.darkConcrete}>
          <boxGeometry args={[16, 4, 2]} />
        </mesh>
        {/* Black steel columns for glass facade */}
        {[-3, 1, 5, 9].map((x, i) => (
          <mesh key={`col-${i}`} position={[x, 2, 0.9]} castShadow material={materials.blackMetal}>
            <boxGeometry args={[0.2, 4, 0.2]} />
          </mesh>
        ))}
      </group>

      {/* 3. Ground Glass Facade */}
      <group ref={groundGlassRef} position={[0, 1, 0]}>
        <mesh position={[3, 2, 1]} castShadow receiveShadow material={materials.glass}>
          <boxGeometry args={[12, 4, 0.1]} />
        </mesh>
        <mesh position={[9.05, 2, -3.5]} castShadow receiveShadow material={materials.glass}>
          <boxGeometry args={[0.1, 4, 9]} />
        </mesh>
      </group>

      {/* 4. Upper Floor Cantilever */}
      <group ref={upperFloorRef} position={[0, 5, 0]}>
        {/* Upper slab (light concrete) */}
        <mesh position={[1, 0.5, -1]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[26, 1, 18]} />
        </mesh>
        {/* Walnut soffit (ceiling underneath) */}
        <mesh position={[1, 0, -1]} receiveShadow material={materials.walnutWood}>
          <boxGeometry args={[25.8, 0.1, 17.8]} />
        </mesh>
      </group>

      {/* 5. Roof & Upper Glass */}
      <group position={[0, 6, 0]}>
        <group ref={upperGlassRef}>
          {/* Upper glass wrapping around */}
          <mesh position={[1, 1.5, 7.9]} castShadow material={materials.glass}>
            <boxGeometry args={[20, 3, 0.1]} />
          </mesh>
          <mesh position={[-8.9, 1.5, -0.05]} castShadow material={materials.glass}>
            <boxGeometry args={[0.1, 3, 16]} />
          </mesh>
          <mesh position={[10.9, 1.5, -0.05]} castShadow material={materials.glass}>
            <boxGeometry args={[0.1, 3, 16]} />
          </mesh>
          {/* Upper dark concrete core */}
          <mesh position={[1, 1.5, -4]} receiveShadow castShadow material={materials.darkConcrete}>
            <boxGeometry args={[12, 3, 8]} />
          </mesh>
        </group>

        <group ref={roofRef} position={[0, 3, 0]}>
          {/* Roof slab (light concrete) */}
          <mesh position={[1, 0.5, -1]} receiveShadow castShadow material={materials.lightConcrete}>
            <boxGeometry args={[26, 1, 18]} />
          </mesh>
          {/* Black metal trim around roof */}
          <mesh position={[1, 0.5, -1]} receiveShadow castShadow material={materials.blackMetal}>
            <boxGeometry args={[26.2, 0.2, 18.2]} />
          </mesh>
        </group>
      </group>

      {/* 6. Infinity Pool & Deck */}
      <group position={[0, 1, 0]}>
        {/* Pool Water */}
        <group ref={poolRef}>
          <mesh position={[-6, -0.1, 7]} receiveShadow material={materials.water}>
            <boxGeometry args={[8, 0.8, 6]} />
          </mesh>
        </group>
        {/* Walnut pool deck */}
        <mesh position={[-6, 0, 11]} receiveShadow castShadow material={materials.walnutWood}>
          <boxGeometry args={[10, 0.2, 4]} />
        </mesh>
        <mesh position={[-11, 0, 7]} receiveShadow castShadow material={materials.walnutWood}>
          <boxGeometry args={[2, 0.2, 12]} />
        </mesh>
      </group>

      {/* 7. Landscaping & Interior Lights */}
      <group position={[0, 0, 0]}>
        <group ref={landscapingRef}>
          {/* Zen garden rocks/spheres */}
          <mesh position={[10, 1, 8]} castShadow receiveShadow material={materials.darkConcrete}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>
          <mesh position={[11.5, 0.8, 7]} castShadow receiveShadow material={materials.darkConcrete}>
            <sphereGeometry args={[0.6, 32, 32]} />
          </mesh>
          
          {/* Minimalist trees (Cones on cylinders) */}
          {[
            { x: -10, z: 12, h: 4 },
            { x: 8, z: 12, h: 5 },
            { x: 12, z: -2, h: 6 },
          ].map((tree, i) => (
            <group key={`tree-${i}`} position={[tree.x, 1, tree.z]}>
              <mesh position={[0, tree.h / 4, 0]} castShadow material={materials.walnutWood}>
                <cylinderGeometry args={[0.2, 0.3, tree.h / 2]} />
              </mesh>
              <mesh position={[0, tree.h * 0.7, 0]} castShadow material={materials.grass}>
                <coneGeometry args={[1.5, tree.h * 0.8, 16]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Interior glowing lights (PointLights) */}
        <group ref={interiorLightsRef}>
          {/* Ground floor lounge */}
          <pointLight position={[3, 3, -2]} color="#ffeedd" distance={15} decay={2} castShadow />
          {/* Upper floor bedroom */}
          <pointLight position={[-4, 7.5, 4]} color="#ffeedd" distance={15} decay={2} castShadow />
          {/* Upper floor living */}
          <pointLight position={[6, 7.5, 4]} color="#ffeedd" distance={15} decay={2} castShadow />
          {/* Pool underwater light */}
          <pointLight position={[-6, 0.5, 7]} color="#2bd9ff" distance={8} decay={2} />
        </group>
      </group>
    </group>
  );
}
