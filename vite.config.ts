import { resolve } from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import presetUno from 'unocss/preset-uno'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    unocss({
      presets: [presetUno({ dark: 'media' })],
    }),
    vue({ reactivityTransform: true }),
  ],
  resolve: {
    alias: {
      '~/': resolve(__dirname, 'src') + '/',
    },
  },
  appType: 'mpa',
  root: './widgets',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolveBuildInputs(),
    },
  },
})

function resolveBuildInputs () {
  const names = fs.readdirSync(resolve(__dirname, 'widgets'))
  return Object.fromEntries(names.map(name => [name, resolve(__dirname, 'widgets', name, 'index.html')]))
}
