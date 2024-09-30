import { pluginReact } from '@rsbuild/plugin-react'
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'
import { pluginEmitStats } from './plugin-emit-stats.mjs'

const distPath = { root: 'build' }

export default {
  plugins: [pluginReact(), pluginEmitStats()],
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({
          routesDirectory: './app/routes',
          generatedRouteTree: './app/routeTree.gen.ts'
        })
      ]
    }
  },
  environments: {
    web: {
      output: {
        distPath,
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
  output: {
    distPath
  }
}
