import { createRsbuild, loadConfig } from '@rsbuild/core'
import Fastify from 'fastify'
import expressFastify from '@fastify/express'

const getStats = async stats => {
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles()
  const jsChunks = entryChunks.filter(chunk => chunk.endsWith(".js"))
  const cssEntry = entryChunks.find(chunk => chunk.endsWith(".css"))
  return [jsChunks, cssEntry]
}

const serverRender = serverAPI => async (request, reply) => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const stats = await serverAPI.environments.web.getStats()
  const [jsChunks, cssEntry] = await getStats(stats)
  const { stream } = await indexModule.render(jsChunks)
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
  app.get('/', async (request, reply, done) => {
    console.log("hi", done)
    try {
      const res = await serverRenderMiddleware(request, reply)
      return res
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      //await next()
    }
  })
  app.use(rsbuildServer.middlewares)



  await app.listen({ port: rsbuildServer.port })
  await rsbuildServer.afterListen()
  rsbuildServer.connectWebSocket({ server: app.server })
}

startDevServer(process.cwd())
