import { createHead } from '@unhead/vue/client'
import { createVaporApp } from 'vue'
import App from './app.vue'

async function main() {
  const name = location.pathname.split('/')[1]

  const app = createVaporApp(App, { name })
  const head = createHead()
  app.use(head).mount('#root')
}

// oxlint-disable-next-line typescript/no-floating-promises
main()
