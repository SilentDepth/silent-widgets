import { defineConfig } from 'nitro'

export default defineConfig({
  compatibilityDate: '2026-05-01',
  serverDir: true,
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
