import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@nuxt/image"],
  css: ["~/assets/css/main.css", "lenis/dist/lenis.css"],
  icon: {
    provider: "server",
    serverBundle: {
      collections: ["logos", "mdi"],
    },
    clientBundle: {
      icons: [
        "logos:javascript",
        "logos:html-5",
        "logos:css-3",
        "logos:vue",
        "logos:nuxt-icon",
        "logos:typescript-icon",
        "logos:vitejs",
        "logos:openai-icon",
        "mdi:github",
      ],
    },
  },
  runtimeConfig: {
    lastfmApiKey: process.env.LASTFM_API_KEY || "",
    lastfmUser: process.env.LASTFM_USER || "",
    lastfmEndpoint: process.env.LASTFM_ENDPOINT || "",
  },
  image: {
    // 如果你以后用 Cloudflare 或外部图床，可以在这里配置
    format: ["webp", "avif", "jpeg"], // 优先使用 webp
  },
  app: {
    head: {
      title: "Alpenglow - Still Becoming",
      htmlAttrs: {
        lang: "en",
        class: "light",
      },
      bodyAttrs: {
        class: "bg-background text-on-background font-body",
      },
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/images/logo-2.svg",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700&family=LXGW+WenKai&family=Noto+Serif+SC:wght@400;500;700;800&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
        },
      ],
    },
  },
  tailwindcss: {
    cssPath: false,
  },
});
