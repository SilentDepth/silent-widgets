import { defineConfig } from 'nitro'

export default defineConfig({
  compatibilityDate: '2026-05-01',
  serverDir: true,
  renderer: false,
  ...(process.env.VERCEL
    ? { preset: 'vercel' }
    : {
        preset: 'cloudflare-module',
        cloudflare: {
          wrangler: {
            keep_vars: true,
          },
        },
      }),
})
