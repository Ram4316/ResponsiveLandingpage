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
  const edgeParticleMeshRef = useRef<THREE.InstancedMesh>(null);
  const innerGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const cursor = useRef(new THREE.Vector2(0, 0));
  const idleRotation = useRef(new THREE.Vector2(0, 0));
  const idleFloat = useRef(0);

  const particleCount = 760;
  const particleGeometry = useMemo(() => new THREE.SphereGeometry(0.085, 14, 14), []);
  const particleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8F5CFF",
        emissive: "#311169",
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.65,
        transparent: true,
        opacity: 0.9,
        vertexColors: true,
      }),
    []
  );
  const edgeParticleCount = 180;
  const edgeParticleGeometry = useMemo(() => new THREE.SphereGeometry(0.045, 12, 12), []);
  const edgeParticleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#B084FF",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );
  const edgeParticleDummy = useMemo(() => new THREE.Object3D(), []);
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
      const baseRadius = 2.3 + jitter * 0.16;
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
  const edgeParticleData = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const directions: THREE.Vector3[] = [];
    const offsets: number[] = [];
    const phases: number[] = [];
    const seededNoise = (seed: number) => {
      const value = Math.sin(seed * 31.412) * 43758.5453;
      return value - Math.floor(value);
    };
    for (let i = 0; i < edgeParticleCount; i++) {
      const z = seededNoise(i + 1) * 2 - 1;
      const theta = seededNoise(i + 2) * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      const dir = new THREE.Vector3(r * Math.cos(theta), z, r * Math.sin(theta));
      dir.normalize();
      const radius = 2.25 + seededNoise(i + 3) * 0.28;
      positions.push(dir.clone().multiplyScalar(radius));
      directions.push(dir);
      offsets.push(seededNoise(i + 4) * 0.18);
      phases.push(seededNoise(i + 5) * Math.PI * 2);
    }
    return { positions, directions, offsets, phases };
  }, []);

  useLayoutEffect(() => {
    if (!particleMeshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    particlePositions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.updateMatrix();
      particleMeshRef.current?.setMatrixAt(index, dummy.matrix);
      const hueShift = 0.02 * Math.sin(index * 0.37);
      color.setHSL(0.74 + hueShift, 0.72, 0.58);
      particleMeshRef.current?.setColorAt(index, color);
    });
    particleMeshRef.current.instanceMatrix.needsUpdate = true;
    if (particleMeshRef.current.instanceColor) {
      particleMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particlePositions]);
  useLayoutEffect(() => {
    if (!edgeParticleMeshRef.current) return;
    const dummy = new THREE.Object3D();
    edgeParticleData.positions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.updateMatrix();
      edgeParticleMeshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    edgeParticleMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [edgeParticleData]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    cursor.current.x = THREE.MathUtils.damp(cursor.current.x, mousePos.current.x, 7, delta);
    cursor.current.y = THREE.MathUtils.damp(cursor.current.y, mousePos.current.y, 7, delta);

    const cursorDistance = Math.sqrt(cursor.current.x ** 2 + cursor.current.y ** 2);
    const cursorInfluence = THREE.MathUtils.clamp(1 - cursorDistance * 0.9, 0, 1);
    const cursorFocus = Math.pow(cursorInfluence, 1.35);

    idleRotation.current.x += delta * 0.12;
    idleRotation.current.y += delta * 0.18;
    idleFloat.current = Math.sin(state.clock.elapsedTime * 0.7) * 0.18;

    const targetRotationX = idleRotation.current.x + cursor.current.y * 0.9;
    const targetRotationY = idleRotation.current.y + cursor.current.x * 1.05;
    const targetRotationZ = -cursor.current.x * 0.3;

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

    const targetPosX = cursor.current.x * 0.65;
    const targetPosY = idleFloat.current + cursor.current.y * 0.5;
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 6, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY, 6, delta);

    const targetScale = 1 + cursorFocus * 0.04;
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 6, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 6, delta);

    if (innerGlowRef.current) {
      innerGlowRef.current.opacity = THREE.MathUtils.damp(
        innerGlowRef.current.opacity,
        0.28 + cursorFocus * 0.32,
        6,
        delta
      );
    }

    if (outerGlowRef.current) {
      outerGlowRef.current.opacity = THREE.MathUtils.damp(
        outerGlowRef.current.opacity,
        0.1 + cursorFocus * 0.25,
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
      keyLightRef.current.intensity = 2.6 + cursorFocus * 1.6;
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.set(
        -6 - cursor.current.x * 3,
        4 + cursor.current.y * 2,
        -6
      );
      rimLightRef.current.intensity = 1.6 + cursorFocus * 1.1;
    }

    if (fillLightRef.current) {
      fillLightRef.current.position.set(
        cursor.current.x * 2,
        cursor.current.y * 2,
        6
      );
      fillLightRef.current.intensity = 1.8 + cursorFocus * 1.2;
    }

    if (spotLightRef.current) {
      spotLightRef.current.position.set(
        cursor.current.x * 2,
        6 + cursor.current.y * 3,
        7
      );
      spotLightRef.current.intensity = 1.4 + cursorFocus * 1.1;
      spotLightRef.current.target.position.set(
        cursor.current.x * 1.8,
        cursor.current.y * 1.2,
        0
      );
      spotLightRef.current.target.updateMatrixWorld();
    }

    if (edgeParticleMeshRef.current) {
      const time = state.clock.elapsedTime;
      edgeParticleData.positions.forEach((base, index) => {
        const phase = edgeParticleData.phases[index];
        const drift = Math.sin(time * 0.7 + phase) * 0.12 + Math.sin(time * 0.35 + phase * 1.3) * 0.06;
        const separation = 1 + drift + cursorFocus * 0.08;
        const direction = edgeParticleData.directions[index];
        const offset = edgeParticleData.offsets[index];
        edgeParticleDummy.position
          .copy(direction)
          .multiplyScalar((base.length() + offset) * separation);
        edgeParticleDummy.updateMatrix();
        edgeParticleMeshRef.current?.setMatrixAt(index, edgeParticleDummy.matrix);
      });
      edgeParticleMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight ref={keyLightRef} position={[6, 6, 8]} intensity={2.6} color="#ffffff" />
      <directionalLight ref={rimLightRef} position={[-6, 4, -6]} intensity={1.6} color="#B18CFF" />
      <pointLight ref={fillLightRef} position={[0, 0, 6]} intensity={2.1} color="#7C4DFF" distance={12} />
      <spotLight
        ref={spotLightRef}
        position={[0, 6, 7]}
        angle={0.45}
        penumbra={0.6}
        intensity={1.8}
        color="#6C35DE"
      />

      <group ref={groupRef}>
        <instancedMesh ref={particleMeshRef} args={[particleGeometry, particleMaterial, particleCount]} />
        <instancedMesh
          ref={edgeParticleMeshRef}
          args={[edgeParticleGeometry, edgeParticleMaterial, edgeParticleCount]}
        />

        <Sphere args={[2.05, 64, 64]}>
          <meshStandardMaterial
            color="#2B0E5F"
            emissive="#2A0E5C"
            emissiveIntensity={0.5}
            roughness={0.32}
            metalness={0.75}
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
            opacity={0.22}
            roughness={0.22}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.4}
            thickness={0.9}
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
