"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { InteractiveOrb } from "./InteractiveOrb";
import { useEffect, useRef } from "react";

export function OrbCanvas() {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to 1
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Optimize for high DPI displays but cap at 2
      >
        <Environment preset="city" /> {/* Provides realistic glossy reflections */}
        <InteractiveOrb mousePos={mousePos} />
        <Preload all />
      </Canvas>
    </div>
  );
}
