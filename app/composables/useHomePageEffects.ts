import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { initPageScroll } from "./usePageScroll";

export function useHomePageEffects() {
  const revealStageRef = ref<HTMLElement | null>(null);
  const heroLayerRef = ref<HTMLElement | null>(null);
  const footerSpacerRef = ref<HTMLElement | null>(null);
  const footerRevealRef = ref<HTMLElement | null>(null);

  let revealAnimationContext: gsap.Context | null = null;
  let footerAnimationContext: gsap.Context | null = null;
  let destroyPageScroll: (() => void) | null = null;

  onMounted(async () => {
    if (!revealStageRef.value || !heroLayerRef.value) {
      return;
    }

    const pageScroll = await initPageScroll();
    if (!pageScroll) {
      return;
    }

    destroyPageScroll = pageScroll.destroy;

    revealAnimationContext = gsap.context(() => {
      const getHeroParallaxStart = () =>
        window.innerWidth < 768 ? "-2.5rem" : "-3.5rem";
      const getHeroParallaxEnd = () =>
        window.innerWidth < 768 ? "2rem" : "3rem";

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: revealStageRef.value,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          scrub: 0.9,
          pin: heroLayerRef.value,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        heroLayerRef.value,
        {
          "--hero-cover-parallax-y": getHeroParallaxStart,
        },
        {
          "--hero-cover-parallax-y": getHeroParallaxEnd,
          ease: "none",
        },
        0,
      );

      const dividerLines = gsap.utils.toArray<HTMLElement>(".divider-line");
      if (dividerLines.length) {
        gsap.fromTo(
          dividerLines,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".divider-01-02",
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          },
        );
      }
    }, revealStageRef.value);

    pageScroll.refresh();

    if (footerSpacerRef.value && footerRevealRef.value) {
      footerAnimationContext = gsap.context(() => {
        gsap.set(footerRevealRef.value, { yPercent: 100 });

        gsap.to(footerRevealRef.value, {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerSpacerRef.value,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }, footerRevealRef.value);
    }
  });

  onBeforeUnmount(() => {
    revealAnimationContext?.revert();
    revealAnimationContext = null;
    footerAnimationContext?.revert();
    footerAnimationContext = null;
    destroyPageScroll?.();
    destroyPageScroll = null;
  });

  return {
    revealStageRef,
    heroLayerRef,
    footerSpacerRef,
    footerRevealRef,
  };
}
