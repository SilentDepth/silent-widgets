export default defineNuxtRouteMiddleware((to, from) => {
  to.meta.viewTransition =
    (to.path === '/' && from.meta.layout === 'site') ||
    (from.path === '/' && to.meta.layout === 'site')
})
