import { createRsbuild, loadConfig } from '@rsbuild/core'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const getStats = async stats => {
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles()
  const jsChunks = entryChunks.filter(chunk => chunk.endsWith(".js"))
  const cssEntry = entryChunks.find(chunk => chunk.endsWith(".css"))
  return [jsChunks, cssEntry]
}

const serverRender = serverAPI => async c => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const stats = await serverAPI.environments.web.getStats()
  const [jsChunks, cssEntry] = await getStats(stats)
  const { stream } = await indexModule.render(jsChunks)
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

  console.log(rsbuildServer.middlewares.handle.toString())

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
