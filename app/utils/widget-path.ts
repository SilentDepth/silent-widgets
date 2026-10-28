export function widgetIdFromPath(pathname: string) {
  const match = /^\/([^/]+)\/?$/.exec(pathname)
  if (!match) return
  try {
    return decodeURIComponent(match[1])
  } catch {
    return
  }
}
