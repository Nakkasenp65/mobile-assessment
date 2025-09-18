"use client";
import { useRef, useState } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// =================================================================
// [THE CORE: Generative Shader Material]
// Silas's logic: Define the shader using drei's helper.
// This creates a reusable material component.
// =================================================================
const WaveShaderMaterial = shaderMaterial(
  // Uniforms: Variables passed from React to the GPU shader
  {
    uTime: 0,
    uColorA: new THREE.Color("#FFFFFF"), // Pink
    uColorB: new THREE.Color("#FFFFEE"), // Orange
  },
  // Vertex Shader: Positions the vertices of our plane
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader: Calculates the color of each pixel
  // Aria's artistry: This is where the magic happens!
  `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;

    // A simple noise function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      // Create a flowing, distorted coordinate system using time
      vec2 distortedUv = vec2(
        vUv.x + sin(vUv.y * 10.0 + uTime * 0.5) * 0.1,
        vUv.y + cos(vUv.x * 8.0 + uTime * 0.8) * 0.1
      );
      
      // Mix the two colors based on the distorted coordinates
      float mixFactor = (sin(distortedUv.y * 5.0 + uTime) + 1.0) / 2.0;
      vec3 mixedColor = mix(uColorA, uColorB, mixFactor);

      // Add a subtle grain/noise for texture
      float noise = (random(vUv * uTime) - 0.5) * 0.15;

      gl_FragColor = vec4(mixedColor + noise, 1.0);
    }
  `,
);

// Make the shader material available as a JSX component
extend({ WaveShaderMaterial });

// =================================================================
// [The Main Scene Component]
// =================================================================
function GenerativeBackground() {
  const shaderRef = useRef<{ uTime: number }>(null);

  // Update the 'uTime' uniform on every frame
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      {/* A plane that fills the entire viewport */}
      <planeGeometry args={[10, 10]} />
      {/* @ts-ignore */}
      <waveShaderMaterial ref={shaderRef} />
    </mesh>
  );
}

// =================================================================
// [The Canvas Wrapper]
// =================================================================
export const PhoneScene = () => {
  return (
    <div className="bg-background absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1.5], fov: 50 }}>
        {/* 
          Kaia's insight: No complex lighting or controls needed.
          The background should be beautiful but unobtrusive.
          It exists purely to create a mood.
        */}
        <GenerativeBackground />
      </Canvas>
    </div>
  );
};
