import { nextTick, onBeforeUnmount, watch, type Ref } from "vue";
import { gsap } from "gsap";
import {
  createWorksCardScene,
  CARD_W,
  CARD_H,
  CARD_ROT,
  nearestEquivalentAngle,
  type WorksCardScene,
} from "./createWorksCardScene";

export interface Card3DProps {
  sectionEl: HTMLElement | null;
  stageEl: HTMLElement | null;
  enable?: boolean;
  finalXRatio?: number;
  timelineStart?: string;
  timelineEnd?: string;
  finalXAt?: number;
}

export function useWorksCard3D(
  canvasRef: Ref<HTMLCanvasElement | null>,
  shadowRef: Ref<HTMLElement | null>,
  shadowStyle: Ref<Record<string, string>>,
  props: Card3DProps,
) {
  let sceneCtx: WorksCardScene | null = null;
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

  const prefersReducedMotion = () =>
    import.meta.client &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function computeUnitsPerPx(): number {
    const canvas = canvasRef.value;
    if (!canvas) return 0;
    const H = canvas.clientHeight;
    if (!H) return 0;
    return (2 * Math.tan((36 * Math.PI) / 180 / 2) * 5.7) / H;
  }

  function updateShadowStyle() {
    const canvas = canvasRef.value;
    if (!canvas || !sceneCtx?.cardMesh) return;
    const mesh = sceneCtx.cardMesh;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (!W || !H) return;
    const visH = 2 * Math.tan((36 * Math.PI) / 180 / 2) * 5.7;
    const visW = visH * (W / H);
    const scale = mesh.scale.x;
    const cardWpx = ((CARD_W * scale) / visW) * W;
    const cardHpx = ((CARD_H * scale) / visH) * H;
    const spreadW = cardWpx * 1.026;
    const spreadH = cardHpx * 1.026;
    const rotDeltaX =
      nearestEquivalentAngle(CARD_ROT.x, mesh.rotation.x) - CARD_ROT.x;
    const rotDeltaY =
      nearestEquivalentAngle(CARD_ROT.y, mesh.rotation.y) - CARD_ROT.y;
    const offsetX = cardWpx * 0.04 + 150 * scale + rotDeltaY * 110;
    const offsetY = cardHpx * 0.06 + 80 * scale - rotDeltaX * 110;
    const cardScreenX = W / 2 + (mesh.position.x / visW) * W;
    const cardScreenY = H / 2 - (mesh.position.y / visH) * H;
    shadowStyle.value = {
      width: `${spreadW}px`,
      height: `${spreadH}px`,
      left: `${cardScreenX + offsetX - spreadW / 2}px`,
      top: `${cardScreenY + offsetY - spreadH / 2}px`,
    };
  }

  function initMouseTilt(stage: HTMLElement) {
    if (!sceneCtx?.cardMesh || prefersReducedMotion()) return;
    attachedStage = stage;
    const MAX_TILT = 0.22;

    tiltMouseEnter = () => {
      isMouseOverStage = true;
      if (!tiltEnabled || !sceneCtx) return;
      hoverScaleTween?.kill();
      hoverScaleTween = gsap.to(sceneCtx.cardMesh.scale, {
        z: sceneCtx.cardMesh.scale.x * 2,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          sceneCtx?.render();
          updateShadowStyle();
        },
      });
    };

    tiltMouseMove = (e: MouseEvent) => {
      if (!tiltEnabled || !sceneCtx) return;
      const mesh = sceneCtx.cardMesh;
      const rect = stage.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      tiltRotationTween?.kill();
      tiltRotationTween = gsap.to(mesh.rotation, {
        x: nearestEquivalentAngle(mesh.rotation.x, CARD_ROT.x + my * MAX_TILT),
        y: nearestEquivalentAngle(mesh.rotation.y, CARD_ROT.y + mx * MAX_TILT),
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          sceneCtx?.render();
          updateShadowStyle();
        },
      });
    };

    tiltMouseLeave = () => {
      isMouseOverStage = false;
      if (!tiltEnabled || !sceneCtx) return;
      const mesh = sceneCtx.cardMesh;
      tiltRotationTween?.kill();
      tiltRotationTween = gsap.to(mesh.rotation, {
        x: nearestEquivalentAngle(mesh.rotation.x, CARD_ROT.x),
        y: nearestEquivalentAngle(mesh.rotation.y, CARD_ROT.y),
        duration: 0.9,
        ease: "power3.out",
        onUpdate: () => {
          sceneCtx?.render();
          updateShadowStyle();
        },
      });
      hoverScaleTween?.kill();
      hoverScaleTween = gsap.to(mesh.scale, {
        z: mesh.scale.x,
        duration: 0.5,
        ease: "power3.out",
        onUpdate: () => {
          sceneCtx?.render();
          updateShadowStyle();
        },
      });
    };

    stage.addEventListener("mouseenter", tiltMouseEnter);
    stage.addEventListener("mousemove", tiltMouseMove);
    stage.addEventListener("mouseleave", tiltMouseLeave);
  }

  function removeMouseTilt() {
    if (!attachedStage) return;
    if (tiltMouseEnter)
      attachedStage.removeEventListener("mouseenter", tiltMouseEnter);
    if (tiltMouseMove)
      attachedStage.removeEventListener("mousemove", tiltMouseMove);
    if (tiltMouseLeave)
      attachedStage.removeEventListener("mouseleave", tiltMouseLeave);
    attachedStage = null;
    tiltMouseEnter = null;
    tiltMouseMove = null;
    tiltMouseLeave = null;
  }

  async function runSetup(sectionEl: HTMLElement, stageEl: HTMLElement) {
    if (initialized) return;
    if (!canvasRef.value) return;
    initialized = true;

    sceneCtx = createWorksCardScene(canvasRef.value);
    initMouseTilt(stageEl);
    updateShadowStyle();

    canvasResizeObserver = new ResizeObserver(() => {
      sceneCtx?.resize();
      updateShadowStyle();
    });
    canvasResizeObserver.observe(canvasRef.value);

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (!isDesktop || prefersReducedMotion()) {
      if (sceneCtx.cardMesh) {
        sceneCtx.cardMesh.visible = true;
        sceneCtx.cardMesh.position.set(0, 0, 0);
        sceneCtx.cardMesh.scale.setScalar(0.9);
        sceneCtx.cardMesh.rotation.set(CARD_ROT.x, CARD_ROT.y, CARD_ROT.z);
        tiltEnabled = true;
        sceneCtx.render();
        updateShadowStyle();
      }
      return;
    }

    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    gsapCtx = gsap.context(() => {
      const mesh = sceneCtx!.cardMesh;
      if (!mesh) return;

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
        return (props.finalXRatio ?? -0.05) * W * ups;
      };

      mesh.scale.setScalar(0.25);
      mesh.position.set(0, offscreenBottomY(), 0);
      mesh.visible = true;
      if (shadowRef.value) gsap.set(shadowRef.value, { opacity: 0 });
      sceneCtx!.render();

      const cardTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionEl,
          start: props.timelineStart ?? "top center",
          end: props.timelineEnd ?? "+=150%",
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
            sceneCtx?.render();
          },
        },
        onUpdate: () => {
          sceneCtx?.render();
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
        .to(
          mesh.rotation,
          { x: CARD_ROT.x + Math.PI * 2, duration: 0.2 },
          0.333,
        )
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
        .to(
          mesh.position,
          { y: 0.4, duration: 0.05, ease: "power2.out" },
          0.533,
        )
        .to(mesh.position, { y: 0.1, duration: 0.06, ease: "power2.in" }, 0.583)
        .to(
          mesh.position,
          { y: 0.16, duration: 0.03, ease: "power2.out" },
          0.643,
        )
        .to(mesh.position, { y: 0.1, duration: 0.05, ease: "power2.in" }, 0.673)
        .to(
          mesh.position,
          { y: 0.124, duration: 0.022, ease: "power2.out" },
          0.723,
        )
        .to(
          mesh.position,
          { y: 0.1, duration: 0.025, ease: "power2.in" },
          0.745,
        )
        .to(
          mesh.position,
          { y: 0.11, duration: 0.018, ease: "power2.out" },
          0.77,
        )
        .to(
          mesh.position,
          { y: 0.1, duration: 0.022, ease: "power2.in" },
          0.788,
        );

      cardTl.to(
        mesh.position,
        { x: () => leftStageCenterX(), duration: 0.18, ease: "power2.inOut" },
        props.finalXAt ?? 0.82,
      );

      // Refresh required: ensures the card 3D ScrollTrigger measures its
      // trigger's final position after all parent layouts (WorksSection
      // clipPath + layout resize) have settled. Without this, the card's
      // start/end scroll positions are based on stale pre-layout geometry.
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
    gsapCtx?.revert();
    canvasResizeObserver?.disconnect();
    removeMouseTilt();
    hoverScaleTween?.kill();
    tiltRotationTween?.kill();
    sceneCtx?.dispose();
    sceneCtx = null;
  });
}
