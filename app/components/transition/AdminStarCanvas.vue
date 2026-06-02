<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null);

interface Star {
  distance: number;
  angle: number;
  speed: number;
  size: number;
  phase: number;
  twinkleSpeed: number;
  baseAlpha: number;
  variance: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  thickness: number;
  life: number;
  maxLife: number;
}

let animationFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const parent = canvas.parentElement;
  if (!parent) return;

  let width = parent.offsetWidth;
  let height = parent.offsetHeight;

  let stars: Star[] = [];
  let meteors: Meteor[] = [];
  let nextMeteorTime = Date.now() + Math.random() * 2600;

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = parent.offsetWidth;
    height = parent.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const pivotX = () => width;
  const pivotY = () => height;

  const initStars = () => {
    stars = [];
    meteors = [];

    const maxDistance = Math.sqrt(width * width + height * height) * 1.1;
    const circleArea = Math.PI * maxDistance * maxDistance;
    const starCount = Math.floor(circleArea / 22000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        distance: Math.sqrt(Math.random()) * maxDistance,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0001 + 0.0001,
        size: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        baseAlpha: Math.random() * 0.4 + 0.5,
        variance: Math.random() * 0.2 + 0.2,
      });
    }
  };

  const spawnMeteor = () => {
    const baseSpeed = Math.random() * 3 + 4;

    meteors.push({
      x: Math.random() * width * 1.5,
      y: -50,
      vx: -baseSpeed,
      vy: baseSpeed * 1.5,
      length: Math.random() * 400 + 350,
      thickness: Math.random() * 1.2 + 1.2,
      life: 0,
      maxLife: 140 + Math.random() * 60,
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.phase += star.twinkleSpeed;
      star.angle += star.speed;

      const alpha = Math.max(
        0.15,
        Math.min(1, star.baseAlpha + Math.sin(star.phase) * star.variance),
      );

      const x = pivotX() + Math.cos(star.angle) * star.distance;
      const y = pivotY() + Math.sin(star.angle) * star.distance;

      if (x > -10 && x < width + 10 && y > -10 && y < height + 10) {
        ctx.beginPath();
        ctx.arc(Math.round(x), Math.round(y), star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    }

    const now = Date.now();

    if (now > nextMeteorTime) {
      const count = Math.random() < 0.15 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        spawnMeteor();
      }

      nextMeteorTime = now + (Math.random() * 5000 + 1000);
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const meteor = meteors[i];
      if (!meteor) continue;

      meteor.x += meteor.vx;
      meteor.y += meteor.vy;
      meteor.life++;

      const opacity = Math.max(0, 1 - meteor.life / meteor.maxLife);

      if (
        meteor.life >= meteor.maxLife ||
        opacity <= 0 ||
        meteor.x < -400 ||
        meteor.y > height + 400
      ) {
        meteors.splice(i, 1);
        continue;
      }

      const speed = Math.sqrt(meteor.vx * meteor.vx + meteor.vy * meteor.vy);
      const tailX = meteor.x - (meteor.vx / speed) * meteor.length;
      const tailY = meteor.y - (meteor.vy / speed) * meteor.length;

      const gradient = ctx.createLinearGradient(
        meteor.x,
        meteor.y,
        tailX,
        tailY,
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.7})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = meteor.thickness;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, meteor.thickness * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  resizeCanvas();
  initStars();
  draw();

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
    initStars();
  });

  resizeObserver.observe(parent);
};

onMounted(() => {
  initCanvas();
});

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  ></canvas>
</template>
