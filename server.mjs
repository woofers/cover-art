import { createRsbuild, loadConfig } from '@rsbuild/core'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { getAssetMap } from './plugin-emit-stats.mjs'

function createFetchRequest(req, res) {
  const origin = `${req.protocol}://${req.get('host')}`
  const url = new URL(req.originalUrl || req.url, origin)
  const controller = new AbortController()
  res.on('close', () => controller.abort())
  const headers = new Headers()
  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }
  const init = {
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
const serverRender = serverAPI => async c => {
  /**
   * @type {{ render: (...args: unknown[]) => Promise<Response> }}
   */
  const indexModule = await getServerBundle(serverAPI)
  const ua = c.req.header('user-agent')
  const stats = await serverAPI.environments.web.getStats()
  const assetMap = await getAssetMap(stats)
  const response = await indexModule.render(assetMap, ua, c.req.raw)
  return response
}

async function startDevServer() {
  const { content } = await loadConfig({})
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })

  const rsbuildServer = await rsbuild.createDevServer()
  const serverRenderMiddleware = serverRender(rsbuildServer)

  const app = new Hono()
  app.use(async (c, next) => {
    const indexModule = await getServerBundle(rsbuildServer)
    const { matches } = await indexModule.handler.query(c.req.raw)
    const uniqueMatches = matches.filter(match => match.route.path !== '*')
    if (
      uniqueMatches.length > 0 ||
      ['/404', '500', '/_error'].includes(c.req.raw.url)
    ) {
      return await next()
    }
    const createMiddleware = () =>
      new Promise(resolve => {
        let sent = false
        console.log(c.env.outgoing.send)
        rsbuildServer.middlewares(
          c.env.incoming,
          {
            setHeader(name, value) {
              headers.set(name, value)
              return this
            },
            end(body) {
              sent = true
              console.log(c.req.path)
              resolve(
                c.body(body, {
                  status: this.statusCode,
                  statusText: this.statusMessage,
                  headers
                })
              )
            }
          },
          () => sent || resolve(next())
        )
      })
    return await createMiddleware()
  })

  app.get('*', async (c, next) => {
    try {
      const res = await serverRenderMiddleware(c)
      return res
    } catch (err) {
      console.error('SSR render error\n', err)
      return await next()
    }
  })

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

void startDevServer(process.cwd())
