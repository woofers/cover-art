import { createRsbuild, loadConfig } from '@rsbuild/core'
import Fastify from 'fastify'
import expressFastify from '@fastify/express'

const getAssetMap = async stats => {
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles()
  const jsChunks = entryChunks.filter(chunk => chunk.endsWith('.js'))
  const cssEntry = entryChunks.find(chunk => chunk.endsWith('.css'))
  const data = {
    chunks: {
      '/': jsChunks
    },
    css: cssEntry
  }
  return data
}

const serverRender = serverAPI => async (request, reply) => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const stats = await serverAPI.environments.web.getStats()
  const assetMap = await getAssetMap(stats)
  const { stream } = await indexModule.render(assetMap)
  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'text/html')
  const response = new Response(stream, {
    headers: responseHeaders,
    status: 200
  })
  return reply.send(response)
}

async function startDevServer() {
  const { content } = await loadConfig({})
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })
  const app = Fastify({
    logger: false
  })
  await app.register(expressFastify)
  const rsbuildServer = await rsbuild.createDevServer()
  const serverRenderMiddleware = serverRender(rsbuildServer)
  app.get('/', async (request, reply) => {
    try {
      const res = await serverRenderMiddleware(request, reply)
      return res
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
    }
  })
  app.use((req, res, next) => {
    if (req.path === '/') {
      return next()
    }
    return rsbuildServer.middlewares(req, res, next)
  })

  await app.listen({ port: rsbuildServer.port })
  await rsbuildServer.afterListen()
  rsbuildServer.connectWebSocket({ server: app.server })
}

startDevServer(process.cwd())
