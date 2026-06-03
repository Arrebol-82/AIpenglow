<script setup lang="ts">
import { gsap } from "gsap";

const transition = usePageTransition();

const layer1Ref = ref<HTMLDivElement | null>(null);
const layer2Ref = ref<HTMLDivElement | null>(null);
const layer3Ref = ref<HTMLDivElement | null>(null);

const layer1Color = "#EFE3C8";
const layer2Color = "#C9B98F";
const layer3Color = "#6E6A4E";

const coveringDuration1 = 1.15;
const coveringDuration2 = 1.0;
const coveringDuration3 = 0.9;

const revealingDuration3 = 0.9;
const revealingDuration2 = 1.0;
const revealingDuration1 = 1.15;

// 下一层在上一层动画进行了 20% 后开始
const coverStart2 = coveringDuration1 * 0.2;
const coverStart3 = coverStart2 + coveringDuration2 * 0.2;

const revealStart2 = revealingDuration3 * 0.2;
const revealStart1 = revealStart2 + revealingDuration2 * 0.2;

let coverTween: gsap.core.Timeline | null = null;
let revealTween: gsap.core.Timeline | null = null;

const getLayers = () => {
  return [layer1Ref.value, layer2Ref.value, layer3Ref.value];
};

const resetLayers = () => {
  const layers = getLayers();

  if (layers.some((layer) => !layer)) return;

  coverTween?.kill();
  coverTween = null;

  revealTween?.kill();
  revealTween = null;

  gsap.set(layers, {
    y: "105%",
    autoAlpha: 0,
    display: "none",
    pointerEvents: "none",
  });
};

const animateCover = () => {
  coverTween?.kill();
  coverTween = null;

  revealTween?.kill();
  revealTween = null;

  const layers = getLayers();

  if (layers.some((layer) => !layer)) return;

  gsap.set(layers, {
    y: "105%",
    autoAlpha: 1,
    display: "block",
    pointerEvents: "none",
  });

  coverTween = gsap.timeline({
    onComplete: () => {
      coverTween = null;
      transition.onCoverComplete();
    },
  });

  // 第 1 层先出来
  coverTween.fromTo(
    layer1Ref.value,
    { y: "105%" },
    {
      y: "0%",
      duration: coveringDuration1,
      ease: "power3.inOut",
    },
    0,
  );

  // 第 1 层出来 20% 后，第 2 层出来
  coverTween.fromTo(
    layer2Ref.value,
    { y: "105%" },
    {
      y: "0%",
      duration: coveringDuration2,
      ease: "power3.inOut",
    },
    coverStart2,
  );

  // 第 2 层出来 20% 后，第 3 层出来
  coverTween.fromTo(
    layer3Ref.value,
    { y: "105%" },
    {
      y: "0%",
      duration: coveringDuration3,
      ease: "power3.inOut",
    },
    coverStart3,
  );
};

const animateReveal = () => {
  revealTween?.kill();
  revealTween = null;

  coverTween?.kill();
  coverTween = null;

  const layers = getLayers();

  if (layers.some((layer) => !layer)) return;

  gsap.set(layers, {
    y: "0%",
    autoAlpha: 1,
    display: "block",
    pointerEvents: "none",
  });

  revealTween = gsap.timeline({
    onComplete: () => {
      revealTween = null;

      gsap.set(layers, {
        y: "105%",
        autoAlpha: 0,
        display: "none",
        pointerEvents: "none",
      });

      transition.onRevealComplete();
    },
  });

  // 退场：第 3 层先走
  revealTween.fromTo(
    layer3Ref.value,
    { y: "0%" },
    {
      y: "-105%",
      duration: revealingDuration3,
      ease: "power3.inOut",
    },
    0,
  );

  // 第 3 层走了 20% 后，第 2 层走
  revealTween.fromTo(
    layer2Ref.value,
    { y: "0%" },
    {
      y: "-105%",
      duration: revealingDuration2,
      ease: "power3.inOut",
    },
    revealStart2,
  );

  // 第 2 层走了 20% 后，第 1 层走
  revealTween.fromTo(
    layer1Ref.value,
    { y: "0%" },
    {
      y: "-105%",
      duration: revealingDuration1,
      ease: "power3.inOut",
    },
    revealStart1,
  );
};

onMounted(() => {
  if (transition.phase.value === "idle") {
    resetLayers();
  }
});

onBeforeUnmount(() => {
  resetLayers();
});

watch(
  () => transition.phase.value,
  (newPhase) => {
    if (newPhase === "covering") {
      animateCover();
    } else if (newPhase === "revealing") {
      animateReveal();
    } else if (newPhase === "idle") {
      resetLayers();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <div
      ref="layer1Ref"
      class="transition-layer transition-layer-1"
      :style="{ backgroundColor: layer1Color }"
      aria-hidden="true"
    ></div>

    <div
      ref="layer2Ref"
      class="transition-layer transition-layer-2"
      :style="{ backgroundColor: layer2Color }"
      aria-hidden="true"
    ></div>

    <div
      ref="layer3Ref"
      class="transition-layer transition-layer-3"
      :style="{ backgroundColor: layer3Color }"
      aria-hidden="true"
    ></div>
  </Teleport>
</template>

<style scoped>
.transition-layer {
  position: fixed;
  inset: 0;
  display: none;
  width: 100vw;
  height: 100vh;
  will-change: transform;
  pointer-events: none;
  visibility: hidden;
}

.transition-layer-1 {
  z-index: 9997;
}

.transition-layer-2 {
  z-index: 9998;
}

.transition-layer-3 {
  z-index: 9999;
}
</style>
