import 'uno.css'
import React, { type FunctionComponent } from 'react'
import ReactDOM from 'react-dom/client'

import '~/style.scss'

import('@vercel/analytics').then(({ inject }) => inject(), () => {})

type Params = Record<string, string | boolean>
type ParamsNormalized = Params & {
  bg: string
}

export default function createWidget (App: FunctionComponent) {
  const params = normalizeParams(Object.fromEntries(new URL(location.href).searchParams.entries()) as Params)

  if (params.bg) {
    const colors = params.bg.split(',')
    document.documentElement.style.setProperty('--bg-color', colors[0])
    document.documentElement.style.setProperty('--bg-color-dark', colors[1] || colors[0])
  }

  ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
      <App {...params as object}/>
    </React.StrictMode>
  )
}

function normalizeParams (params: Params) {
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'bg':
        params.bg = String(value)
        break
      default:
        value === '' && (params[key] = true)
    }
  }
  return params as ParamsNormalized
}
