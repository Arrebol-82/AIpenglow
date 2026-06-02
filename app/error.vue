<script setup lang="ts">
import AdminStarCanvas from "~/components/transition/AdminStarCanvas.vue";

const props = defineProps<{
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  };
}>();

const handleBackHome = () => {
  clearError({ redirect: "/" });
};
</script>

<template>
  <main
    class="relative min-h-screen overflow-hidden bg-black text-white"
    aria-label="Error page"
  >
    <AdminStarCanvas />

    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(0,0,0,0.72)_58%,rgba(0,0,0,0.95)_100%)]"
      aria-hidden="true"
    ></div>

    <section
      class="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p class="text-xs uppercase tracking-[0.45em] text-white/50">
        {{ props.error.statusCode || 500 }}
      </p>

      <h1
        class="mt-6 max-w-3xl text-4xl font-medium leading-[1.28] tracking-[-0.03em] text-white/90 md:text-6xl"
        style="
          font-family:
            &quot;LXGW WenKai&quot;, &quot;Noto Serif SC&quot;, serif;
        "
      >
        没关系，迷路的页面，也会通向更亮的地方。
      </h1>
      <button
        class="mt-10 border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.28em] text-white transition hover:border-white hover:bg-white hover:text-black"
        type="button"
        @click="handleBackHome"
      >
        Back Home
      </button>
    </section>
  </main>
</template>
