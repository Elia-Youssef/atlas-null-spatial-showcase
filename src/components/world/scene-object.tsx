"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { interpolateScenePreset } from "@/lib/scene-interpolation";
import { createSeededRandom } from "@/lib/random";
import type { QualityTier, ScenePreset } from "@/types";
import { coreFragmentShader, coreVertexShader } from "./core-shaders";

interface CoreUniforms extends Record<string, THREE.IUniform> {
  uTime: THREE.IUniform<number>;
  uMorph: THREE.IUniform<number>;
  uPulse: THREE.IUniform<number>;
  uAccent: THREE.IUniform<THREE.Color>;
  uPaper: THREE.IUniform<THREE.Color>;
}

interface RuntimeCoreMaterial extends THREE.ShaderMaterial {
  uniforms: CoreUniforms;
}

interface ShardSample {
  direction: THREE.Vector3;
  radius: number;
  rotation: THREE.Euler;
  scale: number;
  phase: number;
  tone: "accent" | "dark" | "paper";
}

interface ShardFieldProps {
  presetRef: RefObject<ScenePreset>;
  quality: QualityTier;
  seed: number;
  paused: boolean;
}

function createShardSamples(count: number, seed: number): ShardSample[] {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }, () => {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);

    return {
      direction: new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta),
      ),
      radius: 0.56 + random() * 0.64,
      rotation: new THREE.Euler(random() * Math.PI, random() * Math.PI, random() * Math.PI),
      scale: 0.035 + random() * 0.085,
      phase: random() * Math.PI * 2,
      tone: random() > 0.72 ? "dark" : random() > 0.86 ? "paper" : "accent",
    };
  });
}

function ShardField({ presetRef, quality, seed, paused }: ShardFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const helper = useMemo(() => new THREE.Object3D(), []);
  const count = quality === "full" ? 92 : 38;
  const samples = useMemo(() => createShardSamples(count, seed), [count, seed]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    samples.forEach((sample, index) => {
      const color =
        sample.tone === "dark"
          ? new THREE.Color("#101510")
          : sample.tone === "paper"
            ? new THREE.Color("#f2f0e8")
            : new THREE.Color("#c6ff32");
      mesh.setColorAt(index, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [samples]);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    const preset = presetRef.current;
    if (!mesh || !preset || paused) return;

    const time = clock.elapsedTime;
    samples.forEach((sample, index) => {
      const breathing = Math.sin(time * 0.35 + sample.phase) * 0.08;
      const distance = preset.object.spread * sample.radius + breathing;

      helper.position.copy(sample.direction).multiplyScalar(distance);
      if (preset.id === "index") {
        // The origin scene fractures toward the open right edge, matching the
        // editorial social composition while keeping the headline readable.
        helper.position.x = -Math.abs(helper.position.x) * 1.1 - 0.28;
        helper.position.y *= 0.82;
      }
      helper.rotation.set(
        sample.rotation.x + time * 0.08,
        sample.rotation.y + time * 0.12,
        sample.rotation.z + time * 0.06,
      );
      helper.scale.set(
        sample.scale,
        sample.scale * (2.4 + preset.object.morph * 3),
        sample.scale,
      );
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.y += delta * 0.025;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#25310e"
        emissiveIntensity={quality === "full" ? 0.42 : 0.22}
        roughness={0.42}
        metalness={0.62}
        vertexColors
      />
    </instancedMesh>
  );
}

interface ParticleFieldProps {
  count: number;
  seed: number;
  accent: string;
}

function ParticleField({ count, seed, accent }: ParticleFieldProps) {
  const positions = useMemo(() => {
    const random = createSeededRandom(seed + 91);
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const radius = 2.2 + random() * 3.8;
      const theta = random() * Math.PI * 2;
      const height = (random() - 0.5) * 5.5;

      values[offset] = Math.cos(theta) * radius;
      values[offset + 1] = height;
      values[offset + 2] = Math.sin(theta) * radius;
    }

    return values;
  }, [count, seed]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={accent}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

interface CameraRigProps {
  preset: ScenePreset;
  paused: boolean;
  revision: number;
}

function CameraRig({ preset, paused, revision }: CameraRigProps) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const activeCamera = cameraRef.current;
    if (!(activeCamera instanceof THREE.PerspectiveCamera)) return;

    activeCamera.position.fromArray(preset.camera.position);
    activeCamera.fov = preset.camera.fov;
    activeCamera.lookAt(target.fromArray(preset.camera.lookAt));
    activeCamera.updateProjectionMatrix();
  }, [preset, revision, target]);

  useFrame((_, delta) => {
    const activeCamera = cameraRef.current;
    if (!(activeCamera instanceof THREE.PerspectiveCamera) || paused) return;

    const damping = 1 - Math.exp(-delta * 2.8);
    activeCamera.position.lerp(target.fromArray(preset.camera.position), damping);
    activeCamera.fov = THREE.MathUtils.lerp(activeCamera.fov, preset.camera.fov, damping);
    activeCamera.lookAt(target.fromArray(preset.camera.lookAt));
    activeCamera.updateProjectionMatrix();
  });

  return null;
}

/** Props for the procedural sculpture rendered within `WorldCanvas`. */
export interface SceneObjectProps {
  preset: ScenePreset;
  quality: QualityTier;
  paused?: boolean;
  seed?: number;
  cameraRevision?: number;
}

/**
 * Renders the procedural core, orbital mechanisms, particles, and instanced shards.
 * It must be mounted inside a React Three Fiber canvas.
 */
export function SceneObject({
  preset,
  quality,
  paused = false,
  seed = 4_731,
  cameraRevision = 0,
}: SceneObjectProps) {
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const interpolatedPresetRef = useRef<ScenePreset>(preset);
  const materialRef = useRef<RuntimeCoreMaterial>(null);
  const targetAccentRef = useRef(new THREE.Color(preset.accent));
  const uniforms = useMemo<CoreUniforms>(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPulse: { value: 0 },
      uAccent: { value: new THREE.Color(preset.accent) },
      uPaper: { value: new THREE.Color("#f2f0e8") },
    }),
    [preset.accent],
  );
  const detail = quality === "full" ? 5 : 3;
  const particleCount =
    quality === "full"
      ? preset.particleCount
      : Math.max(24, Math.round(preset.particleCount * 0.38));

  useEffect(() => {
    targetAccentRef.current.set(preset.accent);
  }, [preset.accent]);

  useFrame(({ clock, pointer }, delta) => {
    const root = rootRef.current;
    const core = coreRef.current;
    const material = materialRef.current;
    if (!root || !core || !material || paused) return;

    const damping = 1 - Math.exp(-delta * 2.65);
    const current = interpolateScenePreset(interpolatedPresetRef.current, preset, damping);
    interpolatedPresetRef.current = current;

    root.position.fromArray(current.object.position);
    root.rotation.set(
      current.object.rotation[0] + pointer.y * 0.08,
      current.object.rotation[1] + pointer.x * 0.12,
      current.object.rotation[2],
    );
    root.scale.setScalar(current.object.scale);
    root.rotation.y += clock.elapsedTime * 0.025;

    const axisStretch = current.object.morph * 0.34;
    core.scale.set(1 - axisStretch * 0.32, 1 + axisStretch, 1);

    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMorph.value = current.object.morph * 0.22;
    material.uniforms.uPulse.value = 0.025 + current.object.morph * 0.045;
    material.uniforms.uAccent.value.lerp(targetAccentRef.current, damping);
  });

  if (quality === "static") return null;

  return (
    <>
      <CameraRig preset={preset} paused={paused} revision={cameraRevision} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[-3, 4, 5]} intensity={3.4} color="#f2f0e8" />
      <pointLight position={[3, -2, 2]} intensity={2.6} color={preset.accent} />
      <group ref={rootRef}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.9, detail]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={coreVertexShader}
            fragmentShader={coreFragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
            depthWrite
          />
        </mesh>
        <mesh scale={1.008} rotation={[0.08, -0.12, 0.04]}>
          <icosahedronGeometry args={[0.9, 2]} />
          <meshBasicMaterial color="#050706" transparent opacity={0.64} wireframe />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.008, 6, 160]} />
          <meshBasicMaterial color={preset.accent} transparent opacity={0.68} />
        </mesh>
        <mesh rotation={[0.85, 0.3, 0.45]}>
          <torusGeometry args={[1.42, 0.005, 6, 160]} />
          <meshBasicMaterial color="#f2f0e8" transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[0.2, 0.9, -0.6]}>
          <torusGeometry args={[1.64, 0.004, 6, 160]} />
          <meshBasicMaterial color={preset.accent} transparent opacity={0.22} />
        </mesh>
        <ShardField
          presetRef={interpolatedPresetRef}
          quality={quality}
          seed={seed}
          paused={paused}
        />
      </group>
      <ParticleField count={particleCount} seed={seed} accent={preset.accent} />
    </>
  );
}
