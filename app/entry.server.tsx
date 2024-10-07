import React, { StrictMode } from 'react'
import App from './app'
import { isBot, type AssetMap } from './utils'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider
} from 'react-router-dom/server'
import { routes } from './routes'

const headers = { 'content-type': 'text/html' }

export const handler = createStaticHandler(routes)

const getRouterAndContext = async (request: Request) => {
  const context = await handler.query(request)
  if (context instanceof Response) {
    return { context } as never
  }
  const router = createStaticRouter(handler.dataRoutes, context)
  return { router, context: context as typeof context | Response }
}

const ABORT_DELAY = 10_000

export async function render(
  assetMap = {} as AssetMap,
  ua: string,
  request: Request
) {
  const url = new URL(request.url)
  const controller = new AbortController()
  setTimeout(() => {
    controller.abort()
  }, ABORT_DELAY)
  const isCrawler = isBot(ua)
  try {
    let didError = false
    const { router, context } = await getRouterAndContext(request)
    if (context instanceof Response) {
      if ([301, 302, 303, 307, 308].includes(context.status)) {
        const location = context.headers.get('Location') ?? '/'
        return Response.redirect(
          location.startsWith('/') ? url.origin + location : location,
          context.status
        )
      } else {
        throw new Error(`Can not redirect to a status of "${context.status}"`)
      }
    }
    const { renderToReadableStream } = await import(
      'react-dom/server.edge' as 'react-dom/server'
    )
    const stream = await renderToReadableStream(
      <StrictMode>
        <App assetMap={assetMap}>
          <StaticRouterProvider
            router={router}
            context={context}
            hydrate={true}
          />
        </App>
      </StrictMode>,
      {
        bootstrapScripts: assetMap.chunks['/'],
        bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
        signal: controller.signal,
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
    console.error(error)
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers
    })
  }
}
