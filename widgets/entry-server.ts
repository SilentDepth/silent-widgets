import type { Manifest } from 'vite'
import { renderToString } from 'vue/server-renderer'
import { resolveLanguage } from '@/composables/use-i18n'
import { localize } from '@/i18n/text'
import { createWidgetApp } from './create-app'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`)
}

export async function renderWidget(request: Request, manifest: Manifest) {
  const url = new URL(request.url)
  const automatic = resolveLanguage(request.headers.get('accept-language'))
  const { app, widget, lang } = await createWidgetApp(url, automatic)
  const content = await renderToString(app)
  const scripts = new Set<string>()
  const styles = new Set<string>()
  const visited = new Set<string>()
  function collect(key: string) {
    const chunk = manifest[key]
    if (!chunk || visited.has(key)) return
    visited.add(key)
    scripts.add(chunk.file)
    for (const css of chunk.css ?? []) styles.add(css)
    for (const dependency of chunk.imports ?? []) collect(dependency)
  }
  const entry = manifest['widgets/entry-client.ts'].file
  collect('widgets/entry-client.ts')
  collect(`app/widgets/${widget.id}/widget.vue`)
  collect(`app/widgets/${widget.id}/i18n/${lang}.json`)
  scripts.delete(entry)
  const title = escapeHtml(`${localize(widget.meta.name, lang)} · Silent Widgets`)
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta property="og:title" content="${title}">
<meta property="og:type" content="website">
<meta property="og:url" content="${escapeHtml(new URL(`/${widget.id}`, url).href)}">
<meta property="og:image" content="${escapeHtml(new URL(widget.meta.cover, url).href)}">
${[...styles].map(file => `<link rel="stylesheet" href="/_widgets/${file}">`).join('\n')}
${[...scripts].map(file => `<link rel="modulepreload" crossorigin href="/_widgets/${file}">`).join('\n')}
<script type="module" src="/_widgets/${entry}"></script>
</head>
<body><div id="widget-root" data-language="${automatic}">${content}</div></body>
</html>`
}
