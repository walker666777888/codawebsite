"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";
import { useIsLowEndDevice } from "@/hooks/useIsLowEndDevice";

export default function HeroStatueLiquidPrism({
  className = "",
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLowTier = useIsLowEndDevice();
  const prefersReducedMotion = useReducedMotion();
  const disableHeavy = isLowTier || prefersReducedMotion;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || disableHeavy) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let mesh: THREE.Mesh | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let rafId: number;

    const mouse = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      speed: 0,
      lastX: 0.5,
      lastY: 0.5,
    };

    try {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load("/images/hero-statue.jpg", (tex) => {
        if (!scene || !renderer) return;

        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;

        const vertexShader = `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `;

        const fragmentShader = `
          uniform sampler2D uTexture;
          uniform vec2 uMouse;
          uniform float uTime;
          uniform float uIntensity;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            
            // Mouse distance and fluid wave calculation
            vec2 dir = uv - uMouse;
            float dist = length(dir);
            
            // Organic ripple & caustic refraction
            float wave = sin(dist * 18.0 - uTime * 2.5) * exp(-dist * 3.2) * uIntensity;
            float wave2 = cos(dist * 28.0 - uTime * 3.5) * exp(-dist * 4.5) * uIntensity * 0.6;
            
            vec2 displacedUv = uv + normalize(dir + 0.0001) * (wave + wave2) * 0.04;
            
            // Chromatic Dispersion (Prismatic RGB split)
            float chromaticOffset = (wave + 0.003) * 0.018 * uIntensity;
            float r = texture2D(uTexture, displacedUv + vec2(chromaticOffset, 0.0)).r;
            float g = texture2D(uTexture, displacedUv).g;
            float b = texture2D(uTexture, displacedUv - vec2(chromaticOffset, 0.0)).b;
            
            vec3 col = vec3(r, g, b);
            
            // Specular caustic glow centered on cursor
            float spot = pow(max(0.0, 1.0 - dist * 1.8), 2.5);
            vec3 orangeLight = vec3(1.0, 0.36, 0.0) * (spot * 0.35 + abs(wave) * 1.8);
            col += orangeLight;
            
            // Radial edge mask for seamless obsidian blending
            vec2 centerDist = (uv - vec2(0.5)) * vec2(1.1, 1.0);
            float mask = 1.0 - smoothstep(0.35, 0.48, length(centerDist));
            
            // Screen blend alpha
            float alpha = mask * max(col.r, max(col.g, col.b)) * 1.1;
            
            gl_FragColor = vec4(col, alpha);
          }
        `;

        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTexture: { value: tex },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uTime: { value: 0 },
            uIntensity: { value: 1.0 },
          },
          transparent: true,
          depthTest: false,
        });

        geometry = new THREE.PlaneGeometry(2, 2);
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        onResize();
      });

      const onResize = () => {
        if (!container || !renderer) return;
        const rect = container.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
      };

      window.addEventListener("resize", onResize);

      const onMouseMove = (e: MouseEvent) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        // Calculate mouse relative to container (0 to 1)
        mouse.targetX = (e.clientX - rect.left) / rect.width;
        mouse.targetY = 1.0 - (e.clientY - rect.top) / rect.height; // Invert Y for WebGL
      };

      const onMouseLeave = () => {
        mouse.targetX = 0.5;
        mouse.targetY = 0.5;
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);

      let lastTime = 0;
      const animate = (t: number) => {
        const delta = (t - lastTime) * 0.001;
        lastTime = t;

        // Smooth mouse lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        // Calculate cursor movement velocity
        const dx = mouse.x - mouse.lastX;
        const dy = mouse.y - mouse.lastY;
        const currentSpeed = Math.sqrt(dx * dx + dy * dy) * 50;
        mouse.speed += (currentSpeed - mouse.speed) * 0.1;
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;

        if (material) {
          material.uniforms.uTime.value = t * 0.001;
          material.uniforms.uMouse.value.set(mouse.x, mouse.y);
          material.uniforms.uIntensity.value = 0.7 + Math.min(mouse.speed, 2.5);
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }

        rafId = requestAnimationFrame(animate);
      };

      rafId = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
        cancelAnimationFrame(rafId);
        if (mesh && geometry) {
          geometry.dispose();
        }
        if (material) {
          material.dispose();
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn("WebGL prism init fallback:", err);
    }
  }, [disableHeavy]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`hidden md:flex absolute inset-0 z-[2] items-center justify-center pointer-events-none overflow-hidden select-none ${className}`}
    >
      {/* Background Volumetric Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-coda-accent/15 blur-[140px] pointer-events-none" />

      {/* WebGL Liquid Prism Canvas */}
      <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-[90vh] max-h-[860px] object-contain pointer-events-none transition-opacity duration-1000 ease-out"
          style={{ opacity: mounted ? 0.95 : 0 }}
        />
      </div>
    </div>
  );
}
