import { writeFile } from 'node:fs/promises'

/**
 */
const getAssetMap = async stats => {
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles()
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
        const assetMap = await getAssetMap(webStats)
        await writeFile(
          './build/build-manifest.json',
          JSON.stringify(assetMap, null, 2),
          'utf-8'
        )
      })
    }
  }
}
