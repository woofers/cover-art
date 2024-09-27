const fs = require('fs')
const path = require('path')
const honoServer = require('@hono/node-server')
const honoStatic = require('@hono/node-server/serve-static')
const h = require('hono')

const serverRender = c => {
  const remotesPath = path.join(process.cwd(), `./build/server/index.js`)
  const importedApp = require(remotesPath)
  const markup = importedApp.render()
  const template = fs.readFileSync(`${process.cwd()}/build/index.html`, 'utf-8')
  const html = template.replace(`<!--app-content-->`, markup)
  c.header('Content-Type', 'text/html')
  c.status(200)
  return c.body(html)
}

const port = process.env.PORT || 3000

async function preview() {
  const app = new h.Hono()
  app.get('/', async (c, next) => {
    try {
      const res = serverRender(c)
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
