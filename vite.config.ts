import transformerDirectives from '@unocss/transformer-directives'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import presetUno from 'unocss/preset-uno'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    sortImports: {
      groups: [
        'builtin',
        'side_effect',
        'external',
        'unplugin-icons',
        'src-aliases',
        ['parent', 'sibling', 'index'],
        'unknown',
      ],
      customGroups: [
        {
          groupName: 'unplugin-icons',
          elementNamePattern: ['~icons/**'],
        },
        {
          groupName: 'src-aliases',
          elementNamePattern: ['#/**'],
        },
      ],
      newlinesBetween: false,
      partitionByNewline: false,
    },
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    nitro(),
    vue(),
    unocss({
      presets: [presetUno({ dark: 'media' })],
      transformers: [transformerDirectives()],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
