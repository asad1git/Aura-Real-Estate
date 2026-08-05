import { Environment, ContactShadows } from "@react-three/drei";

export function EnvironmentSetup() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 15, 60]} />
      
      <ambientLight intensity={0.6} />
      
      {/* Main Key Light */}
      <directionalLight 
        position={[15, 20, 10]} 
        intensity={1.8} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Fill Light */}
      <directionalLight 
        position={[-10, 10, -10]} 
        intensity={0.4} 
        color="#88bbee" 
      />
      
      {/* Ground Contact Shadows for ultra-realism */}
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.8} 
        scale={40} 
        blur={2} 
        far={10} 
      />
      
      <Environment preset="city" />
    </>
  );
}
