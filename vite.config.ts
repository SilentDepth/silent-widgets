import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
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
  plugins: [vue(), tailwindcss(), nitro()],
  environments: {
    client: { build: { rolldownOptions: { input: './app/entry-client.ts' } } },
    ssr: {
      // resolve: {
      //   noExternal: [/^(?:vue|@vue)(?:\/.*)?$/],
      // },
      build: { rolldownOptions: { input: './app/entry-server.ts' } },
    },
  },
  resolve: {
    // Workaround to Vue 3.6 beta not exporting vapor mode in CJS build
    alias: [
      { find: /^vue$/, replacement: 'vue/dist/vue.runtime.esm-bundler.js' },
      {
        find: /^@vue\/compiler-core$/,
        replacement: '@vue/compiler-core/dist/compiler-core.esm-bundler.js',
      },
      {
        find: /^@vue\/compiler-dom$/,
        replacement: '@vue/compiler-dom/dist/compiler-dom.esm-bundler.js',
      },
      {
        find: /^@vue\/compiler-vapor$/,
        replacement: '@vue/compiler-vapor/dist/compiler-vapor.esm-browser.js',
      },
      { find: /^@vue\/reactivity$/, replacement: '@vue/reactivity/dist/reactivity.esm-bundler.js' },
      {
        find: /^@vue\/runtime-core$/,
        replacement: '@vue/runtime-core/dist/runtime-core.esm-bundler.js',
      },
      {
        find: /^@vue\/runtime-dom$/,
        replacement: '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js',
      },
      {
        find: /^@vue\/runtime-vapor$/,
        replacement: '@vue/runtime-vapor/dist/runtime-vapor.esm-bundler.js',
      },
      {
        find: /^@vue\/server-renderer$/,
        replacement: '@vue/server-renderer/dist/server-renderer.esm-bundler.js',
      },
      { find: /^@vue\/shared$/, replacement: '@vue/shared/dist/shared.esm-bundler.js' },
    ],
    tsconfigPaths: true,
  },
})
