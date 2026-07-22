export const coreVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPulse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPosition;
  varying float vDisplacement;

  void main() {
    float primaryWave = sin(position.y * 4.0 + uTime * 0.72);
    float crossWave = cos((position.x - position.z) * 5.0 - uTime * 0.48);
    float displacement = (primaryWave * 0.65 + crossWave * 0.35) * uMorph;
    displacement += sin(uTime * 1.6 + position.y * 2.0) * uPulse;

    vec3 transformed = position + normal * displacement;
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vPosition = worldPosition.xyz;
    vLocalPosition = transformed;
    vDisplacement = displacement;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const coreFragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uPaper;
  uniform float uTime;
  uniform float uMorph;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPosition;
  varying float vDisplacement;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float rim = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 2.4);
    float scan = smoothstep(0.72, 1.0, sin(vPosition.y * 16.0 - uTime * 0.9));
    float surface = max(dot(normalize(vNormal), normalize(vec3(-0.4, 0.8, 0.5))), 0.0);

    float fractureShadow = smoothstep(-0.18, 0.82, normalize(vNormal).x);
    float damage = smoothstep(0.025, 0.09, uMorph);
    float damagedSide = smoothstep(-0.18, 0.78, -vLocalPosition.x);
    float fractureField = sin(vLocalPosition.y * 17.0 + sin(vLocalPosition.z * 9.0) * 2.8)
      * cos(vLocalPosition.z * 13.0 - vLocalPosition.y * 4.0);
    float cutThreshold = mix(0.98, 0.2, damage * damagedSide);
    if (fractureField > cutThreshold) discard;

    vec3 base = mix(uPaper * 0.035, uAccent * 0.32, surface + abs(vDisplacement));
    vec3 color = base + uAccent * rim * 1.08 + uAccent * scan * 0.08;
    color *= mix(1.0, 0.46, fractureShadow);
    float alpha = 0.86 + rim * 0.14;

    gl_FragColor = vec4(color, alpha);
  }
`;
