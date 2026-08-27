/* eslint-disable react/no-unknown-property */
"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

type BandMaterial = InstanceType<typeof MeshLineMaterial> & {
  map: THREE.Texture | null;
  useMap: number;
  needsUpdate: boolean;
  resolution: THREE.Vector2;
};

const CARD_GLB = "/lanyard/card.glb";
const LANYARD_PNG = "/lanyard/lanyard.png";

const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

const ACCENT = "#FF6B1A";
const CARD_BG = "#F4F1EC";
const CARD_INK = "#141414";
const CARD_MUTED = "#5C5A56";

type CardInfo = {
  name?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  website?: string;
  backNote?: string;
};

type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardInfo?: CardInfo;
  hangOffset?: [number, number, number];
};

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardInfo?: CardInfo;
  hangOffset?: [number, number, number];
};

function resolveFont(cssVar: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.fontFamily = `var(${cssVar}), ${fallback}`;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).fontFamily || fallback;
  probe.remove();
  return resolved;
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & { width: number; height: number },
  x: number,
  y: number,
  w: number,
  h: number,
  fit: "cover" | "contain",
  radius = 0,
) {
  if (!img?.width || !img?.height) return;
  const pick = fit === "contain" ? Math.min : Math.max;
  const scale = pick(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.save();
  if (radius > 0) {
    roundedRectPath(ctx, x, y, w, h, radius);
  } else {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
  }
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: string,
) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const next = () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 0xffffffff;
  };

  ctx.fillStyle = CARD_INK;
  let cursor = x;
  const end = x + w;
  while (cursor < end) {
    const barW = Math.max(1.5, 1.2 + next() * 3.2);
    const gap = 1 + next() * 2.4;
    if (next() > 0.28) {
      const barH = h * (0.72 + next() * 0.28);
      ctx.fillRect(cursor, y + (h - barH), Math.min(barW, end - cursor), barH);
    }
    cursor += barW + gap;
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawIdFront(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & { width: number; height: number } | null,
  rect: { x: number; y: number; w: number; h: number },
  atlasW: number,
  atlasH: number,
  imageFit: "cover" | "contain",
  cardInfo: CardInfo,
  fonts: { display: string; body: string },
) {
  const rx = rect.x * atlasW;
  const ry = rect.y * atlasH;
  const rw = rect.w * atlasW;
  const rh = rect.h * atlasH;
  const pad = rw * 0.06;
  const accentH = rh * 0.032;
  const barcodeH = rh * 0.05;
  const photoTop = ry + accentH + pad * 0.35;
  const textBlockH = rh * 0.2;
  const barcodeGap = pad * 0.35;
  const photoH =
    rh - accentH - pad * 0.35 - textBlockH - barcodeH - barcodeGap - pad * 0.25;
  const photoW = rw - pad * 2;
  const photoX = rx + pad;
  const photoRadius = rw * 0.05;
  const textTop = photoTop + photoH + pad * 0.35;
  const barcodeY = textTop + textBlockH * 0.92;

  ctx.fillStyle = CARD_BG;
  ctx.fillRect(rx, ry, rw, rh);

  ctx.fillStyle = ACCENT;
  ctx.fillRect(rx, ry, rw, accentH);

  if (img) {
    drawCoverImage(
      ctx,
      img,
      photoX,
      photoTop,
      photoW,
      photoH,
      imageFit,
      photoRadius,
    );
  } else {
    ctx.fillStyle = "#2A2A2A";
    roundedRectPath(ctx, photoX, photoTop, photoW, photoH, photoRadius);
    ctx.fill();
  }

  const name = cardInfo.name ?? "Ayaan";
  const title = cardInfo.title ?? "";

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = CARD_INK;
  ctx.font = `600 ${Math.round(rw * 0.14)}px ${fonts.display}`;
  ctx.fillText(name, photoX, textTop);

  if (title) {
    ctx.fillStyle = CARD_MUTED;
    ctx.font = `500 ${Math.round(rw * 0.055)}px ${fonts.body}`;
    const lines = wrapText(ctx, title, photoW);
    const lineHeight = rh * 0.052;
    lines.forEach((line, i) => {
      ctx.fillText(line, photoX, textTop + rh * 0.09 + i * lineHeight);
    });
  }

  drawBarcode(ctx, photoX, barcodeY, photoW, barcodeH, `${name}|${title}`);
}

function drawIdBack(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; w: number; h: number },
  atlasW: number,
  atlasH: number,
  cardInfo: CardInfo,
  fonts: { display: string; body: string },
) {
  const rx = rect.x * atlasW;
  const ry = rect.y * atlasH;
  const rw = rect.w * atlasW;
  const rh = rect.h * atlasH;
  const pad = rw * 0.1;
  const accentH = rh * 0.04;

  ctx.fillStyle = CARD_BG;
  ctx.fillRect(rx, ry, rw, rh);

  ctx.fillStyle = ACCENT;
  ctx.fillRect(rx, ry, rw, accentH);
  ctx.fillRect(rx, ry + rh - accentH, rw, accentH);

  const name = cardInfo.name ?? "Ayaan";
  const website = cardInfo.website ?? "aasattar.dev";
  const backNote = cardInfo.backNote ?? "Building things on the web.";

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = CARD_INK;
  ctx.font = `600 ${Math.round(rw * 0.14)}px ${fonts.display}`;
  ctx.fillText(name.toUpperCase(), rx + rw / 2, ry + rh * 0.38);

  ctx.fillStyle = ACCENT;
  ctx.fillRect(rx + rw * 0.35, ry + rh * 0.48, rw * 0.3, Math.max(3, rh * 0.01));

  ctx.fillStyle = CARD_MUTED;
  ctx.font = `500 ${Math.round(rw * 0.055)}px ${fonts.body}`;
  ctx.fillText(backNote, rx + rw / 2, ry + rh * 0.58);

  ctx.fillStyle = CARD_INK;
  ctx.font = `600 ${Math.round(rw * 0.062)}px ${fonts.body}`;
  ctx.fillText(website, rx + rw / 2, ry + rh * 0.7);

  drawBarcode(
    ctx,
    rx + pad,
    ry + rh * 0.8,
    rw - pad * 2,
    rh * 0.08,
    `back|${name}|${website}`,
  );
}

class LanyardErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message || "Lanyard failed to render" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Lanyard]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="lanyard-error" role="alert">
          Card failed to load
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  cardInfo = {},
  hangOffset = [0, 4, 0],
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LanyardErrorBoundary>
      <div className="lanyard-wrapper">
        <Canvas
          camera={{ position, fov }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ alpha: transparent, antialias: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
          eventSource={
            typeof document !== "undefined" ? document.documentElement : undefined
          }
          eventPrefix="client"
          onCreated={({ gl, camera }) => {
            gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
            camera.lookAt(0, 0.15, 0);
          }}
        >
          <ambientLight intensity={1.25} />
          <directionalLight position={[0, 1.5, 8]} intensity={0.9} />
          <directionalLight position={[-3, 2, 4]} intensity={0.35} />
          <Suspense fallback={null}>
            <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
              <Band
                isMobile={isMobile}
                frontImage={frontImage}
                backImage={backImage}
                imageFit={imageFit}
                lanyardImage={lanyardImage}
                lanyardWidth={lanyardWidth}
                cardInfo={cardInfo}
                hangOffset={hangOffset}
              />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </LanyardErrorBoundary>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  cardInfo = {},
  hangOffset = [0, 4, 0],
}: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const bandGeometry = useMemo(() => {
    return new MeshLineGeometry() as unknown as THREE.BufferGeometry & {
      setPoints: (points: THREE.Vector3[]) => void;
    };
  }, []);
  const bandMaterial = useMemo(() => {
    const material = new MeshLineMaterial({
      color: new THREE.Color("white"),
      depthTest: false,
      transparent: true,
      resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000),
      lineWidth: lanyardWidth,
      repeat: new THREE.Vector2(-4, 1),
    }) as BandMaterial;
    material.useMap = 1;
    return material;
  }, [isMobile, lanyardWidth]);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as {
    nodes: {
      card: THREE.Mesh;
      clip: THREE.Mesh;
      clamp: THREE.Mesh;
    };
    materials: {
      base: THREE.MeshStandardMaterial & { map: THREE.Texture };
      metal: THREE.Material;
    };
  };

  const texture = useTexture(lanyardImage || LANYARD_PNG);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    bandMaterial.map = texture;
    bandMaterial.useMap = 1;
    bandMaterial.needsUpdate = true;
  }, [texture, bandMaterial]);

  const cardMap = useMemo(() => {
    const baseMap = materials.base?.map;
    if (!baseMap) return null;
    if (!frontImage && !backImage) return baseMap;

    try {
      const baseImg = baseMap.image as HTMLImageElement | ImageBitmap | undefined;
      const W = baseImg && "width" in baseImg ? baseImg.width : 0;
      const H = baseImg && "height" in baseImg ? baseImg.height : 0;
      if (!baseImg || !W || !H) return baseMap;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return baseMap;
      ctx.drawImage(baseImg as CanvasImageSource, 0, 0, W, H);

      const fonts = {
        display: resolveFont("--font-newsreader", "Georgia, serif"),
        body: resolveFont("--font-body", "system-ui, sans-serif"),
      };

      if (frontImage) {
        drawIdFront(
          ctx,
          frontTex.image
            ? (frontTex.image as HTMLImageElement)
            : null,
          FRONT_UV_RECT,
          W,
          H,
          imageFit,
          cardInfo,
          fonts,
        );
      }

      // Always cover the default reactbits.dev back face.
      if (frontImage || backImage) {
        if (backImage && backTex.image) {
          drawCoverImage(
            ctx,
            backTex.image as HTMLImageElement,
            BACK_UV_RECT.x * W,
            BACK_UV_RECT.y * H,
            BACK_UV_RECT.w * W,
            BACK_UV_RECT.h * H,
            imageFit,
          );
        } else {
          drawIdBack(ctx, BACK_UV_RECT, W, H, cardInfo, fonts);
        }
      }

      const composite = new THREE.CanvasTexture(canvas);
      composite.colorSpace = THREE.SRGBColorSpace;
      composite.flipY = baseMap.flipY;
      composite.anisotropy = 16;
      composite.needsUpdate = true;
      return composite;
    } catch (error) {
      console.error("[Lanyard] texture composite failed", error);
      return baseMap;
    }
  }, [
    frontImage,
    backImage,
    imageFit,
    frontTex,
    backTex,
    materials.base?.map,
    cardInfo.name,
    cardInfo.title,
    cardInfo.subtitle,
    cardInfo.badge,
    cardInfo.website,
    cardInfo.backNote,
    fontsReady,
  ]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(
    fixed as RefObject<RapierRigidBody>,
    j1 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1],
  );
  useRopeJoint(
    j1 as RefObject<RapierRigidBody>,
    j2 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1],
  );
  useRopeJoint(
    j2 as RefObject<RapierRigidBody>,
    j3 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1],
  );
  useSphericalJoint(
    j3 as RefObject<RapierRigidBody>,
    card as RefObject<RapierRigidBody>,
    [
      [0, 0, 0],
      [0, 1.45, 0],
    ],
  );

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const { width, height } = state.size;
    bandMaterial.resolution.set(width, height);

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      card.current
    ) {
      [j1, j2].forEach((ref) => {
        const body = ref.current!;
        const withLerped = body as RapierRigidBody & {
          lerped?: THREE.Vector3;
        };
        if (!withLerped.lerped) {
          withLerped.lerped = new THREE.Vector3().copy(body.translation());
        }
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, withLerped.lerped.distanceTo(body.translation())),
        );
        withLerped.lerped.lerp(
          body.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });

      const j1L = (j1.current as RapierRigidBody & { lerped: THREE.Vector3 })
        .lerped;
      const j2L = (j2.current as RapierRigidBody & { lerped: THREE.Vector3 })
        .lerped;

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2L);
      curve.points[2].copy(j1L);
      curve.points[3].copy(fixed.current.translation());
      curve.curveType = "chordal";

      const strapPoints = curve.getPoints(isMobile ? 16 : 32);
      const strapValid = strapPoints.every(
        (p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z),
      );
      if (strapValid) {
        bandGeometry.setPoints(strapPoints);
      }

      const angvel = card.current.angvel();
      const rotation = card.current.rotation();
      if (
        Number.isFinite(angvel.x) &&
        Number.isFinite(angvel.y) &&
        Number.isFinite(angvel.z) &&
        Number.isFinite(rotation.y)
      ) {
        ang.set(angvel.x, angvel.y, angvel.z);
        rot.set(rotation.x, rotation.y, rotation.z);
        card.current.setAngvel(
          {
            x: ang.x,
            y: ang.y - rot.y * 0.25,
            z: ang.z,
          },
          true,
        );
      }
    }
  });

  if (!nodes.card || !materials.base) {
    throw new Error("card.glb is missing expected meshes/materials");
  }

  return (
    <>
      <group position={hangOffset}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshStandardMaterial
                map={cardMap ?? materials.base.map}
                map-anisotropy={16}
                roughness={0.82}
                metalness={0}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} geometry={bandGeometry} material={bandMaterial as unknown as THREE.Material} />
    </>
  );
}

useGLTF.preload(CARD_GLB);
useTexture.preload(LANYARD_PNG);
useTexture.preload("/id/portrait.jpg");
