import { writeFile } from 'node:fs/promises'

/**
 * @param {string} path
 * @return {string}
 */
const addSlash = path => {
  if (path.startsWith('/')) return path
  return `/${path}`
}

/**
 */
export const getAssetMap = async stats => {
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles().map(chunk => addSlash(chunk))
  const jsChunks = entryChunks.filter(chunk => chunk.endsWith('.js'))
  const cssEntry = entryChunks.find(chunk => chunk.endsWith('.css'))
  const data = {
    chunks: {
      '/': jsChunks
    },
    css: cssEntry
  }
  return data
}

/**
 * @param {{}} options
 * @return {import('@rsbuild/core').RsbuildPlugin}
 */
export const pluginEmitStats = (options = {}) => {
  return {
    name: 'rsbuild:emit-stats',
    /**
     * @param {import('@rsbuild/core').RsbuildPluginAPI} api
     */
    setup(api) {
      api.onAfterBuild(async result => {
        const stats = result.stats['stats']
        const webStats = stats.find(stat => stat.compilation.name === 'web')
        const folder = result.environments.web.config.output.distPath.root
        const server =
          result.environments.ssr.config.output.distPath.root + '/index.js'
        const assetMap = await getAssetMap(webStats)
        assetMap.server = `./${server}`
        assetMap.public = `./${folder}`
        await writeFile(
          `./${folder}/build-manifest.json`,
          JSON.stringify(assetMap, null, 2),
          'utf-8'
        )
      })
    }
  }
}
