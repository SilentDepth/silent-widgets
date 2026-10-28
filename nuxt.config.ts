import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-01',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  vue: { vapor: true },
  typescript: {
    tsConfig: { compilerOptions: { noUncheckedIndexedAccess: false } },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: { include: ['@vueuse/core', 'ts-pattern'] },
  },
  experimental: { viewTransition: true },
  runtimeConfig: { githubApiToken: '' },
  routeRules: {
    '/**': { headers: { Vary: 'Accept-Language, Cookie' } },
  },
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      wrangler: { name: 'silent-widgets', keep_vars: true },
    },
  },
})
