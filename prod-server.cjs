const fs = require('fs')
const path = require('path')
const express = require('express')

const serverRender = (_req, res) => {
  const remotesPath = path.join(process.cwd(), `./build/server/index.js`)
  const importedApp = require(remotesPath)
  const markup = importedApp.render()
  const template = fs.readFileSync(`${process.cwd()}/build/index.html`, 'utf-8')
  const html = template.replace(`<!--app-content-->`, markup)
  res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
}

const port = process.env.PORT || 3000

async function preview() {
  const app = express()
  app.get('/', (req, res, next) => {
    try {
      serverRender(req, res, next)
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      next()
    }
  })
  app.use(express.static('build'))
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}

preview(process.cwd())

module.exports = preview
