import { pluginReact } from '@rsbuild/plugin-react'

export default {
  plugins: [pluginReact()],
  environments: {
    web: {
      output: {
        distPath: { root: 'build' },
        target: 'web'
      },
      source: {
        entry: {
          index: './app/entry.client'
        }
      }
    },
    ssr: {
      output: {
        target: 'node',
        distPath: {
          root: 'build/server'
        }
      },
      source: {
        entry: {
          index: './app/entry.server'
        }
      }
    }
  },
  html: {
    template: './index.html'
  },
  output: {
    distPath: { root: 'build' }
  }
}
