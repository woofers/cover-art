import { createRsbuild, loadConfig } from '@rsbuild/core'
import Fastify from 'fastify'
import expressFastify from '@fastify/express'
import { createStandardRequest } from 'fastify-standard-request-reply'
import { getAssetMap } from './plugin-emit-stats.mjs'

/**
 * @param {Awaited<ReturnType<Awaited<ReturnType<import('@rsbuild/core').createRsbuild>>['createDevServer']>>} serverAPI
 */
const serverRender = serverAPI => async (request, reply) => {
  /**
   * @type {{ render: (...args: unknown[]) => Promise<Response> }}
   */
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const ua = request.headers['user-agent']
  const stats = await serverAPI.environments.web.getStats()
  const assetMap = await getAssetMap(stats)
  console.log(assetMap)
  const standardRequsest = createStandardRequest(request, reply)
  const response = await indexModule.render(assetMap, ua, standardRequsest)
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
    if (req.path === '/' || req.path === '/about') {
      return next()
    }
    return rsbuildServer.middlewares(req, res, next)
  })
  await app.listen({ port: rsbuildServer.port })
  await rsbuildServer.afterListen()
  rsbuildServer.connectWebSocket({ server: app.server })
}

void startDevServer(process.cwd())
