const fs = require('fs')
const path = require('path')
const honoServer = require('@hono/node-server')
const honoStatic = require('@hono/node-server/serve-static')
const h = require('hono')
const glob = require('fast-glob');

const serverRender = async (c, scripts) => {
  const remotesPath = path.join(process.cwd(), `./build/server/index.js`)
  const importedApp = require(remotesPath)
  const { stream } = await importedApp.render(scripts)
  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'text/html')
  return new Response(stream, {
    headers: responseHeaders,
    status: 200
  })
}

const port = process.env.PORT || 3000

const prefix = /^\.\/build\//g

async function preview() {
  const app = new h.Hono()
  const files = await glob('./build/static/js/**/*.js')
  const scripts = files.map(file => file.replace(prefix, ''))
  app.get('/', async (c, next) => {
    try {
      const res = await serverRender(c, scripts)
      return res
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      await next()
    }
  })
  app.use('/*', honoStatic.serveStatic({ root: './build' }))
  honoServer.serve(
    {
      fetch: app.fetch,
      port
    },
    () => {
      console.log(`Server started at http://localhost:${port}`)
    }
  )
}

preview(process.cwd())

module.exports = preview
