/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from 'react';
import './LightPillar.css';

/* ─────────────────────────────────────────────────────────────────
   Light pillar — a single full-screen ray-marched fragment shader.

   Previously rendered through three.js, which shipped ~520 KB (129 KB
   gzipped) of 3D engine to phones just to draw one quad. This is the same
   shader on raw WebGL2, reproducing what three.js did around it so the
   output is pixel-identical:
     • WebGL2 / GLSL ES 3.00 (the shader uses tanh, which needs it)
     • hex colours converted sRGB → linear, as THREE.Color does
     • no output colour conversion (ShaderMaterial without colorspace include)
     • canvas sized at CSS size × pixelRatio, display:block
───────────────────────────────────────────────────────────────── */

/** sRGB hex → linear RGB (THREE.Color + ColorManagement semantics). */
function hexToLinear(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s < 0.04045 ? s * 0.0773993808 : Math.pow(s * 0.9478672986 + 0.0521327014, 2.4);
  };
  return [toLinear((n >> 16) & 255), toLinear((n >> 8) & 255), toLinear(n & 255)];
}

const VERTEX_SHADER = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = (precision: string, stepMultiplier: number, iterations: number, waveIterations: number) => `#version 300 es
precision ${precision} float;
precision ${precision} int;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uIntensity;
uniform bool uInteractive;
uniform float uGlowAmount;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform float uNoiseIntensity;
uniform float uRotCos;
uniform float uRotSin;
uniform float uPillarRotCos;
uniform float uPillarRotSin;
uniform float uWaveSin;
uniform float uWaveCos;
in vec2 vUv;
layout(location = 0) out highp vec4 fragColor;

const float STEP_MULT = ${stepMultiplier.toFixed(1)};
const int MAX_ITER = ${iterations};
const int WAVE_ITER = ${waveIterations};

void main() {
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
  uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

  vec3 ro = vec3(0.0, 0.0, -10.0);
  vec3 rd = normalize(vec3(uv, 1.0));

  float rotC = uRotCos;
  float rotS = uRotSin;
  if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
    float a = uMouse.x * 6.283185;
    rotC = cos(a);
    rotS = sin(a);
  }

  vec3 col = vec3(0.0);
  float t = 0.1;

  for(int i = 0; i < MAX_ITER; i++) {
    vec3 p = ro + rd * t;
    p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

    vec3 q = p;
    q.y = p.y * uPillarHeight + uTime;

    float freq = 1.0;
    float amp = 1.0;
    for(int j = 0; j < WAVE_ITER; j++) {
      q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    float d = length(cos(q.xz)) - 0.2;
    float bound = length(p.xz) - uPillarWidth;
    float k = 4.0;
    float h = max(k - abs(d - bound), 0.0);
    d = max(d, bound) + h * h * 0.0625 / k;
    d = abs(d) * 0.15 + 0.01;

    float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
    col += mix(uBottomColor, uTopColor, grad) / d;

    t += d * STEP_MULT;
    if(t > 50.0) break;
  }

  float widthNorm = uPillarWidth / 3.0;
  col = tanh(col * uGlowAmount / widthNorm);

  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;

  fragColor = vec4(col * uIntensity, 1.0);
}
`;

const LightPillar = ({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = '',
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = 'screen',
  pillarRotation = 0,
  quality = 'high'
}: {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: string;
  pillarRotation?: number;
  quality?: 'low' | 'medium' | 'high';
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationSpeedRef = useRef(rotationSpeed);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webGLSupported) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    let effectiveQuality = quality;
    if (isLowEndDevice && quality === 'high') effectiveQuality = 'medium';
    if (isMobile && quality !== 'low') effectiveQuality = 'low';

    const qualitySettings = {
      low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
      medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
      high: {
        iterations: 80,
        waveIterations: 4,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        precision: 'highp',
        stepMultiplier: 1.0
      }
    } as const;
    const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: effectiveQuality === 'high' ? 'high-performance' : 'low-power',
    });
    if (!gl) {
      setWebGLSupported(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(
      gl.FRAGMENT_SHADER,
      fragmentShader(settings.precision, settings.stepMultiplier, settings.iterations, settings.waveIterations)
    );
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'position');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('LightPillar shader error:', gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(program));
      setWebGLSupported(false);
      return;
    }
    gl.useProgram(program);

    // Full-screen quad (same coverage as THREE.PlaneGeometry(2, 2))
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uTime = u('uTime');
    const uResolution = u('uResolution');
    const uRotCos = u('uRotCos');
    const uRotSin = u('uRotSin');
    const uMouse = u('uMouse');

    const pillarRotRad = (pillarRotation * Math.PI) / 180;
    gl.uniform3fv(u('uTopColor'), hexToLinear(topColor));
    gl.uniform3fv(u('uBottomColor'), hexToLinear(bottomColor));
    gl.uniform1f(u('uIntensity'), intensity);
    gl.uniform1i(u('uInteractive'), interactive ? 1 : 0);
    gl.uniform1f(u('uGlowAmount'), glowAmount);
    gl.uniform1f(u('uPillarWidth'), pillarWidth);
    gl.uniform1f(u('uPillarHeight'), pillarHeight);
    gl.uniform1f(u('uNoiseIntensity'), noiseIntensity);
    gl.uniform1f(uRotCos, 1.0);
    gl.uniform1f(uRotSin, 0.0);
    gl.uniform1f(u('uPillarRotCos'), Math.cos(pillarRotRad));
    gl.uniform1f(u('uPillarRotSin'), Math.sin(pillarRotRad));
    gl.uniform1f(u('uWaveSin'), Math.sin(0.4));
    gl.uniform1f(u('uWaveCos'), Math.cos(0.4));
    gl.uniform2f(uMouse, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    // Mirrors WebGLRenderer.setSize + setPixelRatio
    const setSize = (w: number, h: number) => {
      canvas.width = Math.floor(w * settings.pixelRatio);
      canvas.height = Math.floor(h * settings.pixelRatio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      // three.js rounds the viewport (while flooring the canvas) — keep that
      gl.viewport(0, 0, Math.round(w * settings.pixelRatio), Math.round(h * settings.pixelRatio));
      gl.uniform2f(uResolution, w, h);
    };
    setSize(container.clientWidth, container.clientHeight);
    container.appendChild(canvas);

    let mouseMoveTimeout: number | null = null;
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = window.setTimeout(() => {
        mouseMoveTimeout = null;
      }, 16);
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      gl.uniform2f(uMouse, x, y);
    };
    const handleMouseMove = (event: MouseEvent) => handlePointerMove(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
    };
    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchstart', handleTouchMove, { passive: true });
    }

    let time = 0;
    let rafId: number | null = null;
    let lastTime = performance.now();
    const targetFPS = effectiveQuality === 'low' ? 30 : 60;
    const frameTime = 1000 / targetFPS;

    let isVisible = true;
    const animate = (currentTime: number) => {
      if (!isVisible) return;
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= frameTime) {
        time += 0.016 * rotationSpeedRef.current;
        gl.uniform1f(uTime, time);
        gl.uniform1f(uRotCos, Math.cos(time * 0.3));
        gl.uniform1f(uRotSin, Math.sin(time * 0.3));
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        lastTime = currentTime - (deltaTime % frameTime);
      }
      rafId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (isVisible) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    }, { threshold: 0 });
    observer.observe(container);

    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => setSize(container.clientWidth, container.clientHeight), 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchstart', handleTouchMove);
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, [webGLSupported, quality, interactive, topColor, bottomColor, intensity, glowAmount, pillarWidth, pillarHeight, noiseIntensity, pillarRotation]);

  if (!webGLSupported) {
    return (
      <div className={`light-pillar-fallback ${className}`} style={{ mixBlendMode: mixBlendMode as any }}>
        WebGL not supported
      </div>
    );
  }

  return <div ref={containerRef} className={`light-pillar-container ${className}`} style={{ mixBlendMode: mixBlendMode as any }} />;
};

export default LightPillar;
