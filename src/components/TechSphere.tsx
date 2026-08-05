"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";

type TechSphereProps = {
  technologies: string[];
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

function TechCloud({ technologies }: { technologies: string[] }) {
  const points = useMemo(
    () => fibonacciSphere(technologies.length, 2.35),
    [technologies.length],
  );

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
          key={tech}
          position={points[index]}
          center
          transform
          sprite
          distanceFactor={7.5}
          style={{ pointerEvents: "none" }}
        >
          <span className="select-none whitespace-nowrap text-sm font-medium tracking-wide text-ink sm:text-base">
            {tech}
          </span>
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
