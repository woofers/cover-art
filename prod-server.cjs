const fs = require('fs/promises')
const path = require('path')
const honoServer = require('@hono/node-server')
const honoStatic = require('@hono/node-server/serve-static')
const h = require('hono')

const serverRender = async (c, assetMap) => {
  const remotesPath = path.join(process.cwd(), `./build/server/index.js`)
  const importedApp = require(remotesPath)
  const { stream } = await importedApp.render(assetMap)
  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'text/html')
  return new Response(stream, {
    headers: responseHeaders,
    status: 200
  })
}

const port = process.env.PORT || 3000

const readManifest = async () => {
  const content = await fs.readFile('./build/build-manifest.json', {
    encoding: 'utf-8'
  })
  const data = JSON.parse(content)
  return data
}

async function preview() {
  const app = new h.Hono()
  const assetMap = await readManifest()
  app.get('/', async (c, next) => {
    try {
      const res = await serverRender(c, assetMap)
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
