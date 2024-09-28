import { createRsbuild, loadConfig } from '@rsbuild/core'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const serverRender = serverAPI => async c => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const html = await indexModule.render()
  const { stream } = await indexModule.render()
  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'text/html')
  return new Response(stream, {
    headers: responseHeaders,
    status: 200
  })
}

async function startDevServer() {
  const { content } = await loadConfig({})
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })
  const app = new Hono()
  const rsbuildServer = await rsbuild.createDevServer()
  const stats = await rsbuildServer.environments.web.getStats()
  const files = Array.from(stats.compilation.namedChunks.keys())
  console.log(files)
  const serverRenderMiddleware = serverRender(rsbuildServer)
  app.get('/', async (c, next) => {
    try {
      const res = await serverRenderMiddleware(c)
      return res
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      await next()
    }
  })

  app.use((c, next) =>
    rsbuildServer.middlewares(c.req, c.res, () => void next())
  )
  const server = serve(
    {
      fetch: app.fetch,
      port: rsbuildServer.port
    },
    () => {
      rsbuildServer.afterListen()
    }
  )
  rsbuildServer.connectWebSocket({ server: server })
}

startDevServer(process.cwd())
