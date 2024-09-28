import React, { StrictMode } from 'react'
import { PassThrough } from 'stream'
import App from './app'

let responseStatusCode = 200

export async function render(scripts: string[] = []) {
  const body = new PassThrough()
  const ReactDOMServer = await import('react-dom/server')
  const promise = new Promise<void>((resolve, reject) => {
    const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
      <StrictMode>
        <App />
      </StrictMode>,
      {
        bootstrapScripts: scripts,
        onAllReady() {
          resolve()
        },
        onShellReady() {
          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          console.error(error)
        }
      }
    )
  })
  return { stream: body, promise }
}
