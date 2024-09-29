import React, { StrictMode } from 'react'
import { PassThrough } from 'stream'
import App from './app'
import type { AssetMap } from './utils'

export async function render(assetMap = {} as AssetMap) {
  const body = new PassThrough()
  const ReactDOMServer = await import('react-dom/server')
  const promise = new Promise<void>((resolve, reject) => {
    const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
      <StrictMode>
        <App assetMap={assetMap} />
      </StrictMode>,
      {
        bootstrapScripts: assetMap.chunks['/'],
        bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
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
    setTimeout(() => {
      abort()
      reject()
    }, 10_000)
  })
  return { stream: body, promise }
}
