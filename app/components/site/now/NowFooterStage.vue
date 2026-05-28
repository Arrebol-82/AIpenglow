<template>
  <section class="now-footer-stage">
    <!-- 固定在后面的 Now 页面 -->
    <div class="now-sticky-layer">
      <div class="now-sticky-inner">
        <SectionNow />
      </div>
    </div>

    <!-- 留一段滚动距离，让 Now 先固定停住 -->
    <div class="now-footer-delay" aria-hidden="true"></div>

    <!-- Footer 从下面往上覆盖 Now -->
    <div class="footer-cover-layer">
      <TheFooter />
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionNow from "~/components/site/now/SectionNow.vue";
import TheFooter from "~/components/layout/TheFooter.vue";
</script>

<style scoped>
.now-footer-stage {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  background: #f6f1e7;
}

/*
 * Now 页面固定层：
 * 当滚动进入这个区域后，Now 会停在视口中不动。
 */
.now-sticky-layer {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100vw;
  min-height: 100vh;
  background: #f6f1e7;
  overflow: hidden;
}

/*
 * 给 Now 页面恢复正常左右边距。
 * 这里对应你 main 之前的 px-6 / md:px-12 / xl:px-[60px]。
 */
.now-sticky-inner {
  width: 100%;
  min-height: 100vh;
  padding-inline: 1.5rem;
}

@media (min-width: 768px) {
  .now-sticky-inner {
    padding-inline: 3rem;
  }
}

@media (min-width: 1280px) {
  .now-sticky-inner {
    padding-inline: 60px;
  }
}

/*
 * 控制 Now 固定多久之后，Footer 开始覆盖。
 * 想让 Footer 更早上来，就调小。
 * 想让 Now 固定更久，就调大。
 */
.now-footer-delay {
  position: relative;
  z-index: 2;
  height: clamp(10rem, 32vh, 24rem);
  pointer-events: none;
}

/*
 * Footer 覆盖层：
 * z-index 比 Now 高，所以会从下往上盖住 Now。
 */
.footer-cover-layer {
  position: relative;
  z-index: 10;
  width: 100vw;
}
</style>
