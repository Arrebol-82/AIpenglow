<template>
  <section
    id="works-gallery"
    ref="sectionRef"
    class="blueprint-section relative left-1/2 flex min-h-screen w-screen max-w-none -translate-x-1/2 flex-col overflow-hidden font-sans text-[#1D1E18] lg:flex-row"
  >
    <div
      ref="leftStageRef"
      class="works-left-stage relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden bg-[#F6F4F0] lg:min-h-screen lg:w-[65%]"
    >
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span
          ref="wordmarkRef"
          class="works-wordmark"
          :style="worksWordmarkStyle"
          >{{ worksWordmark }}</span
        >
      </div>
      <div class="works-card-scene">
        <div class="works-card-shadow" :style="shadowStyle"></div>
        <canvas ref="canvasRef" class="works-three-canvas"></canvas>
      </div>
    </div>

    <div
      class="blueprint-grid blueprint-frame relative w-full lg:w-[35%] bg-white flex flex-col justify-center p-8 md:p-16 lg:px-24 lg:py-20 border-l border-[#1D1E18]/10"
    >
      <span
        aria-hidden="true"
        class="blueprint-frame-corner blueprint-frame-corner--bl"
        >└</span
      >
      <span
        aria-hidden="true"
        class="blueprint-frame-corner blueprint-frame-corner--br"
        >┘</span
      >
      <div class="mx-auto flex w-full max-w-[520px] flex-col gap-8">
        <div class="blueprint-block relative mb-4">
          <div
            class="absolute -top-6 -left-12 text-[9px] font-mono text-[#1D1E18]/40 leading-tight"
          >
            X 128,<br />Y 45
          </div>
          <div
            class="absolute -bottom-2 -left-8 text-[9px] font-mono text-[#1D1E18]/40"
          >
            B-2
          </div>
          <div
            class="cad-hook-tl"
            style="border-color: #000; width: 20px; height: 20px; top: -11px"
          ></div>
          <div
            class="cad-hook-tr"
            style="border-color: #000; width: 20px; height: 20px; top: -11px"
          ></div>
          <div
            class="cad-hook-bl"
            style="border-color: #000; width: 20px; height: 20px"
          ></div>
          <div
            class="cad-hook-br"
            style="border-color: #000; width: 20px; height: 20px"
          ></div>
          <h2
            class="works-title-wordmark pl-2 text-left text-[5.375rem] md:text-[7.875rem] leading-[0.68] font-black font-sans watermark-outline tracking-tighter -mb-3 md:-mb-5"
          >
            NOTION
          </h2>
          <h3
            class="relative z-10 text-4xl md:text-5xl font-black text-[#111] tracking-widest pl-2"
          >
            练习页
          </h3>
        </div>
        <div
          class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem]"
        >
          <div
            class="absolute -top-4 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 4.1
          </div>
          <div class="cad-hook-tr"></div>
          <div
            class="font-mono text-[11px] uppercase tracking-[0.15em] mb-3 font-bold text-[#1D1E18]/70"
          >
            DESCRIPTION:
          </div>
          <p
            class="text-[13px] md:text-sm font-medium leading-relaxed text-[#1D1E18]/90"
          >
            以Notion 官网为参考完成的练习页 ， 主要用于练习 Flex 与 Grid 布局
          </p>
        </div>

        <div
          class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem]"
        >
          <div
            class="absolute -top-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 8-2
          </div>
          <div
            class="absolute -bottom-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 5-2
          </div>
          <div
            class="absolute -top-2 -right-6 text-[9px] font-mono text-[#1D1E18]/40"
          >
            B-2
          </div>
          <div
            class="font-mono text-[11px] uppercase tracking-[0.15em] mb-4 font-bold text-[#1D1E18]/70"
          >
            TECH STACK:
          </div>
          <div class="flex flex-wrap gap-2 md:gap-3">
            <span class="tech-pill"
              ><span class="tech-dot"></span>JavaScript</span
            >
            <span class="tech-pill"><span class="tech-dot"></span>HTML5</span>
            <span class="tech-pill"><span class="tech-dot"></span>CSS3</span>
            <span class="tech-pill"><span class="tech-dot"></span>React</span>
            <span class="tech-pill"
              ><span class="tech-dot"></span>Tailwind CSS</span
            >
          </div>
        </div>

        <div
          class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem]"
        >
          <div
            class="absolute -top-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 6-3
          </div>
          <div
            class="absolute -bottom-2 -left-12 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 129
          </div>
          <div
            class="font-mono text-[11px] uppercase tracking-[0.15em] mb-2 font-bold text-[#1D1E18]/70"
          >
            ROLE:
          </div>
          <p class="text-[13px] md:text-sm font-bold text-[#1D1E18]">
            UI/UX Design, Frontend Dev
          </p>
        </div>

        <div
          class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem] mb-12"
        >
          <div
            class="absolute -top-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 8-1
          </div>
          <div
            class="absolute -bottom-6 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
          >
            X 4-5
          </div>
          <div
            class="absolute -top-2 -right-6 text-[9px] font-mono text-[#1D1E18]/40"
          >
            B-2
          </div>
          <div class="cad-hook-bl"></div>
          <div
            class="font-mono text-[11px] uppercase tracking-[0.15em] mb-2 font-bold text-[#1D1E18]/70"
          >
            YEAR:
          </div>
          <p class="text-[13px] md:text-sm font-bold text-[#1D1E18]">2025</p>
        </div>

        <div
          ref="stampRef"
          class="blueprint-stamp relative z-20 flex w-[12rem] flex-col gap-1 bg-white/90 px-3 py-1 backdrop-blur-sm"
        >
          <span
            aria-hidden="true"
            class="absolute left-[-5px] right-[-5px] top-[-0.5px] h-px bg-[#1D1E18]/80"
          ></span>
          <span
            aria-hidden="true"
            class="absolute bottom-[-0.5px] left-[-5px] right-[-5px] h-px bg-[#1D1E18]/80"
          ></span>
          <span
            aria-hidden="true"
            class="absolute bottom-[-5px] left-[-0.5px] top-[-5px] w-px bg-[#1D1E18]/80"
          ></span>
          <span
            aria-hidden="true"
            class="absolute bottom-[-5px] right-[-0.5px] top-[-5px] w-px bg-[#1D1E18]/80"
          ></span>
          <div
            class="-mx-3 -mt-1 flex items-center justify-between gap-3 border-b border-[#1D1E18]/80 px-3 pb-1 pt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1D1E18]/80"
          >
            <span>time</span>
            <span
              class="flex h-4 w-4 items-center justify-center border border-[#1D1E18]/80 text-[10px] leading-none text-[#1D1E18]"
              >X</span
            >
          </div>
          <div
            class="relative px-3 py-1 text-center font-bold text-[13px] md:text-sm tracking-[0.1em] text-[#1D1E18]"
          >
            <span
              class="absolute -left-[0.08rem] -top-[0.08rem] text-[11px] font-black leading-none text-[#1D1E18]/75"
              >+</span
            >
            <span
              class="absolute -right-[0.08rem] -top-[0.08rem] text-[11px] font-black leading-none text-[#1D1E18]/75"
              >+</span
            >
            <span
              class="absolute -bottom-[0.08rem] -left-[0.08rem] text-[11px] font-black leading-none text-[#1D1E18]/75"
              >+</span
            >
            <span
              class="absolute -bottom-[0.08rem] -right-[0.08rem] text-[11px] font-black leading-none text-[#1D1E18]/75"
              >+</span
            >
            <div>完成时间：一周</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import * as THREE from "three";
import { gsap } from "gsap";
import notionTexture from "~/assets/images/image.png";

const sectionRef = ref<HTMLElement | null>(null);
const leftStageRef = ref<HTMLElement | null>(null);
const wordmarkRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const stampRef = ref<HTMLElement | null>(null);

const worksWordmark = ref("Notion");
const worksWordmarkStyle = ref<Record<string, string>>({});
const shadowStyle = ref<Record<string, string>>({});

let gsapCtx: gsap.Context | null = null;
let wordmarkResizeObserver: ResizeObserver | null = null;
let canvasResizeObserver: ResizeObserver | null = null;
let handleWordmarkFontsReady: (() => void) | null = null;
let tiltMouseMove: ((e: MouseEvent) => void) | null = null;
let tiltMouseLeave: (() => void) | null = null;

// Three.js state
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let cardMeshRef: THREE.Mesh | null = null;

const CARD_W = 3.024;
const CARD_H = 1.8462;
const CARD_D = 0.1125;
const CARD_BEVEL_T = 0.012;
const CARD_ROT = { x: -0.24, y: -0.38, z: 0.0 };

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Wordmark ───────────────────────────────────────────────────────────────

const syncWorksWordmarkFit = () => {
  if (!leftStageRef.value || !wordmarkRef.value) return;
  const cw = leftStageRef.value.clientWidth;
  const ch = leftStageRef.value.clientHeight;
  if (!cw || !ch) return;
  const nw = wordmarkRef.value.offsetWidth;
  const nh = wordmarkRef.value.offsetHeight;
  if (!nw || !nh) return;
  worksWordmarkStyle.value = {
    transform: `scale(${(cw / nw) * 0.96}, ${(ch / nh) * 0.92})`,
  };
};

// ─── CSS shadow sizing ───────────────────────────────────────────────────────

function updateShadowStyle() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  if (!W || !H) return;
  const visH = 2 * Math.tan((36 * Math.PI) / 180 / 2) * 5.7;
  const visW = visH * (W / H);
  const cardWpx = (CARD_W / visW) * W;
  const cardHpx = (CARD_H / visH) * H;
  const spreadW = cardWpx * 1.026;
  const spreadH = cardHpx * 1.026;
  // Dynamic shadow shift: follows rotation delta from base pose
  const rotDeltaX = cardMeshRef ? cardMeshRef.rotation.x - CARD_ROT.x : 0;
  const rotDeltaY = cardMeshRef ? cardMeshRef.rotation.y - CARD_ROT.y : 0;
  const offsetX = cardWpx * 0.04 + 150 + rotDeltaY * 110;
  const offsetY = cardHpx * 0.06 + 80 - rotDeltaX * 110;
  // Follow card's world-space x position
  const cardScreenX = cardMeshRef
    ? W / 2 + (cardMeshRef.position.x / visW) * W
    : W / 2;
  shadowStyle.value = {
    width: `${spreadW}px`,
    height: `${spreadH}px`,
    left: `${cardScreenX + offsetX - spreadW / 2}px`,
    top: `${H / 2 + offsetY - spreadH / 2}px`,
  };
}

function updateCardPosition() {
  if (!cardMeshRef || !canvasRef.value) return;
  const H = canvasRef.value.clientHeight;
  if (!H) return;
  const unitsPerPx = 2 * Math.tan((36 * Math.PI) / 180 / 2) * 5.7 / H;
  cardMeshRef.position.x = -100 * unitsPerPx;
}

// ─── Three.js init ───────────────────────────────────────────────────────────

function initThree() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const W = canvas.clientWidth || 600;
  const H = canvas.clientHeight || 500;

  // Renderer (transparent bg so stage bg shows through)
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H, false);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
  camera.position.z = 5.7;

  // 中性白光，避免暖色污染白色材质
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));

  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(3, 3, 5);
  scene.add(key);

  // 左侧补光——让侧面（书脊）和正面有明暗对比
  const fill = new THREE.DirectionalLight(0xe8eeff, 0.4);
  fill.position.set(-4, 0, 2);
  scene.add(fill);

  // 圆角矩形 Shape（等同于 CSS border-radius）
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
  geo.translate(0, 0, -CARD_D / 2); // 居中到原点

  // ExtrudeGeometry: 材质索引 0 = 正面/背面，1 = 侧面（挤出壁）
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
  scene.add(cardMesh);

  // 正面图片平面：手动 UV 确保完整铺满 CARD_W x CARD_H
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

  updateCardPosition();
  renderer.render(scene, camera);
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
  updateCardPosition();
  renderer.render(scene!, camera);
  updateShadowStyle();
}

// ─── Mouse tilt ──────────────────────────────────────────────────────────────

function initMouseTilt() {
  const stage = leftStageRef.value;
  if (!stage || !cardMeshRef || prefersReducedMotion()) return;

  const MAX_TILT = 0.22; // radians (~12.5°)

  tiltMouseMove = (e: MouseEvent) => {
    const rect = stage.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    gsap.to(cardMeshRef!.rotation, {
      x: CARD_ROT.x + my * MAX_TILT,
      y: CARD_ROT.y + mx * MAX_TILT,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });
  };

  tiltMouseLeave = () => {
    gsap.to(cardMeshRef!.rotation, {
      x: CARD_ROT.x,
      y: CARD_ROT.y,
      duration: 0.9,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => {
        renderer?.render(scene!, camera!);
        updateShadowStyle();
      },
    });
  };

  stage.addEventListener("mousemove", tiltMouseMove);
  stage.addEventListener("mouseleave", tiltMouseLeave);
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(async () => {
  await nextTick();
  syncWorksWordmarkFit();

  wordmarkResizeObserver = new ResizeObserver(syncWorksWordmarkFit);
  if (leftStageRef.value) wordmarkResizeObserver.observe(leftStageRef.value);
  if (wordmarkRef.value) wordmarkResizeObserver.observe(wordmarkRef.value);

  if (import.meta.client && "fonts" in document) {
    handleWordmarkFontsReady = syncWorksWordmarkFit;
    void document.fonts.ready.then(syncWorksWordmarkFit);
    document.fonts.addEventListener?.("loadingdone", handleWordmarkFontsReady);
  }

  if (import.meta.client && canvasRef.value) {
    initThree();
    updateShadowStyle();
    initMouseTilt();
    canvasResizeObserver = new ResizeObserver(resizeThree);
    canvasResizeObserver.observe(canvasRef.value);
  }

  if (!sectionRef.value || prefersReducedMotion()) return;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  // Blueprint blocks entrance
  gsapCtx = gsap.context(() => {
    gsap.from(gsap.utils.toArray<HTMLElement>(".blueprint-block"), {
      x: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".blueprint-grid",
        start: "top 75%",
        once: true,
      },
    });

    if (stampRef.value) {
      gsap.from(stampRef.value, {
        scale: 2,
        opacity: 0,
        rotation: -15,
        duration: 0.6,
        delay: 0.8,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: stampRef.value,
          start: "top 90%",
          once: true,
        },
      });
    }
  }, sectionRef.value);
});

watch(worksWordmark, async () => {
  await nextTick();
  syncWorksWordmarkFit();
});

onBeforeUnmount(() => {
  renderer?.dispose();
  gsapCtx?.revert();
  wordmarkResizeObserver?.disconnect();
  canvasResizeObserver?.disconnect();
  if (tiltMouseMove) leftStageRef.value?.removeEventListener("mousemove", tiltMouseMove);
  if (tiltMouseLeave) leftStageRef.value?.removeEventListener("mouseleave", tiltMouseLeave);
  if (import.meta.client && handleWordmarkFontsReady && "fonts" in document) {
    document.fonts.removeEventListener?.(
      "loadingdone",
      handleWordmarkFontsReady,
    );
  }
});
</script>

<style scoped>
.blueprint-grid {
  background-image:
    linear-gradient(rgba(29, 30, 24, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 30, 24, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  background-position: center center;
}

.blueprint-frame {
  --blueprint-frame-inset: 0.875rem;
}

.blueprint-frame::before {
  content: "";
  position: absolute;
  inset: var(--blueprint-frame-inset);
  border: 1.5px solid rgba(29, 30, 24, 0.18);
  pointer-events: none;
}

.blueprint-frame-corner {
  position: absolute;
  bottom: calc(var(--blueprint-frame-inset) + 0.45rem);
  z-index: 1;
  font-family: "Georgia", "Times New Roman", "Book Antiqua", serif;
  font-size: 1.35rem;
  line-height: 1;
  color: rgba(29, 30, 24, 0.38);
  pointer-events: none;
  user-select: none;
}

.blueprint-frame-corner--bl {
  left: calc(var(--blueprint-frame-inset) + 0.3rem);
}
.blueprint-frame-corner--br {
  right: calc(var(--blueprint-frame-inset) + 0.3rem);
}

.blueprint-stamp {
  position: absolute;
  right: calc(var(--blueprint-frame-inset) + 1.9rem);
  bottom: calc(var(--blueprint-frame-inset) + 1.85rem);
}

.works-wordmark {
  display: block;
  text-align: center;
  white-space: nowrap;
  font-family: "Georgia", "Times New Roman", "Book Antiqua", serif;
  font-weight: 500;
  font-size: 16rem;
  line-height: 0.82;
  letter-spacing: -0.035em;
  color: #e7dfd2;
  opacity: 0.84;
  transform-origin: center center;
  will-change: transform;
}

.works-left-stage {
  background-color: #f6f4f0;
  background-image:
    radial-gradient(
      circle at 18% 18%,
      rgba(255, 255, 255, 0.78) 0,
      rgba(255, 255, 255, 0) 36%
    ),
    radial-gradient(
      circle at 82% 24%,
      rgba(233, 224, 210, 0.36) 0,
      rgba(233, 224, 210, 0) 28%
    ),
    linear-gradient(135deg, rgba(29, 30, 24, 0.03) 0%, rgba(29, 30, 24, 0) 42%),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.24) 0,
      rgba(255, 255, 255, 0.24) 1px,
      transparent 1px,
      transparent 24px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(29, 30, 24, 0.018) 0,
      rgba(29, 30, 24, 0.018) 1px,
      transparent 1px,
      transparent 24px
    );
  background-position: center center;
  background-size:
    auto,
    auto,
    auto,
    24px 24px,
    24px 24px;
}

/* Three.js canvas — transparent bg so stage shows through */
.works-card-scene {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.works-card-shadow {
  position: absolute;
  border-radius: 14px;
  background: rgba(20, 18, 14, 0.42);
  filter: blur(28px);
  pointer-events: none;
  z-index: 1;
}

.works-three-canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.watermark-outline {
  color: transparent;
  -webkit-text-stroke: 2px rgba(17, 17, 17, 0.95);
}

.works-title-wordmark {
  display: block;
  width: 100%;
  white-space: nowrap;
  letter-spacing: 0.015em;
  transform: translateY(0.3125rem) scaleX(0.72) scaleY(1);
  transform-origin: top left;
  will-change: transform;
}

@media (max-width: 767px) {
  .works-title-wordmark {
    transform: translateY(0.1875rem) scaleX(0.7) scaleY(1);
  }
}

.cad-hook-tl {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 10px;
  height: 10px;
  border-top: 1px solid rgba(29, 30, 24, 0.4);
  border-left: 1px solid rgba(29, 30, 24, 0.4);
}
.cad-hook-tr {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 10px;
  height: 10px;
  border-top: 1px solid rgba(29, 30, 24, 0.4);
  border-right: 1px solid rgba(29, 30, 24, 0.4);
}
.cad-hook-bl {
  position: absolute;
  bottom: -6px;
  left: -6px;
  width: 10px;
  height: 10px;
  border-bottom: 1px solid rgba(29, 30, 24, 0.4);
  border-left: 1px solid rgba(29, 30, 24, 0.4);
}
.cad-hook-br {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 10px;
  height: 10px;
  border-bottom: 1px solid rgba(29, 30, 24, 0.4);
  border-right: 1px solid rgba(29, 30, 24, 0.4);
}

.tech-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(29, 30, 24, 0.15);
  border-radius: 999px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(29, 30, 24, 0.85);
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.tech-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid rgba(29, 30, 24, 0.5);
}

@media (min-width: 768px) {
  .blueprint-frame {
    --blueprint-frame-inset: 1.5rem;
  }
  .blueprint-frame::before {
    inset: var(--blueprint-frame-inset);
  }
}

@media (min-width: 1024px) {
  .blueprint-frame {
    --blueprint-frame-inset: 2rem;
  }
  .blueprint-frame::before {
    inset: var(--blueprint-frame-inset);
  }
}
</style>
