declare module '*.vue' {
  import type { DefineVaporComponent } from 'vue'
  const component: DefineVaporComponent<{}, {}, any>
  export default component
}
