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
})
