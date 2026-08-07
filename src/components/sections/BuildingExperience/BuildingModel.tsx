import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildingStore } from "./store";

// Utility for linear step interpolation with zero-division safety
const linearStep = (min: number, max: number, value: number) => {
  if (max === min) return value >= max ? 1 : 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

export function BuildingModel() {
  const { viewport } = useThree();
  
  // Mobile Responsiveness: Scale the entire model down if the viewport is narrow
  const isMobile = viewport.width < 25;
  const globalScale = isMobile ? 0.25 : 0.45;
  const globalY = isMobile ? 0 : -0.5;

  const foundationRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const groundGlassRef = useRef<THREE.Group>(null);
  const middleFloorRef = useRef<THREE.Group>(null);
  const middleGlassRef = useRef<THREE.Group>(null);
  const topFloorRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const topGlassRef = useRef<THREE.Group>(null);
  const poolRef = useRef<THREE.Group>(null);
  const landscapingRef = useRef<THREE.Group>(null);
  const interiorLightsRef = useRef<THREE.Group>(null);
  const snowRef = useRef<THREE.Mesh>(null);

  // Refined Architectural Materials
  const materials = useMemo(
    () => ({
      lightConcrete: new THREE.MeshStandardMaterial({
        color: "#e8e8e8",
        roughness: 0.7,
        metalness: 0.05,
      }),
      darkConcrete: new THREE.MeshStandardMaterial({
        color: "#2d2d2d",
        roughness: 0.85,
        metalness: 0.1,
      }),
      walnutWood: new THREE.MeshStandardMaterial({
        color: "#3a2416",
        roughness: 0.65,
        metalness: 0.0,
      }),
      blackMetal: new THREE.MeshStandardMaterial({
        color: "#111111",
        roughness: 0.2,
        metalness: 0.9,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transmission: 0.92,
        opacity: 1,
        metalness: 0.0,
        roughness: 0.02,
        ior: 1.52,
        thickness: 0.15,
        transparent: false, // Prevents depth-sorting visual artifacts
      }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#1ca3ec",
        transmission: 0.85,
        opacity: 1,
        metalness: 0.0,
        roughness: 0.05,
        ior: 1.333,
        transparent: false,
      }),
      snow: new THREE.MeshStandardMaterial({
        color: "#fafafa",
        roughness: 0.95,
        metalness: 0.0,
      }),
      warmLight: new THREE.MeshBasicMaterial({ color: "#ffeedd" }),
    }),
    []
  );

  // GPU Memory Disposal Cleanup
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

  useFrame(() => {
    const p = buildingStore.progress;

    // 1. Foundation & Core
    if (foundationRef.current) {
      foundationRef.current.scale.set(1, 1, 1);
      foundationRef.current.position.y = 0;
    }

    if (coreRef.current) {
      const scale = Math.max(0.001, linearStep(0.0, 0.15, p));
      coreRef.current.scale.y = scale;
      coreRef.current.position.y = 1 + (scale - 1) * 2;
    }

    // 2. Ground Glass
    if (groundGlassRef.current) {
      const scale = Math.max(0.001, linearStep(0.15, 0.3, p));
      groundGlassRef.current.scale.y = scale;
      groundGlassRef.current.position.y = 1 + (scale - 1) * 2;
    }

    // 3. Middle Floor & Glass
    if (middleFloorRef.current) {
      const scale = Math.max(0.001, linearStep(0.3, 0.45, p));
      middleFloorRef.current.scale.set(scale, scale, scale);
      middleFloorRef.current.position.y = 5 + (scale - 1) * 2;
    }
    if (middleGlassRef.current) {
      const scale = Math.max(0.001, linearStep(0.3, 0.45, p));
      middleGlassRef.current.scale.y = scale;
      middleGlassRef.current.position.y = 6 + (scale - 1) * 2;
    }

    // 4. Top Floor, Glass & Roof
    if (topFloorRef.current) {
      const scale = Math.max(0.001, linearStep(0.45, 0.6, p));
      topFloorRef.current.scale.set(scale, scale, scale);
      topFloorRef.current.position.y = 10 + (scale - 1) * 2;
    }
    if (topGlassRef.current) {
      const scale = Math.max(0.001, linearStep(0.45, 0.6, p));
      topGlassRef.current.scale.y = scale;
      topGlassRef.current.position.y = (scale - 1) * 1.5;
    }
    if (roofRef.current) {
      const scale = Math.max(0.001, linearStep(0.45, 0.6, p));
      roofRef.current.scale.set(scale, scale, scale);
      roofRef.current.position.y = 3 + (scale - 1) * 2;
    }

    // 5. Pool & Snow
    if (poolRef.current) {
      const scale = Math.max(0.001, linearStep(0.6, 0.75, p));
      poolRef.current.scale.y = scale;
      poolRef.current.position.y = (scale - 1) * 0.5;
    }
    if (snowRef.current) {
      const scale = Math.max(0.001, linearStep(0.6, 0.75, p));
      snowRef.current.scale.y = scale;
    }

    // 6. Landscaping & Interior Lighting
    if (landscapingRef.current) {
      const scale = Math.max(0.001, linearStep(0.75, 1.0, p));
      landscapingRef.current.scale.set(scale, scale, scale);
    }
    if (interiorLightsRef.current) {
      const alpha = linearStep(0.75, 1.0, p);
      interiorLightsRef.current.children.forEach((light) => {
        if ("intensity" in light) {
          (light as THREE.Light).intensity = alpha * 2.5;
        }
      });
    }
  });

  return (
    <group position={[0, globalY, 0]} scale={globalScale}>
      {/* 1. Foundation & Plinth */}
      <group ref={foundationRef}>
        <mesh position={[0, 0.5, -2]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[24, 1, 16]} />
        </mesh>
        <mesh position={[0, 0.25, 6.5]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[8, 0.5, 3]} />
        </mesh>
        <mesh position={[0, 0.75, 5.5]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[6, 0.5, 2]} />
        </mesh>
      </group>

      {/* 2. Ground Floor Core & Metal Columns */}
      <group ref={coreRef} position={[0, 1, 0]}>
        <mesh position={[-8, 2, -4]} receiveShadow castShadow material={materials.darkConcrete}>
          <boxGeometry args={[4, 4, 10]} />
        </mesh>
        <mesh position={[2, 2, -8]} receiveShadow castShadow material={materials.darkConcrete}>
          <boxGeometry args={[16, 4, 2]} />
        </mesh>
        <mesh position={[0, 2, 0]} receiveShadow castShadow material={materials.walnutWood}>
          <boxGeometry args={[8, 4, 6]} />
        </mesh>
        {[-3, 1, 5, 9].map((x, i) => (
          <mesh key={`col-ground-${i}`} position={[x, 2, 0.9]} castShadow material={materials.blackMetal}>
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

      {/* 4. Middle Floor Cantilever Slab */}
      <group ref={middleFloorRef} position={[0, 5, 0]}>
        <mesh position={[1, 0.5, -1]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[26, 1, 18]} />
        </mesh>
        <mesh position={[1, 0, -1]} receiveShadow material={materials.walnutWood}>
          <boxGeometry args={[25.8, 0.1, 17.8]} />
        </mesh>
      </group>

      {/* 5. Middle Floor Glass & Core */}
      <group ref={middleGlassRef} position={[0, 6, 0]}>
        <mesh position={[1, 2, -4]} receiveShadow castShadow material={materials.darkConcrete}>
          <boxGeometry args={[12, 4, 8]} />
        </mesh>
        <mesh position={[1, 2, 2]} receiveShadow castShadow material={materials.walnutWood}>
          <boxGeometry args={[10, 4, 6]} />
        </mesh>
        <mesh position={[1, 2, 7.9]} castShadow material={materials.glass}>
          <boxGeometry args={[20, 4, 0.1]} />
        </mesh>
        <mesh position={[-8.9, 2, -0.05]} castShadow material={materials.glass}>
          <boxGeometry args={[0.1, 4, 16]} />
        </mesh>
        <mesh position={[10.9, 2, -0.05]} castShadow material={materials.glass}>
          <boxGeometry args={[0.1, 4, 16]} />
        </mesh>
      </group>

      {/* 6. Top Floor Cantilever Slab */}
      <group ref={topFloorRef} position={[0, 10, 0]}>
        <mesh position={[-1, 0.5, -2]} receiveShadow castShadow material={materials.lightConcrete}>
          <boxGeometry args={[22, 1, 16]} />
        </mesh>
        <mesh position={[-1, 0, -2]} receiveShadow material={materials.walnutWood}>
          <boxGeometry args={[21.8, 0.1, 15.8]} />
        </mesh>
      </group>

      {/* 7. Top Floor Glass & Roof Structure */}
      <group position={[0, 11, 0]}>
        <group ref={topGlassRef}>
          <mesh position={[-2, 1.5, -5]} receiveShadow castShadow material={materials.darkConcrete}>
            <boxGeometry args={[8, 3, 6]} />
          </mesh>
          <mesh position={[-1, 1.5, 1]} receiveShadow castShadow material={materials.walnutWood}>
            <boxGeometry args={[6, 3, 6]} />
          </mesh>
          <mesh position={[-1, 1.5, 5.9]} castShadow material={materials.glass}>
            <boxGeometry args={[16, 3, 0.1]} />
          </mesh>
          <mesh position={[-8.9, 1.5, 0.95]} castShadow material={materials.glass}>
            <boxGeometry args={[0.1, 3, 10]} />
          </mesh>
          <mesh position={[6.9, 1.5, 0.95]} castShadow material={materials.glass}>
            <boxGeometry args={[0.1, 3, 10]} />
          </mesh>
        </group>

        <group ref={roofRef} position={[0, 3, 0]}>
          <mesh position={[-1, 0.5, -2]} receiveShadow castShadow material={materials.lightConcrete}>
            <boxGeometry args={[22, 1, 16]} />
          </mesh>
          <mesh position={[-1, 0.5, -2]} receiveShadow castShadow material={materials.blackMetal}>
            <boxGeometry args={[22.2, 0.2, 16.2]} />
          </mesh>
          <mesh ref={snowRef} position={[-1, 1.05, -2]} receiveShadow castShadow material={materials.snow}>
            <boxGeometry args={[21.8, 0.15, 15.8]} />
          </mesh>
        </group>
      </group>

      {/* 8. Pool & Deck */}
      <group position={[0, 1, 0]}>
        <group ref={poolRef}>
          <mesh position={[-6, -0.1, 7]} receiveShadow material={materials.water}>
            <boxGeometry args={[8, 0.8, 6]} />
          </mesh>
        </group>
        <mesh position={[-6, 0, 11]} receiveShadow castShadow material={materials.walnutWood}>
          <boxGeometry args={[10, 0.2, 4]} />
        </mesh>
        <mesh position={[-11, 0, 7]} receiveShadow castShadow material={materials.walnutWood}>
          <boxGeometry args={[2, 0.2, 12]} />
        </mesh>
      </group>

      {/* 9. Landscaping & Interior Lights */}
      <group position={[0, 0, 0]}>
        <group ref={landscapingRef}>
          <mesh position={[10, 1, 8]} castShadow receiveShadow material={materials.darkConcrete}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>
          <mesh position={[11.5, 0.8, 7]} castShadow receiveShadow material={materials.darkConcrete}>
            <sphereGeometry args={[0.6, 32, 32]} />
          </mesh>

          {[
            { x: -10, z: 12, h: 2.5 },
            { x: 8, z: 12, h: 3 },
            { x: 12, z: -2, h: 3.5 },
          ].map((tree, i) => (
            <group key={`tree-${i}`} position={[tree.x, 1, tree.z]}>
              <mesh position={[0, tree.h / 4, 0]} castShadow material={materials.walnutWood}>
                <cylinderGeometry args={[0.1, 0.2, tree.h / 2]} />
              </mesh>
              <mesh position={[0, tree.h * 0.7, 0]} castShadow material={materials.snow}>
                <coneGeometry args={[1.0, tree.h * 0.8, 16]} />
              </mesh>
            </group>
          ))}
        </group>

        <group ref={interiorLightsRef}>
          <pointLight position={[3, 3, -2]} color="#ffeedd" intensity={2} distance={15} decay={2} castShadow />
          <pointLight position={[-4, 8, 4]} color="#ffeedd" intensity={2} distance={15} decay={2} castShadow />
          <pointLight position={[6, 8, 4]} color="#ffeedd" intensity={2} distance={15} decay={2} castShadow />
          <pointLight position={[0, 12.5, 2]} color="#ffeedd" intensity={2} distance={15} decay={2} castShadow />
          <pointLight position={[-6, 0.5, 7]} color="#2bd9ff" intensity={2} distance={8} decay={2} />
        </group>
      </group>
    </group>
  );
}
