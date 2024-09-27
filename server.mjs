import { createRsbuild, loadConfig } from '@rsbuild/core'
import express from 'express'

const serverRender = serverAPI => async (_req, res) => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')
  const markup = indexModule.render()
  const template = await serverAPI.environments.web.getTransformedHtml('index')
  const html = template.replace('<!--app-content-->', markup)
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  res.end(html)
}

async function startDevServer() {
  const { content } = await loadConfig({})
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })
  const app = express()
  const rsbuildServer = await rsbuild.createDevServer()
  const serverRenderMiddleware = serverRender(rsbuildServer)
  app.get('/', async (req, res, next) => {
    try {
      await serverRenderMiddleware(req, res, next)
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      next()
    }
  })

  app.use(rsbuildServer.middlewares)
  const httpServer = app.listen(rsbuildServer.port, async () => {
    await rsbuildServer.afterListen()
  })
  rsbuildServer.connectWebSocket({ server: httpServer })
}

startDevServer(process.cwd())
