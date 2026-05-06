import { createApp } from 'vue'
import App from './app.vue'

async function main() {
  const app = createApp(App)
  app.mount('#root')
}

// oxlint-disable-next-line typescript/no-floating-promises
main()
