import { defineEventHandler } from 'nuxt/server'
import manifest from '#widget-assets'
import { renderWidget } from '#widget-renderer'

export default defineEventHandler(event => {
  event.res.headers.set('Content-Type', 'text/html;charset=utf-8')
  event.res.headers.set('Vary', 'Accept-Language')
  return renderWidget(event.req, manifest)
})
