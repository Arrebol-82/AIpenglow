<script setup lang="ts">
useHead({
  style: [
    {
      key: "alpenglow-critical-boot-style",
      innerHTML:
        "html,body{margin:0;display:block!important;background:#f6f1e7;color:#2f3a4a}",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
