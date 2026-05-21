"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { InteractiveOrb } from "./InteractiveOrb";

export function OrbCanvas() {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Normalize mouse coordinates to -1 to 1
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const resetPointer = () => {
      mousePos.current.x = 0;
      mousePos.current.y = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    window.addEventListener("mouseleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
      window.removeEventListener("mouseleave", resetPointer);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <Environment preset="city" />
        <BurstParticles />
        <InteractiveOrb mousePos={mousePos} />
        <Preload all />
      </Canvas>
    </div>
  );
}

function BurstParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 700;
  const seedRef = useRef(124589);
  const particleTexture = useMemo(() => {
    const size = 64;
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x / (size - 1) * 2 - 1;
        const dy = y / (size - 1) * 2 - 1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, 1 - distance);
        const easedAlpha = Math.pow(alpha, 2.2);
        const index = (y * size + x) * 4;

        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = Math.floor(easedAlpha * 255);
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);
  const initialState = useMemo(() => {
    const positionArray = new Float32Array(particleCount * 3);
    const velocityArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const warm = new THREE.Color("#FF7B54");
    const cool = new THREE.Color("#6C35DE");
    const seededNoise = (seed: number) => {
      const value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };

    for (let i = 0; i < particleCount; i++) {
      const z = seededNoise(i + 1) * 2 - 1;
      const theta = seededNoise(i + 2) * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      const dirX = r * Math.cos(theta);
      const dirY = r * Math.sin(theta);
      const dirZ = z;
      const startRadius = THREE.MathUtils.lerp(1.6, 3.2, seededNoise(i + 3));
      const speed = THREE.MathUtils.lerp(0.6, 1.5, seededNoise(i + 4));

      const idx = i * 3;
      positionArray[idx] = dirX * startRadius;
      positionArray[idx + 1] = dirY * startRadius;
      positionArray[idx + 2] = dirZ * startRadius;
      velocityArray[idx] = dirX * speed;
      velocityArray[idx + 1] = dirY * speed;
      velocityArray[idx + 2] = dirZ * speed;

      const mix = seededNoise(i + 5);
      const color = cool.clone().lerp(warm, mix);
      colorArray[idx] = color.r;
      colorArray[idx + 1] = color.g;
      colorArray[idx + 2] = color.b;
    }

    return { positions: positionArray, velocities: velocityArray, colors: colorArray };
  }, [particleCount]);
  const velocitiesRef = useRef(initialState.velocities);
  const geometry = useMemo(() => {
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(initialState.positions, 3));
    bufferGeometry.setAttribute("color", new THREE.BufferAttribute(initialState.colors, 3));
    return bufferGeometry;
  }, [initialState.colors, initialState.positions]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const positionAttribute = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positionAttribute.array as Float32Array;
    const velocities = velocitiesRef.current;
    const maxRadius = 14;
    const nextRandom = () => {
      const next = (seedRef.current * 1664525 + 1013904223) >>> 0;
      seedRef.current = next;
      return next / 4294967296;
    };

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      array[idx] += velocities[idx] * delta;
      array[idx + 1] += velocities[idx + 1] * delta;
      array[idx + 2] += velocities[idx + 2] * delta;

      const x = array[idx];
      const y = array[idx + 1];
      const z = array[idx + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      if (dist > maxRadius) {
        const randZ = nextRandom() * 2 - 1;
        const theta = nextRandom() * Math.PI * 2;
        const r = Math.sqrt(1 - randZ * randZ);
        const dirX = r * Math.cos(theta);
        const dirY = r * Math.sin(theta);
        const dirZ = randZ;
        const startRadius = THREE.MathUtils.lerp(1.4, 2.8, nextRandom());
        const speed = THREE.MathUtils.lerp(0.6, 1.5, nextRandom());

        array[idx] = dirX * startRadius;
        array[idx + 1] = dirY * startRadius;
        array[idx + 2] = dirZ * startRadius;
        velocities[idx] = dirX * speed;
        velocities[idx + 1] = dirY * speed;
        velocities[idx + 2] = dirZ * speed;
      }
    }

    positionAttribute.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geometry} scale={[1.2, 1.2, 1.2]}>
      <pointsMaterial
        size={0.07}
        map={particleTexture}
        vertexColors
        transparent
        alphaTest={0.1}
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
