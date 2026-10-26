import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import autoImport from 'unplugin-auto-import/vite'
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
          elementNamePattern: ['@/**'],
        },
      ],
      newlinesBetween: false,
      partitionByNewline: false,
    },
  },
  lint: { options: { typeAware: true, typeCheck: true } },

  plugins: [
    autoImport({
      imports: [
        'vue',
        '@vueuse/core',
        { from: 'vue', imports: ['VaporComponent'], type: true },
        { from: 'ts-pattern', imports: ['match', 'isMatching', 'P'] },
        { from: 'type-fest', imports: ['JsonObject', 'ValueOf'], type: true },
      ],
    }),
    nitro(),
    vue(),
    tailwindcss(),
  ],
  devtools: {
    enabled: true,
    apply: 'serve',
  },
  environments: {
    client: {
      build: {
        rolldownOptions: { input: './app/entry-client.ts' },
      },
    },
    ssr: {
      build: {
        rolldownOptions: { input: './app/entry-server.ts' },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
})
