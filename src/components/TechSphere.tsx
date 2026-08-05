"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type Technology = {
  name: string;
  logo: string;
};

type TechSphereProps = {
  technologies: Technology[];
  assemble?: boolean;
};

const SPHERE_RADIUS = 2.35;
const START_RADIUS = SPHERE_RADIUS * 3.6;
const HOVER_RADIUS_PX = 44;
const DRAG_SPEED = 0.0055;
const AUTO_SPIN = 0.07;
const ASSEMBLE_STAGGER = 0.09;
const ASSEMBLE_DURATION = 1.15;

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

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function TechLogo({ name, src }: { name: string; src: string }) {
  const failedRef = useRef(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={20}
      height={20}
      draggable={false}
      onError={(event) => {
        if (failedRef.current) return;
        failedRef.current = true;
        const img = event.currentTarget;
        img.style.display = "none";
        const fallback = document.createElement("div");
        fallback.className =
          "flex h-5 w-5 items-center justify-center rounded-md bg-ink/10 text-[9px] font-semibold text-ink";
        fallback.textContent = name.charAt(0);
        img.parentElement?.appendChild(fallback);
      }}
      className="h-5 w-5 object-contain"
    />
  );
}

function TechCloud({
  technologies,
  assemble,
}: {
  technologies: Technology[];
  assemble: boolean;
}) {
  const { camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const itemRefs = useRef<Array<THREE.Group | null>>([]);
  const wireRef = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hoveredRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const assembleTime = useRef(0);
  const assembledRef = useRef(false);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    inside: false,
    buttons: 0,
  });

  const camDir = useMemo(() => new THREE.Vector3(), []);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const axisX = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const axisY = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const points = useMemo(
    () => fibonacciSphere(technologies.length, SPHERE_RADIUS),
    [technologies.length],
  );

  const directions = useMemo(
    () =>
      points.map(([x, y, z]) => {
        const length = Math.hypot(x, y, z) || 1;
        return [x / length, y / length, z / length] as const;
      }),
    [points],
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !assembledRef.current) return;
      draggingRef.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      pointerRef.current.buttons = event.buttons;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.buttons = event.buttons;
      pointerRef.current.inside = true;

      if (!draggingRef.current || !groupRef.current) return;

      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };

      groupRef.current.rotateOnWorldAxis(axisY, dx * DRAG_SPEED);
      groupRef.current.rotateOnWorldAxis(axisX, dy * DRAG_SPEED);
    };

    const onPointerUp = (event: PointerEvent) => {
      draggingRef.current = false;
      pointerRef.current.buttons = event.buttons;
      canvas.style.cursor =
        hoveredRef.current === null ? "grab" : "pointer";
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const onPointerLeave = () => {
      pointerRef.current.inside = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [axisX, axisY, gl]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (assemble) {
      assembleTime.current += delta;
    }

    const totalAssembleTime =
      ASSEMBLE_STAGGER * Math.max(technologies.length - 1, 0) +
      ASSEMBLE_DURATION;
    const fullyAssembled =
      assemble && assembleTime.current >= totalAssembleTime;
    assembledRef.current = fullyAssembled;

    if (wireRef.current) {
      const wireProgress = assemble
        ? Math.min(1, assembleTime.current / 0.45)
        : 0;
      const material = wireRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.12 * easeOutCubic(wireProgress);
    }

    for (let i = 0; i < directions.length; i += 1) {
      const item = itemRefs.current[i];
      if (!item) continue;

      const localTime = assemble
        ? Math.max(0, assembleTime.current - i * ASSEMBLE_STAGGER)
        : 0;
      const t = Math.min(1, localTime / ASSEMBLE_DURATION);
      const eased = easeOutCubic(t);
      const [dx, dy, dz] = directions[i];
      const radius = THREE.MathUtils.lerp(START_RADIUS, SPHERE_RADIUS, eased);

      item.position.set(dx * radius, dy * radius, dz * radius);
      item.visible = assemble && t > 0.02;
      item.userData.arrive = eased;
    }

    if (
      fullyAssembled &&
      !draggingRef.current &&
      hoveredRef.current === null
    ) {
      group.rotateOnWorldAxis(axisY, delta * AUTO_SPIN);
    }

    group.updateWorldMatrix(true, false);
    camera.getWorldDirection(camDir);

    let bestIndex = 0;
    let bestFrontness = -Infinity;

    for (let i = 0; i < points.length; i += 1) {
      const item = itemRefs.current[i];
      if (!item) continue;
      worldPos.copy(item.position).applyMatrix4(group.matrixWorld);
      const frontness = -worldPos.dot(camDir) / SPHERE_RADIUS;

      if (frontness > bestFrontness) {
        bestFrontness = frontness;
        bestIndex = i;
      }
    }

    const rect = gl.domElement.getBoundingClientRect();
    const pointer = pointerRef.current;
    let hovered: number | null = null;

    const insideCanvas =
      pointer.inside &&
      pointer.x >= rect.left &&
      pointer.x <= rect.right &&
      pointer.y >= rect.top &&
      pointer.y <= rect.bottom;

    if (insideCanvas && fullyAssembled && !draggingRef.current) {
      let bestDistance = HOVER_RADIUS_PX;

      for (let i = 0; i < points.length; i += 1) {
        const item = itemRefs.current[i];
        if (!item) continue;
        worldPos.copy(item.position).applyMatrix4(group.matrixWorld);
        const frontness = -worldPos.dot(camDir) / SPHERE_RADIUS;
        if (frontness < -0.05) continue;

        projected.copy(worldPos).project(camera);
        if (projected.z > 1) continue;

        const screenX = (projected.x * 0.5 + 0.5) * rect.width + rect.left;
        const screenY = (-projected.y * 0.5 + 0.5) * rect.height + rect.top;
        const distance = Math.hypot(screenX - pointer.x, screenY - pointer.y);

        if (distance < bestDistance) {
          bestDistance = distance;
          hovered = i;
        }
      }
    }

    if (hoveredRef.current !== hovered) {
      hoveredRef.current = hovered;
      if (!draggingRef.current) {
        gl.domElement.style.cursor = hovered === null ? "grab" : "pointer";
      }
    }

    for (let i = 0; i < points.length; i += 1) {
      const item = itemRefs.current[i];
      if (!item) continue;

      worldPos.copy(item.position).applyMatrix4(group.matrixWorld);
      const frontness = -worldPos.dot(camDir) / SPHERE_RADIUS;
      const depth = Math.pow((frontness + 1) / 2, 2.4);
      const isFront = i === bestIndex;
      const isHovered = i === hovered;
      const arrive = Number(item.userData.arrive ?? 0);

      let opacity = (isFront ? 1 : 0.08 + depth * 0.72) * arrive;
      let scale = 0.7 + arrive * 0.3;
      let filter = isFront
        ? "brightness(1.08) contrast(1.05)"
        : `brightness(${0.18 + depth * 0.62})`;

      if (isHovered && fullyAssembled) {
        opacity = 1;
        scale = 1.4;
        filter =
          "brightness(1.2) contrast(1.1) drop-shadow(0 2px 10px rgba(15, 107, 86, 0.45))";
      }

      const node = nodeRefs.current[i];
      if (node) {
        node.style.opacity = String(opacity);
        node.style.filter = filter;
        node.style.transform = `scale(${scale})`;
      }

      const label = labelRefs.current[i];
      if (label) {
        label.style.opacity =
          fullyAssembled && (isFront || isHovered) ? "1" : "0";
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={wireRef}>
        <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#0f6b56"
          wireframe
          transparent
          opacity={0}
        />
      </mesh>

      {technologies.map((tech, index) => {
        const [dx, dy, dz] = directions[index];
        return (
          <group
            key={tech.name}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            position={[dx * START_RADIUS, dy * START_RADIUS, dz * START_RADIUS]}
            visible={false}
          >
            <Html
              center
              transform
              sprite
              distanceFactor={8.5}
              wrapperClass="tech-html"
              style={{ pointerEvents: "none" }}
            >
              <div
                ref={(node) => {
                  nodeRefs.current[index] = node;
                }}
                className="pointer-events-none flex w-12 flex-col items-center gap-0.5"
              >
                <TechLogo name={tech.name} src={tech.logo} />
                <span
                  ref={(node) => {
                    labelRefs.current[index] = node;
                  }}
                  className="min-h-4 text-center text-[10px] leading-tight font-medium tracking-wide text-ink opacity-0"
                >
                  {tech.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export function TechSphere({
  technologies,
  assemble = false,
}: TechSphereProps) {
  return (
    <div className="relative mx-auto h-[min(70vw,28rem)] w-full max-w-3xl cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full touch-none"
        style={{ touchAction: "none" }}
      >
        <ambientLight intensity={1} />
        <TechCloud technologies={technologies} assemble={assemble} />
      </Canvas>
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-sm text-ink-soft">
        Drag to rotate
      </p>
    </div>
  );
}
