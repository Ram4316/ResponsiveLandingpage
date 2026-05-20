"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface InteractiveOrbProps {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

export function InteractiveOrb({ mousePos }: InteractiveOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null); // keeping as any due to internal drei material typing issues
  const { viewport } = useThree();

  // Create bump map programmatically for the cellular look
  const bumpMap = useMemo(() => {
    const size = 512;
    const data = new Uint8Array(size * size * 4);

    // Generate a simple cellular/voronoi-like pattern
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Create repeating bumps
        const u = i / size;
        const v = j / size;

        // Number of bumps around the sphere
        const bumpsU = 40;
        const bumpsV = 20;

        const valU = Math.sin(u * Math.PI * 2 * bumpsU);
        const valV = Math.sin(v * Math.PI * bumpsV);

        // Combine and map to 0-255
        let intensity = (valU * valV + 1) / 2;
        // Make bumps sharper
        intensity = Math.pow(intensity, 2) * 255;

        const idx = (i * size + j) * 4;
        data[idx] = intensity;     // r
        data[idx + 1] = intensity; // g
        data[idx + 2] = intensity; // b
        data[idx + 3] = 255;       // a
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Base rotation (slow idle rotation)
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.x += delta * 0.05;

    // Subtle breathing/floating effect
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

    // Parallax mouse interaction
    // Interpolate towards mouse position for smooth delay
    const targetRotationX = (mousePos.current.y * viewport.height) * 0.05;
    const targetRotationY = (mousePos.current.x * viewport.width) * 0.05;

    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.02;

    // Distort animation
    if (materialRef.current) {
        materialRef.current.distort = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group>
      {/* Dynamic lighting based on cursor could be added here by moving lights,
          but for performance and elegance, ambient + directional works best with the bump map */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#FF7B54" />
      <pointLight position={[0, 0, 5]} intensity={2} color="#6C35DE" distance={10} />

      <Sphere ref={meshRef} args={[2.5, 128, 128]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#3A1C71" // Deep purple base
          emissive="#1A0B35"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          bumpMap={bumpMap}
          bumpScale={0.08}
          distort={0.15}
          speed={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Outer glow aura */}
      <Sphere args={[2.8, 32, 32]}>
         <meshBasicMaterial
            color="#6C35DE"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
         />
      </Sphere>
    </group>
  );
}
