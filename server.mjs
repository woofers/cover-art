import { createRsbuild, loadConfig } from '@rsbuild/core'
import Fastify from 'fastify'
import expressFastify from '@fastify/express'
import { getAssetMap } from './plugin-emit-stats.mjs'

const serverRender = serverAPI => async (request, reply) => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const ua = request.headers['user-agent']
  const stats = await serverAPI.environments.web.getStats()
  const assetMap = await getAssetMap(stats)
  const response = await indexModule.render(assetMap, ua)
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
  app.get('*', async (request, reply) => {
    try {
      const res = await serverRenderMiddleware(request, reply)
      return res
    } catch (err) {
      console.error('SSR render error\n', err)
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

void startDevServer(process.cwd())
