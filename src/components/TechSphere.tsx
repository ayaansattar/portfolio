"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type Technology = {
  name: string;
  logo: string;
};

type TechSphereProps = {
  technologies: Technology[];
};

function fibonacciSphere(count: number, radius: number) {
  if (count === 1) return [[0, radius, 0] as const];

  const points: Array<readonly [number, number, number]> = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    points.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }

  return points;
}

function TechLogo({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink/10 text-[10px] font-semibold text-ink">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={28}
      height={28}
      draggable={false}
      onError={() => setFailed(true)}
      className="h-7 w-7 object-contain"
    />
  );
}

function TechCloud({ technologies }: { technologies: Technology[] }) {
  const [frontIndex, setFrontIndex] = useState(0);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frontRef = useRef(0);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);

  const points = useMemo(
    () => fibonacciSphere(technologies.length, 2.35),
    [technologies.length],
  );

  useFrame(({ camera }) => {
    camera.getWorldDirection(camDir);

    let bestIndex = 0;
    let bestFacing = -Infinity;

    for (let i = 0; i < points.length; i += 1) {
      const [x, y, z] = points[i];
      worldPos.set(x, y, z);
      toCamera.copy(worldPos).sub(camera.position).normalize();
      const facing = toCamera.dot(camDir);

      const t = (facing + 1) / 2;
      const opacity = 0.22 + t * 0.78;
      const brightness = 0.35 + t * 0.65;

      const node = nodeRefs.current[i];
      if (node) {
        node.style.opacity = String(opacity);
        node.style.filter = `brightness(${brightness})`;
      }

      if (facing > bestFacing) {
        bestFacing = facing;
        bestIndex = i;
      }
    }

    if (bestIndex !== frontRef.current) {
      frontRef.current = bestIndex;
      setFrontIndex(bestIndex);
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshBasicMaterial
          color="#0f6b56"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {technologies.map((tech, index) => (
        <Html
          key={tech.name}
          position={points[index]}
          center
          transform
          sprite
          distanceFactor={8.5}
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
            className="flex w-14 flex-col items-center gap-0.5"
          >
            <TechLogo name={tech.name} src={tech.logo} />
            <span
              className={`min-h-4 text-center text-[10px] leading-tight font-medium tracking-wide text-ink transition-opacity duration-150 ${
                index === frontIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {tech.name}
            </span>
          </div>
        </Html>
      ))}
    </group>
  );
}

export function TechSphere({ technologies }: TechSphereProps) {
  return (
    <div className="relative mx-auto h-[min(70vw,28rem)] w-full max-w-3xl cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full touch-none"
      >
        <ambientLight intensity={1} />
        <TechCloud technologies={technologies} />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          autoRotate
          autoRotateSpeed={0.55}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI - 0.35}
        />
      </Canvas>
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-sm text-ink-soft">
        Drag to rotate
      </p>
    </div>
  );
}
