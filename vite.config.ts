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
})
