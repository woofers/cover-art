import { createRsbuild, loadConfig } from '@rsbuild/core'
import Fastify from 'fastify'
import expressFastify from '@fastify/express'
import { createStandardRequest } from 'fastify-standard-request-reply'
import { getAssetMap } from './plugin-emit-stats.mjs'

function createFetchRequest(req, res) {
  let origin = `${req.protocol}://${req.get('host')}`
  let url = new URL(req.originalUrl || req.url, origin)
  let controller = new AbortController()
  res.on('close', () => controller.abort())
  let headers = new Headers()
  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }
  let init = {
    method: req.method,
    headers,
    signal: controller.signal
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }

  return new Request(url.href, init)
}

/**
 * @typedef {Awaited<ReturnType<Awaited<ReturnType<import('@rsbuild/core').createRsbuild>>['createDevServer']>>} DevServer
 */

/**
 * @param {DevServer} serverAPI
 */
const getServerBundle = async serverAPI => {
  /**
   * @type {{ render: (...args: unknown[]) => Promise<Response>, handler: { query: (req: Request) => Promise<{ matches: unknown[] }> } }}
   */
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  return indexModule
}

/**
 * @param {DevServer} serverAPI
 */
const serverRender = serverAPI => async (request, reply) => {
  /**
   * @type {{ render: (...args: unknown[]) => Promise<Response> }}
   */
  const indexModule = await getServerBundle(serverAPI)
  const ua = request.headers['user-agent']
  const stats = await serverAPI.environments.web.getStats()
  const assetMap = await getAssetMap(stats)
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
  app.use(async (req, res, next) => {
    const indexModule = await getServerBundle(rsbuildServer)
    const standardRequsest = createFetchRequest(req, res)
    const { matches } = await indexModule.handler.query(standardRequsest)
    const uniqueMatches = matches.filter(match => match.route.path !== '*')
    if (
      uniqueMatches.length > 0 ||
      ['/404', '500', '/_error'].includes(req.path)
    ) {
      return next()
    }
    return rsbuildServer.middlewares(req, res, next)
  })
  await app.listen({ port: rsbuildServer.port })
  await rsbuildServer.afterListen()
  rsbuildServer.connectWebSocket({ server: app.server })
}

void startDevServer(process.cwd())
