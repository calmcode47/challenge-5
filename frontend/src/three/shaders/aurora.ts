/**
 * GLSL vertex shader for fullscreen quad aurora backdrop.
 */
export const auroraVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * GLSL fragment shader computing procedural domain-warped noise aurora lighting.
 * Output colors are deliberately attenuated (col *= 0.28) ensuring body text
 * maintains AAA/AA contrast against background dark luminance (M04 / M07-A7).
 */
export const auroraFragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec2 uRes;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  float t = uTime * 0.04;
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 3.7));
  float n = fbm(p * 1.2 + q * 1.6 + uScroll * 0.6);
  vec3 col = mix(uA, uB, smoothstep(0.2, 0.8, n));
  col = mix(col, uC, smoothstep(0.55, 1.0, q.x) * 0.55);
  col *= 0.28;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;
