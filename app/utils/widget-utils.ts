import { type } from 'arktype'

function normalizeParams(params: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value === '' ? true : value]),
  ) as Record<string, string | boolean>
}

export function parseWidgetInit(url: string, ctx?: { request?: Request; navigator?: Navigator }) {
  const urlObj = new URL(url)
  const name = urlObj.pathname.split('/')[1]
  const params = normalizeParams(Object.fromEntries(urlObj.searchParams.entries()))

  const styleProps: Record<string, string> = {}
  if (type('string > 0').allows(params.bg)) {
    const colors = params.bg.split(',')
    Object.assign(styleProps, {
      '--bg-color': colors[0],
      '--bg-color-dark': colors[1] || colors[0],
    })
  }

  return { name, params, styleProps }
}
