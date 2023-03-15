import { resolve } from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import presetUno from 'unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    unocss({
      presets: [presetUno({ dark: 'media' })],
      transformers: [transformerDirectives()],
    }),
    react(),
  ],
  resolve: {
    alias: {
      '~/': resolve(__dirname, 'src') + '/',
    },
  },
  appType: 'mpa',
  root: './widgets',
  publicDir: resolve(__dirname, 'public'),
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
