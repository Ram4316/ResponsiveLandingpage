"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface InteractiveOrbProps {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

export function InteractiveOrb({ mousePos }: InteractiveOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleMeshRef = useRef<THREE.InstancedMesh>(null);
  const innerGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const cursor = useRef(new THREE.Vector2(0, 0));
  const idleRotation = useRef(new THREE.Vector2(0, 0));
  const idleFloat = useRef(0);

  const particleCount = 900;
  const particleGeometry = useMemo(() => new THREE.SphereGeometry(0.11, 14, 14), []);
  const particleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#5E31D9",
        emissive: "#2B0E5F",
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.9,
        vertexColors: true,
      }),
    []
  );
  const particlePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const seededNoise = (seed: number) => {
      const value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const jitter = seededNoise(i + 1) - 0.5;
      const baseRadius = 2.35 + jitter * 0.18;
      positions.push(
        new THREE.Vector3(
          Math.cos(theta) * radius * baseRadius,
          y * baseRadius,
          Math.sin(theta) * radius * baseRadius
        )
      );
    }
    return positions;
  }, [particleCount]);

  useLayoutEffect(() => {
    if (!particleMeshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    particlePositions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.updateMatrix();
      particleMeshRef.current?.setMatrixAt(index, dummy.matrix);
      const hueShift = 0.04 * Math.sin(index * 0.37);
      color.setHSL(0.74 + hueShift, 0.68, 0.54);
      particleMeshRef.current?.setColorAt(index, color);
    });
    particleMeshRef.current.instanceMatrix.needsUpdate = true;
    if (particleMeshRef.current.instanceColor) {
      particleMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particlePositions]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

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

    const targetScale = 1 + cursorInfluence * 0.03;
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 6, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 6, delta);

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
        <instancedMesh ref={particleMeshRef} args={[particleGeometry, particleMaterial, particleCount]} />

        <Sphere args={[2.05, 64, 64]}>
          <meshStandardMaterial
            color="#2B0E5F"
            emissive="#1A063A"
            emissiveIntensity={0.4}
            roughness={0.4}
            metalness={0.7}
            transparent
            opacity={0.4}
          />
        </Sphere>

        <Sphere args={[2.1, 64, 64]}>
          <meshBasicMaterial
            ref={innerGlowRef}
            color="#8F5CFF"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Sphere>

        <Sphere args={[2.55, 64, 64]}>
          <meshPhysicalMaterial
            color="#3B1582"
            transparent
            opacity={0.2}
            roughness={0.35}
            metalness={0.85}
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
