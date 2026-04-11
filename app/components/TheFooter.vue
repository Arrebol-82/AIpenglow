<template>
  <footer class="w-full border-t border-outline/30 bg-background py-6 md:py-7">
    <div class="flex w-full flex-col items-center justify-between gap-3 px-6 md:flex-row md:px-12 xl:px-[60px]">
      <div class="font-headline text-xl font-semibold tracking-[-0.03em] text-on-background">Alpenglow</div>
      <div class="flex gap-8">
        <a
          class="footer-link font-label text-[9px] font-medium uppercase tracking-[0.14em] text-on-background/70 hover:text-primary"
          href="#"
        >
          Archive
        </a>
        <a
          class="footer-link font-label text-[9px] font-medium uppercase tracking-[0.14em] text-on-background/70 hover:text-primary"
          href="#"
        >
          Privacy
        </a>
        <a
          class="footer-link font-label text-[9px] font-medium uppercase tracking-[0.14em] text-on-background/70 hover:text-primary"
          href="#"
        >
          Colophon
        </a>
      </div>
      <div class="font-label text-[9px] font-medium uppercase tracking-[0.14em] text-on-background/52">
        &copy; 2026 Alpenglow. Curated with intention.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  position: relative;
  opacity: 0.7;
  transition:
    color 0.5s cubic-bezier(0.2, 1, 0.2, 1),
    opacity 0.5s cubic-bezier(0.2, 1, 0.2, 1);
}

.footer-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.38rem;
  height: 0.5px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.5s cubic-bezier(0.2, 1, 0.2, 1);
}

.footer-link:hover {
  opacity: 1;
}

.footer-link:hover::after {
  transform: scaleX(1);
}
</style>
