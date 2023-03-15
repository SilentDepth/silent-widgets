import 'uno.css'
import React, { type FunctionComponent } from 'react'
import ReactDOM from 'react-dom/client'

import '~/style.css'

import('@vercel/analytics').then(({ inject }) => inject(), () => {})

export default function createWidget (App: FunctionComponent) {
  const params = Object.fromEntries(new URL(location.href).searchParams.entries())
  ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
      <App {...params}/>
    </React.StrictMode>
  )
}
