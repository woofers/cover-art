import React, { StrictMode } from 'react'
import App from './app'
import { isBot, type AssetMap } from './utils'
import { createRouter } from './router'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'

const headers = { 'content-type': 'text/html' }

export async function render(assetMap = {} as AssetMap, ua: string) {
  const router = createRouter()
  const memoryHistory = createMemoryHistory({
    initialEntries: ["/"],
  })
  router.update({
    history: memoryHistory,
  })
  await router.load()
  const { renderToReadableStream } = await import(
    'react-dom/server.edge' as 'react-dom/server'
  )
  const isCrawler = isBot(ua)
  try {
    let didError = false
    const stream = await renderToReadableStream(
      <StrictMode>
        <App assetMap={assetMap}>
          <RouterProvider router={router} />
          </App>
      </StrictMode>,
      {
        bootstrapScripts: assetMap.chunks['/'],
        bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
        onError(error: unknown) {
          didError = true
          console.error(error ?? 'Request was aborted')
        }
      }
    )
    if (isCrawler) {
      await stream.allReady
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers
    })
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers
    })
  }
}
