import { defineConfig } from 'nitro'

export default defineConfig({
  compatibilityDate: '2026-05-01',
  serverDir: true,
  renderer: false,
  routeRules: {
    '/': {
      redirect: 'https://silentdepth.notion.site/SILENT-WIDGETS-8398fc74d82447c687c8b03a08c244c6',
    },
  },
  preset: 'cloudflare-module',
  cloudflare: {
    wrangler: {
      keep_vars: true,
    },
  },
})
