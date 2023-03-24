import 'uno.css'
import React, { type FunctionComponent } from 'react'
import ReactDOM from 'react-dom/client'

import '~/style.css'

import('@vercel/analytics').then(({ inject }) => inject(), () => {})

export default function createWidget (App: FunctionComponent) {
  const params = Object.fromEntries(new URL(location.href).searchParams.entries()) as Record<string, string | boolean>
  for (const [key, value] of Object.entries(params)) {
    if (value === '') params[key] = true
  }

  ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
      <App {...params}/>
    </React.StrictMode>
  )
}
