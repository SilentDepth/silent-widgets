import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    unocss(),
    vue({ reactivityTransform: true }),
  ],
})
