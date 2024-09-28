import { createRsbuild, loadConfig } from '@rsbuild/core'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const getStats = async serverAPI => {
  const stats = await serverAPI.environments.web.getStats()
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles()
  const jsChunks = entryChunks.filter(chunk => chunk.endsWith(".js"))
  const cssEntry = entryChunks.find(chunk => chunk.endsWith(".css"))
  return [jsChunks, cssEntry]
}

async function startBuildServer() {
  const { content } = await loadConfig({ envMode: 'production' })
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
    mode: ["production"]
  })
  const rsbuildServer = await rsbuild.createDevServer()
  rsbuildServer.build
  const stats = await getStats(rsbuildServer)
  await rsbuildServer.close()
  console.log(stats)
  const { close } = await rsbuild.build({})
  await close()
}

startBuildServer(process.cwd())
