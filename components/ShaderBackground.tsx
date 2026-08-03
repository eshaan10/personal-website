"use client";

import { useEffect, useRef } from "react";
import type { Accent } from "@/lib/projects";

/**
 * Fragment-shader ambient background. Raw WebGL1 — no three.js, ogl, or regl,
 * so this adds zero dependencies.
 *
 * Same visual language as the CSS blobs it replaces: two soft glows, slow
 * non-synced drift, subtle mouse pull. The shader adds fbm noise to the
 * distance field so the edges churn organically instead of staying perfect
 * circles, which is the one thing CSS radial gradients cannot do.
 *
 * Any failure — no context, compile error, link error, lost context — calls
 * `onError` so the parent can swap in the CSS version.
 */

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `
// The hash below multiplies by ~43758.5, which loses enough precision under
// mediump to produce visible banding on mobile GPUs. Take highp where the
// device offers it.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Periods are deliberately non-integer multiples of each other so the two
  // glows never fall into sync. Amplitudes are wide and the rates are slow:
  // the drift should be plainly visible without ever looking fast.
  vec2 centerA = vec2(
    0.30 * aspect + 0.26 * sin(uTime * 0.107),
    0.76 + 0.20 * cos(uTime * 0.083)
  );
  vec2 centerB = vec2(
    0.82 * aspect + 0.24 * cos(uTime * 0.067),
    0.32 + 0.22 * sin(uTime * 0.094)
  );

  // Opposed pull, different magnitudes — matches the CSS version's behaviour.
  centerA += uMouse * vec2(0.06 * aspect, 0.06);
  centerB -= uMouse * vec2(0.04 * aspect, 0.04);

  float n = fbm(p * 2.1 + uTime * 0.02);

  float distA = distance(p, centerA) + (n - 0.5) * 0.11;
  float distB = distance(p, centerB) + (n - 0.5) * 0.09;

  float glowA = smoothstep(0.62, 0.0, distA);
  float glowB = smoothstep(0.54, 0.0, distB);

  float intensityA = glowA * 0.20;
  float intensityB = glowB * 0.14;

  vec3 sum = uColorA * intensityA + uColorB * intensityB;
  float alpha = clamp(intensityA + intensityB, 0.0, 1.0);

  // Premultiplied — matches the context's premultipliedAlpha: true.
  gl_FragColor = vec4(sum, alpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[shader] compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderBackground({
  accent,
  onError,
}: {
  accent: Accent;
  onError: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Held in a ref so an accent change doesn't tear down the GL context.
  const accentRef = useRef(accent);
  accentRef.current = accent;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) {
      onErrorRef.current();
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram();

    if (!vertex || !fragment || !program) {
      onErrorRef.current();
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[shader] link failed:", gl.getProgramInfoLog(program));
      onErrorRef.current();
      return;
    }

    gl.useProgram(program);

    // One oversized triangle covers the viewport with fewer vertices and no
    // seam down the diagonal that two triangles would introduce.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uColorA = gl.getUniformLocation(program, "uColorA");
    const uColorB = gl.getUniformLocation(program, "uColorB");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      // Capped DPR: this is a soft blurry gradient, so rendering it at 3x on a
      // phone costs real battery for pixels nobody can distinguish.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    resize();

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = 1 - (event.clientY / window.innerHeight) * 2;
    };

    // Current colours, lerped toward the accent so page changes cross-fade.
    const current = {
      a: [...accentRef.current.a] as number[],
      b: [...accentRef.current.b] as number[],
    };

    const start = performance.now();
    let frame = 0;

    const render = () => {
      resize();

      const target = accentRef.current;
      for (let i = 0; i < 3; i++) {
        current.a[i] += (target.a[i] - current.a[i]) * 0.035;
        current.b[i] += (target.b[i] - current.b[i]) * 0.035;
      }

      mouseX += (targetMouseX - mouseX) * 0.025;
      mouseY += (targetMouseY - mouseY) * 0.025;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform3f(
        uColorA,
        current.a[0] / 255,
        current.a[1] / 255,
        current.a[2] / 255,
      );
      gl.uniform3f(
        uColorB,
        current.b[0] / 255,
        current.b[1] / 255,
        current.b[2] / 255,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      frame = requestAnimationFrame(render);
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      onErrorRef.current();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-print-hide
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
