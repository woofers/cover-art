import { writeFile } from 'node:fs/promises'

/**
 */
const getStats = async stats => {
    const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
    const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
    const entryChunks = indexChunk.getFiles()
    const jsChunks = entryChunks.filter(chunk => chunk.endsWith(".js"))
    const cssEntry = entryChunks.find(chunk => chunk.endsWith(".css"))
    return [jsChunks, cssEntry]
  }

/**
 * @param {{}} options
 * @return {import('@rsbuild/core').RsbuildPlugin}
 */
export const pluginEmitStats = (
  options = {},
) => {
  return {
    name: 'rsbuild:emit-stats',
    /**
     * @param {import('@rsbuild/core').RsbuildPluginAPI} api
     */
    setup(api) {
        api.onAfterBuild(async result => {
          const stats = result.stats['stats']
          const webStats = stats.find(stat => stat.compilation.name === 'web')
          const [jsChunks, cssEntry] = await getStats(webStats)
          const data = {
            chunks: {
              '/': jsChunks
            },
            css: cssEntry
          }
          await writeFile('./build/build-manifest.json', JSON.stringify(data, null, 2), 'utf-8')
        })
    }
  }
}