import { pluginReact } from '@rsbuild/plugin-react'
import { basename } from './vite-paths'

export default {
  plugins: [pluginReact()],
  html: {
    template: './index.html'
  },
  server: {},
  source: {
    entry: {
      index: './app/entry.client.tsx'
    }
  },
  output: {
    assetPrefix: basename,
    distPath: { root: 'build' }
  }
}
