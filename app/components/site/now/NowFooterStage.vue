<template>
  <div class="now-footer-stage">
    <div class="now-wrapper px-6 md:px-12 xl:px-[60px]">
      <div class="now-panel">
        <SectionNow />
      </div>
    </div>
    <div class="now-footer-delay" aria-hidden="true"></div>
    <div class="footer-wrapper">
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionNow from "~/components/site/now/SectionNow.vue";
import TheFooter from "~/components/layout/TheFooter.vue";
</script>

<style scoped>
.now-footer-stage {
  position: relative;
}

.now-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
  min-height: 100vh;
  padding-bottom: 6rem;
  background: #f6f1e7;
}

.now-footer-delay {
  height: clamp(14rem, 38vh, 28rem);
  background: #f6f1e7;
}

.footer-wrapper {
  position: relative;
  z-index: 10;
  margin-top: -6rem;
}
</style>
