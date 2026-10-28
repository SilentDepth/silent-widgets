import process from 'node:process'
import { describe, expect, it } from 'vite-plus/test'

const base = process.env.SMOKE_BASE_URL
const widgets = [
  ['year-progress', 'Year progress'],
  ['mini-calendar', 'Mini calendar'],
  ['date-counter', 'Date counter'],
  ['daytime-meter', 'Daytime meter'],
  ['repo-stargazers', 'Repo stargazers'],
]

describe.skipIf(!base)('production SSR routes', () => {
  it.each(widgets)('renders /%s without the site layout', async (id, title) => {
    const response = await fetch(`${base}/${id}?lang=en-US`)
    const html = await response.text()
    expect(response.status).toBe(200)
    expect(html).toContain(`<title>${title} · Silent Widgets</title>`)
    expect(html).toMatch(/<html[^>]*lang="en-US"/)
    expect(html).toContain('container-type:size')
    expect(html).not.toContain('<header')
    expect(html).toContain('property="og:image"')
    expect(html).not.toContain('githubApiToken')
    expect(html).toContain('id="widget-root"')
    expect(html).toContain('src="/_widgets/')
    expect(html).not.toContain('/_nuxt/')
    expect(html).not.toContain('__NUXT')
    expect(html).not.toContain('rel="prefetch"')
    expect(response.headers.get('vary')).toMatch(/Accept-Language/i)
    const head = await fetch(`${base}/${id}`, { method: 'HEAD' })
    expect(head.status).toBe(200)
    expect(head.headers.get('content-type')).toMatch(/text\/html/)
    expect(await head.text()).toBe('')
  })

  it.each(widgets)('renders /%s/config with the editor and embed instructions', async id => {
    const response = await fetch(`${base}/${id}/config`, {
      headers: { 'accept-language': 'en-US' },
    })
    const html = await response.text()
    expect(response.status).toBe(200)
    expect(html).toContain('<header')
    expect(html).toContain('<form')
    expect(html).toContain('id="embed"')
    expect(html).toContain('id="__nuxt"')
    const iframe = html.match(/&lt;iframe[\s\S]*?&lt;\/iframe&gt;/)?.[0]
    expect(iframe).toContain(`/${id}`)
  })

  it('uses the language cookie for the site and Accept-Language for an automatic widget', async () => {
    const headers = {
      'accept-language': 'en-US',
      cookie: 'silent-widgets-language=zh-CN',
    }
    for (const [path, lang] of [
      ['/', 'zh-CN'],
      ['/mini-calendar/config', 'zh-CN'],
      ['/mini-calendar', 'en-US'],
      ['/mini-calendar?lang=zh', 'zh-CN'],
    ]) {
      const response = await fetch(`${base}${path}`, { headers })
      expect(response.status).toBe(200)
      expect(await response.text()).toMatch(new RegExp(`<html[^>]*lang="${lang}"`))
    }
  })

  it('keeps the last repeated parameter and preserves an invalid draft', async () => {
    const response = await fetch(
      `${base}/date-counter/config?event=First&event=Last&date=invalid`,
      { headers: { 'accept-language': 'en-US' } },
    )
    const html = await response.text()
    expect(response.status).toBe(200)
    expect(html).toContain('value="Last"')
    expect(html).toContain('value="invalid"')
    expect(html).toContain('Enter a valid date')
  })

  it.each(['/mini%2Dcalendar', '/%6dini-calendar', '/mini%2Dcalendar/'])(
    'renders an encoded widget URL %s',
    async path => {
      const response = await fetch(`${base}${path}?lang=en-US`)
      expect(response.status).toBe(200)
      expect(await response.text()).toContain('<title>Mini calendar · Silent Widgets</title>')
    },
  )

  it.each(['/mini%252Dcalendar', '/mini-calendar/%zz', '/mini-calendar%ZZ'])(
    'returns 404 for an unknown or malformed URL %s',
    async path => {
      expect((await fetch(`${base}${path}`)).status).toBe(404)
    },
  )

  it('renders independent widget props safely and serves its own JavaScript', async () => {
    const response = await fetch(
      `${base}/repo-stargazers?repo=First/Repo&repo=vuejs/core&lang=zh-CN`,
    )
    const html = await response.text()
    expect(html).toContain('vuejs')
    expect(html).toContain('core')
    expect(html).not.toContain('First')
    const scripts = [...html.matchAll(/(?:src|href)="(\/_widgets\/[^"?]+\.js)"/g)]
    expect(scripts.length).toBeGreaterThan(0)
    for (const [, path] of scripts) {
      const asset = await fetch(`${base}${path}`)
      expect(asset.status).toBe(200)
      expect(asset.headers.get('content-type')).toMatch(/javascript/)
    }
    const injection = await fetch(
      `${base}/repo-stargazers?repo=${encodeURIComponent('<script>/bad')}`,
    )
    const safeHtml = await injection.text()
    expect(safeHtml).not.toContain('<script>/bad')
    expect(safeHtml).not.toContain('data-repo=')
  })

  it('keeps trailing slash URLs and returns a localized 404 for an unknown widget', async () => {
    expect((await fetch(`${base}/year-progress/`)).status).toBe(200)
    expect((await fetch(`${base}/year-progress/config/`)).status).toBe(200)
    const response = await fetch(`${base}/unknown-widget`, {
      headers: { 'accept-language': 'zh-CN', accept: 'text/html' },
    })
    expect(response.status).toBe(404)
    expect(await response.text()).toContain('页面不存在')
  })
})
