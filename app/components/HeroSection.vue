<script setup lang="ts">
import heroImage from '~/assets/images/Hero_image.jpg'
</script>

<template>
  <section class="relative flex min-h-screen flex-col items-end justify-end px-6 pb-20 text-right md:px-12 md:pb-24 xl:px-[60px]">
    <div class="hero-image-stage absolute inset-0 z-0">
      <img
        alt="painterly mountain landscape at sunset with soft pastel colors and Ghibli-inspired aesthetic"
        class="hero-image transition-all duration-1000"
        data-alt="Dreamy painterly mountain range at dusk with soft oranges and teals in a Ghibli anime background style, moody and atmospheric"
        :src="heroImage"
      >
    </div>
    <div class="z-10 max-w-4xl">
      <h1
        class="hero-title mb-5 font-headline text-7xl font-bold leading-none tracking-tighter text-on-background md:text-[8.5rem]"
      >
        <span class="font-medium italic text-primary">Still</span> Becoming
      </h1>
      <p
        class="hero-subtitle ml-auto max-w-2xl font-body text-lg font-light italic tracking-tight text-on-background/78 md:text-[1.75rem]"
      >
        Tracing the soul in quiet lines, beneath the Ghibli breeze.
      </p>
    </div>
    <div class="hero-scroll-cue absolute bottom-10 left-6 text-on-background md:bottom-12 md:left-12 xl:left-[60px]">
      <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'wght' 200;">
        keyboard_double_arrow_down
      </span>
    </div>
  </section>
</template>
