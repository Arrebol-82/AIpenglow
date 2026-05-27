<template>
  <div v-if="enable" class="works-card-scene works-card-scene--overlay">
    <div ref="shadowRef" class="works-card-shadow" :style="shadowStyle"></div>
    <canvas ref="canvasRef" class="works-three-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useWorksCard3D } from "./useWorksCard3D";

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

useWorksCard3D(canvasRef, shadowRef, shadowStyle, props);
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
