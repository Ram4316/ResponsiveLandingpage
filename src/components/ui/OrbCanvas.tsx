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
        camera={{ position: [0, 0, 7.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Optimize for high DPI displays but cap at 2
      >
        <Environment preset="city" /> {/* Provides realistic glossy reflections */}
        <BurstParticles />
        <InteractiveOrb mousePos={mousePos} />
        <Preload all />
      </Canvas>
    </div>
  );
}

function BurstParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 520;
  const seedRef = useRef(124589);
  const particleTexture = useMemo(() => {
    const size = 96;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.35, "rgba(164,120,255,0.65)");
    gradient.addColorStop(0.65, "rgba(108,53,222,0.35)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
  const initialState = useMemo(() => {
    const positionArray = new Float32Array(particleCount * 3);
    const velocityArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const highlight = new THREE.Color("#B18CFF");
    const base = new THREE.Color("#5E31D9");
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
      const color = base.clone().lerp(highlight, mix);
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
    const maxRadius = 16;
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
        size={0.1}
        map={particleTexture ?? undefined}
        alphaMap={particleTexture ?? undefined}
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
