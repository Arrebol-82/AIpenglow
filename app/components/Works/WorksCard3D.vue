<template>
  <div v-if="enable" class="works-card-scene works-card-scene--overlay">
    <div ref="shadowRef" class="works-card-shadow" :style="shadowStyle"></div>
    <canvas ref="canvasRef" class="works-three-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { gsap } from "gsap";
import notionTexture from "~/assets/images/image.webp";

const props = withDefaults(
  defineProps<{
    sectionEl: HTMLElement | null;
    stageEl: HTMLElement | null;
    enable?: boolean;
    finalXRatio?: number;
    timelineStart?: string;
    timelineEnd?: string;
    finalXAt?: number;
  }>(),
  {
    enable: true,
    finalXRatio: -0.05,
    timelineStart: "top center",
    timelineEnd: "+=150%",
    finalXAt: 0.82,
  },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const shadowRef = ref<HTMLElement | null>(null);
const shadowStyle = ref<Record<string, string>>({});

let gsapCtx: gsap.Context | null = null;
let canvasResizeObserver: ResizeObserver | null = null;
let tiltMouseEnter: (() => void) | null = null;
let tiltMouseMove: ((e: MouseEvent) => void) | null = null;
let tiltMouseLeave: (() => void) | null = null;
let attachedStage: HTMLElement | null = null;
let tiltEnabled = false;
let isMouseOverStage = false;
let hoverScaleTween: gsap.core.Tween | null = null;
let tiltRotationTween: gsap.core.Tween | null = null;
let initialized = false;

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let cardMeshRef: THREE.Mesh | null = null;

const CARD_W = 3.024;
const CARD_H = 1.8462;
const CARD_D = 0.1125 / 2;
const CARD_BEVEL_T = 0.012;
const CARD_ROT = { x: -0.24, y: -0.38, z: 0.0 };

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TWO_PI = Math.PI * 2;
function nearestEquivalentAngle(current: number, target: number): number {
  return target - Math.round((target - current) / TWO_PI) * TWO_PI;
}

function computeUnitsPerPx(): number {
  const canvas = canvasRef.value;
  if (!canvas) return 0;
  const H = canvas.clientHeight;
  if (!H) return 0;
  return (2 * Math.tan((36 * Math.PI) / 180 / 2) * 5.7) / H;
}

function updateShadowStyle() {
  const canvas = canvasRef.value;
  if (!canvas || !cardMeshRef) return;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  if (!W || !H) return;
  const visH = 2 * Math.tan((36 * Math.PI) / 180 / 2) * 5.7;
  const visW = visH * (W / H);
  const scale = cardMeshRef.scale.x;
  const cardWpx = ((CARD_W * scale) / visW) * W;
  const cardHpx = ((CARD_H * scale) / visH) * H;
  const spreadW = cardWpx * 1.026;
  const spreadH = cardHpx * 1.026;
  const rotDeltaX =
    nearestEquivalentAngle(CARD_ROT.x, cardMeshRef.rotation.x) - CARD_ROT.x;
  const rotDeltaY =
    nearestEquivalentAngle(CARD_ROT.y, cardMeshRef.rotation.y) - CARD_ROT.y;
  const offsetX = cardWpx * 0.04 + 150 * scale + rotDeltaY * 110;
  const offsetY = cardHpx * 0.06 + 80 * scale - rotDeltaX * 110;
  const cardScreenX = W / 2 + (cardMeshRef.position.x / visW) * W;
  const cardScreenY = H / 2 - (cardMeshRef.position.y / visH) * H;
  shadowStyle.value = {
    width: `${spreadW}px`,
    height: `${spreadH}px`,
    left: `${cardScreenX + offsetX - spreadW / 2}px`,
    top: `${cardScreenY + offsetY - spreadH / 2}px`,
  };
}

function initThree() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const W = canvas.clientWidth || 600;
  const H = canvas.clientHeight || 500;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H, false);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
  camera.position.z = 5.7;

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));

  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(3, 3, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8eeff, 0.4);
  fill.position.set(-4, 0, 2);
  scene.add(fill);

  const r = 0.14;
  const hw = CARD_W / 2;
  const hh = CARD_H / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw, hh - r);
  shape.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw + r, hh);
  shape.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw, -hh + r);
  shape.absarc(-hw + r, -hh + r, r, Math.PI, Math.PI * 1.5, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: CARD_D,
    bevelEnabled: true,
    bevelThickness: CARD_BEVEL_T,
    bevelSize: 0.008,
    bevelSegments: 3,
  });
  geo.translate(0, 0, -CARD_D / 2);

  const frontMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.45,
    metalness: 0.0,
  });
  const sideMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.6,
    metalness: 0.0,
  });

  const cardMesh = new THREE.Mesh(geo, [frontMat, sideMat]);
  cardMeshRef = cardMesh;
  cardMesh.rotation.set(CARD_ROT.x, CARD_ROT.y, CARD_ROT.z);
  cardMesh.visible = false;
  scene.add(cardMesh);

  const tex = new THREE.TextureLoader().load(notionTexture, () => {
    renderer?.render(scene!, camera!);
  });

  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const imageGeo = new THREE.ShapeGeometry(shape);

  const pos = imageGeo.attributes.position as THREE.BufferAttribute;
  const uvs: number[] = [];

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs.push((x + hw) / CARD_W, (y + hh) / CARD_H);
  }

  imageGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  const imagePlane = new THREE.Mesh(
    imageGeo,
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: false,
      side: THREE.FrontSide,
    }),
  );
  imagePlane.position.z = CARD_D / 2 + CARD_BEVEL_T + 0.003;
  cardMesh.add(imagePlane);

  const backCanvas = document.createElement("canvas");
  const backTexW = 1024;
  const backTexH = Math.round(1024 * (CARD_H / CARD_W));
  backCanvas.width = backTexW;
  backCanvas.height = backTexH;
  const bctx = backCanvas.getContext("2d");
  if (bctx) {
    bctx.fillStyle = "#ffffff";
    bctx.fillRect(0, 0, backTexW, backTexH);
    bctx.fillStyle = "#111111";
    bctx.font = `500 ${Math.round(backTexH * 0.42)}px Georgia, "Times New Roman", serif`;
    bctx.textAlign = "center";
    bctx.textBaseline = "middle";
    bctx.fillText("Notion", backTexW / 2, backTexH / 2 + backTexH * 0.02);
  }
  const backTex = new THREE.CanvasTexture(backCanvas);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const backGeo = new THREE.ShapeGeometry(shape);
  const backPos = backGeo.attributes.position as THREE.BufferAttribute;
  const backUvs: number[] = [];
  for (let i = 0; i < backPos.count; i++) {
    const x = backPos.getX(i);
    const y = backPos.getY(i);
    backUvs.push(1 - (x + hw) / CARD_W, (y + hh) / CARD_H);
  }
  backGeo.setAttribute("uv", new THREE.Float32BufferAttribute(backUvs, 2));

  const backPlane = new THREE.Mesh(
    backGeo,
    new THREE.MeshBasicMaterial({
      map: backTex,
      transparent: false,
      side: THREE.BackSide,
    }),
  );
  backPlane.position.z = -CARD_D / 2 - CARD_BEVEL_T - 0.003;
  cardMesh.add(backPlane);
}

function resizeThree() {
  const canvas = canvasRef.value;
  if (!canvas || !renderer || !camera) return;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  if (!W || !H) return;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.render(scene!, camera);
  updateShadowStyle();
}

function initMouseTilt(stage: HTMLElement) {
  if (!cardMeshRef || prefersReducedMotion()) return;
  attachedStage = stage;

  const MAX_TILT = 0.22;

  tiltMouseEnter = () => {
    isMouseOverStage = true;
    if (!tiltEnabled || !cardMeshRef) return;
    hoverScaleTween?.kill();
    hoverScaleTween = gsap.to(cardMeshRef.scale, {
      z: cardMeshRef.scale.x * 2,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });
  };

  tiltMouseMove = (e: MouseEvent) => {
    if (!tiltEnabled || !cardMeshRef) return;
    const rect = stage.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    tiltRotationTween?.kill();
    tiltRotationTween = gsap.to(cardMeshRef.rotation, {
      x: nearestEquivalentAngle(
        cardMeshRef.rotation.x,
        CARD_ROT.x + my * MAX_TILT,
      ),
      y: nearestEquivalentAngle(
        cardMeshRef.rotation.y,
        CARD_ROT.y + mx * MAX_TILT,
      ),
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });
  };

  tiltMouseLeave = () => {
    isMouseOverStage = false;
    if (!tiltEnabled || !cardMeshRef) return;
    tiltRotationTween?.kill();
    tiltRotationTween = gsap.to(cardMeshRef.rotation, {
      x: nearestEquivalentAngle(cardMeshRef.rotation.x, CARD_ROT.x),
      y: nearestEquivalentAngle(cardMeshRef.rotation.y, CARD_ROT.y),
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });
    hoverScaleTween?.kill();
    hoverScaleTween = gsap.to(cardMeshRef.scale, {
      z: cardMeshRef.scale.x,
      duration: 0.5,
      ease: "power3.out",
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });
  };

  stage.addEventListener("mouseenter", tiltMouseEnter);
  stage.addEventListener("mousemove", tiltMouseMove);
  stage.addEventListener("mouseleave", tiltMouseLeave);
}

async function runSetup(sectionEl: HTMLElement, stageEl: HTMLElement) {
  if (initialized) return;
  if (!canvasRef.value) return;
  initialized = true;

  initThree();
  initMouseTilt(stageEl);
  updateShadowStyle();
  canvasResizeObserver = new ResizeObserver(resizeThree);
  canvasResizeObserver.observe(canvasRef.value);

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (!isDesktop || prefersReducedMotion()) {
    if (cardMeshRef) {
      cardMeshRef.visible = true;
      cardMeshRef.position.set(0, 0, 0);
      cardMeshRef.scale.setScalar(0.9);
      cardMeshRef.rotation.set(CARD_ROT.x, CARD_ROT.y, CARD_ROT.z);
      tiltEnabled = true;
      renderer?.render(scene!, camera!);
      updateShadowStyle();
    }
    return;
  }

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  gsapCtx = gsap.context(() => {
    if (!cardMeshRef) return;
    const mesh = cardMeshRef;

    const offscreenBottomY = (): number => {
      const ups = computeUnitsPerPx();
      const H = canvasRef.value?.clientHeight ?? 0;
      if (!ups || !H) return -3;
      return -(H / 2 + 200) * ups;
    };

    const leftStageCenterX = (): number => {
      const canvas = canvasRef.value;
      if (!canvas) return 0;
      const ups = computeUnitsPerPx();
      const W = canvas.clientWidth;
      if (!ups || !W) return 0;
      return props.finalXRatio * W * ups;
    };

    mesh.scale.setScalar(0.25);
    mesh.position.set(0, offscreenBottomY(), 0);
    mesh.visible = true;
    if (shadowRef.value) gsap.set(shadowRef.value, { opacity: 0 });
    renderer?.render(scene!, camera!);

    const cardTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sectionEl,
        start: props.timelineStart,
        end: props.timelineEnd,
        scrub: 1,
        invalidateOnRefresh: true,
        onLeave: () => {
          tiltEnabled = true;
          if (isMouseOverStage) tiltMouseEnter?.();
        },
        onEnterBack: () => {
          tiltEnabled = false;
          hoverScaleTween?.kill();
          tiltRotationTween?.kill();
          gsap.set(mesh.scale, { z: mesh.scale.x });
          renderer?.render(scene!, camera!);
        },
      },
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });

    cardTl
      .fromTo(
        mesh.position,
        { y: () => offscreenBottomY() },
        { y: 0.1, duration: 0.333 },
        0,
      )
      .fromTo(
        mesh.scale,
        { x: 0.25, y: 0.25, z: 0.25 },
        { x: 1, y: 1, z: 1, duration: 0.333 },
        0,
      )
      .fromTo(
        mesh.rotation,
        { x: CARD_ROT.x - Math.PI * 2 },
        { x: CARD_ROT.x, duration: 0.333 },
        0,
      );

    cardTl
      .to(mesh.position, { y: 0.5, duration: 0.1, ease: "power2.out" }, 0.333)
      .to(mesh.position, { y: 0.1, duration: 0.1, ease: "power2.in" }, 0.433)
      .to(mesh.position, { x: 0.6, duration: 0.1, ease: "sine.out" }, 0.333)
      .to(mesh.position, { x: 0, duration: 0.1, ease: "sine.in" }, 0.433)
      .to(mesh.rotation, { x: CARD_ROT.x + Math.PI * 2, duration: 0.2 }, 0.333)
      .to(
        mesh.rotation,
        { y: CARD_ROT.y + Math.PI, duration: 0.1, ease: "sine.inOut" },
        0.333,
      )
      .to(
        mesh.rotation,
        { y: CARD_ROT.y, duration: 0.1, ease: "sine.inOut" },
        0.433,
      );

    if (shadowRef.value) {
      cardTl.to(
        shadowRef.value,
        { opacity: 1, duration: 0.05, ease: "power2.out" },
        0.533,
      );
    }

    cardTl
      .to(mesh.position, { y: 0.4, duration: 0.05, ease: "power2.out" }, 0.533)
      .to(mesh.position, { y: 0.1, duration: 0.06, ease: "power2.in" }, 0.583)
      .to(mesh.position, { y: 0.16, duration: 0.03, ease: "power2.out" }, 0.643)
      .to(mesh.position, { y: 0.1, duration: 0.05, ease: "power2.in" }, 0.673)
      .to(
        mesh.position,
        { y: 0.124, duration: 0.022, ease: "power2.out" },
        0.723,
      )
      .to(mesh.position, { y: 0.1, duration: 0.025, ease: "power2.in" }, 0.745)
      .to(mesh.position, { y: 0.11, duration: 0.018, ease: "power2.out" }, 0.77)
      .to(mesh.position, { y: 0.1, duration: 0.022, ease: "power2.in" }, 0.788);

    cardTl.to(
      mesh.position,
      { x: () => leftStageCenterX(), duration: 0.18, ease: "power2.inOut" },
      props.finalXAt,
    );

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, sectionEl);
}

watch(
  () => [props.enable, props.sectionEl, props.stageEl] as const,
  async ([enable, section, stage]) => {
    if (enable && section && stage) {
      await nextTick();
      void runSetup(section, stage);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  renderer?.dispose();
  gsapCtx?.revert();
  canvasResizeObserver?.disconnect();
  if (attachedStage) {
    if (tiltMouseEnter)
      attachedStage.removeEventListener("mouseenter", tiltMouseEnter);
    if (tiltMouseMove)
      attachedStage.removeEventListener("mousemove", tiltMouseMove);
    if (tiltMouseLeave)
      attachedStage.removeEventListener("mouseleave", tiltMouseLeave);
  }
  hoverScaleTween?.kill();
  tiltRotationTween?.kill();
});
</script>

<style scoped>
.works-card-scene {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.works-card-scene--overlay {
  position: absolute;
  inset: 0;
  height: auto;
  pointer-events: none;
  z-index: 5;
}

.works-card-shadow {
  position: absolute;
  border-radius: 14px;
  background: rgba(20, 18, 14, 0.42);
  filter: blur(28px);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
}

.works-three-canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
