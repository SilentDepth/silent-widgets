export default defineNuxtPlugin(nuxtApp => {
  const route = useRoute()
  let path = route.path
  nuxtApp.hook('page:finish', () => {
    if (route.path === path) return
    path = route.path
    if (route.meta.layout !== 'site') return
    const heading = document.querySelector('h1')
    heading?.setAttribute('tabindex', '-1')
    heading?.focus({ preventScroll: true })
  })
})
