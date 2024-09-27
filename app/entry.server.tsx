import { StrictMode } from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './routes/_index'

export function render() {
  return ReactDOMServer.renderToString(
    <StrictMode>
      <div className="flex min-h-screen flex-col text-zinc-800 bg-zinc-200 font-sans">
        <App />
      </div>
    </StrictMode>
  )
}
