"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface InteractiveOrbProps {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

export function InteractiveOrb({ mousePos }: InteractiveOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null); // keeping as any due to internal drei material typing issues
  const innerGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const cursor = useRef(new THREE.Vector2(0, 0));
  const idleRotation = useRef(new THREE.Vector2(0, 0));
  const idleFloat = useRef(0);

  // Create bump map programmatically for the cellular look
  const bumpMap = useMemo(() => {
    const size = 512;
    const data = new Uint8Array(size * size * 4);
    const fract = (value: number) => value - Math.floor(value);
    const points = Array.from({ length: 60 }, (_, index) => {
      const seed = index * 12.9898;
      return {
        x: fract(Math.sin(seed) * 43758.5453),
        y: fract(Math.sin(seed + 78.233) * 43758.5453),
      };
    });

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const u = i / size;
        const v = j / size;

        let minDist = 1;
        for (const point of points) {
          const dx = u - point.x;
          const dy = v - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) minDist = dist;
        }

        const cell = 1 - THREE.MathUtils.clamp(minDist * 6, 0, 1);
        const ridges = Math.sin(u * Math.PI * 2 * 32 + Math.sin(v * Math.PI * 2 * 6)) * 0.5 + 0.5;
        const micro = Math.sin((u + v) * Math.PI * 2 * 80) * 0.5 + 0.5;

        let intensity = cell * 0.6 + Math.pow(ridges, 2) * 0.3 + micro * 0.1;
        intensity = Math.min(1, Math.pow(intensity, 1.4));
        const value = Math.floor(intensity * 255);

        const idx = (i * size + j) * 4;
        data[idx] = value; // r
        data[idx + 1] = value; // g
        data[idx + 2] = value; // b
        data[idx + 3] = 255; // a
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    cursor.current.x = THREE.MathUtils.damp(cursor.current.x, mousePos.current.x, 7, delta);
    cursor.current.y = THREE.MathUtils.damp(cursor.current.y, mousePos.current.y, 7, delta);

    const cursorDistance = Math.sqrt(cursor.current.x ** 2 + cursor.current.y ** 2);
    const cursorInfluence = THREE.MathUtils.clamp(1 - cursorDistance, 0, 1);

    idleRotation.current.x += delta * 0.12;
    idleRotation.current.y += delta * 0.18;
    idleFloat.current = Math.sin(state.clock.elapsedTime * 0.7) * 0.18;

    const targetRotationX = idleRotation.current.x + cursor.current.y * 0.75;
    const targetRotationY = idleRotation.current.y + cursor.current.x * 0.95;
    const targetRotationZ = -cursor.current.x * 0.25;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotationX,
      8,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      8,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotationZ,
      8,
      delta
    );

    const targetPosX = cursor.current.x * 0.6;
    const targetPosY = idleFloat.current + cursor.current.y * 0.45;
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 6, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY, 6, delta);

    const targetScale = 1 + cursorInfluence * 0.05;
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 6, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 6, delta);

    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.damp(
        materialRef.current.distort,
        0.22 + cursorInfluence * 0.1,
        6,
        delta
      );
      materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        materialRef.current.emissiveIntensity,
        0.35 + cursorInfluence * 0.7,
        6,
        delta
      );
    }

    if (innerGlowRef.current) {
      innerGlowRef.current.opacity = THREE.MathUtils.damp(
        innerGlowRef.current.opacity,
        0.25 + cursorInfluence * 0.25,
        6,
        delta
      );
    }

    if (outerGlowRef.current) {
      outerGlowRef.current.opacity = THREE.MathUtils.damp(
        outerGlowRef.current.opacity,
        0.08 + cursorInfluence * 0.2,
        6,
        delta
      );
    }

    if (keyLightRef.current) {
      keyLightRef.current.position.set(
        6 + cursor.current.x * 4,
        6 + cursor.current.y * 3,
        8
      );
      keyLightRef.current.intensity = 2.4 + cursorInfluence * 1.2;
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.set(
        -6 - cursor.current.x * 3,
        4 + cursor.current.y * 2,
        -6
      );
      rimLightRef.current.intensity = 1.4 + cursorInfluence * 0.8;
    }

    if (fillLightRef.current) {
      fillLightRef.current.position.set(
        cursor.current.x * 2,
        cursor.current.y * 2,
        6
      );
      fillLightRef.current.intensity = 1.6 + cursorInfluence * 1.1;
    }

    if (spotLightRef.current) {
      spotLightRef.current.position.set(
        cursor.current.x * 2,
        6 + cursor.current.y * 3,
        7
      );
      spotLightRef.current.intensity = 1.2 + cursorInfluence * 0.9;
      spotLightRef.current.target.position.set(
        cursor.current.x * 1.8,
        cursor.current.y * 1.2,
        0
      );
      spotLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <group>
      <ambientLight intensity={0.35} />
      <directionalLight ref={keyLightRef} position={[6, 6, 8]} intensity={2.6} color="#ffffff" />
      <directionalLight ref={rimLightRef} position={[-6, 4, -6]} intensity={1.4} color="#FF7B54" />
      <pointLight ref={fillLightRef} position={[0, 0, 6]} intensity={2} color="#7C4DFF" distance={12} />
      <spotLight
        ref={spotLightRef}
        position={[0, 6, 7]}
        angle={0.45}
        penumbra={0.6}
        intensity={1.6}
        color="#6C35DE"
      />

      <group ref={groupRef}>
        <Sphere ref={meshRef} args={[2.45, 192, 192]}>
          <MeshDistortMaterial
            ref={materialRef}
            color="#2B0E5F"
            emissive="#200A43"
            emissiveIntensity={0.4}
            roughness={0.12}
            metalness={1}
            bumpMap={bumpMap}
            bumpScale={0.16}
            displacementMap={bumpMap}
            displacementScale={0.08}
            distort={0.22}
            speed={2.1}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </Sphere>

        <Sphere args={[2.1, 64, 64]}>
          <meshBasicMaterial
            ref={innerGlowRef}
            color="#8F5CFF"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Sphere>

        <Sphere args={[2.7, 64, 64]}>
          <meshPhysicalMaterial
            color="#3B1582"
            transparent
            opacity={0.18}
            roughness={0.3}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.15}
            transmission={0.35}
            thickness={0.8}
          />
        </Sphere>
      </group>

      <Sphere args={[3.1, 64, 64]}>
        <meshBasicMaterial
          ref={outerGlowRef}
          color="#6C35DE"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}
