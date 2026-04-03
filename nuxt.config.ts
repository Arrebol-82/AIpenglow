import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    lastfmApiKey: process.env.LASTFM_API_KEY || '',
    lastfmUser: process.env.LASTFM_USER || '',
    lastfmEndpoint: process.env.LASTFM_ENDPOINT || ''
  },
  app: {
    head: {
      title: 'Alpenglow - Still Becoming',
      htmlAttrs: {
        lang: 'en',
        class: 'light'
      },
      bodyAttrs: {
        class: 'bg-background text-on-background font-body overflow-x-hidden'
      },
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700&family=LXGW+WenKai&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
        }
      ]
    }
  },
  tailwindcss: {
    cssPath: false
  }
})
