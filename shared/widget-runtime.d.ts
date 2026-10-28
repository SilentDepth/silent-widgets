declare module '#widget-renderer' {
  export function renderWidget(request: Request, manifest: import('vite').Manifest): Promise<string>
}

declare module '#widget-assets' {
  const manifest: import('vite').Manifest
  export default manifest
}
