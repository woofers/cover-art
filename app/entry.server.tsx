import React, { StrictMode } from 'react'
import App from './routes/_index'

export async function render() {
  const ReactDOMServer = await import('react-dom/server')
  return ReactDOMServer.renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

