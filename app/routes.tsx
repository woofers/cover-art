import React from 'react'
import type { RouteObject } from 'react-router'

const reactRouterLazy =
  <T extends React.ComponentType>(loader: () => Promise<{ default: T }>) =>
  () =>
    loader().then(ex => ({ Component: ex.default }))

export const routes = [
  {
    path: '*',
    Component: React.lazy(() => import('./routes/_error'))
  },
  {
    path: '/',
    Component: React.lazy(() => import('./routes/_index'))
  },
  {
    path: '/about',
    Component: React.lazy(() => import('./routes/about'))
  }
] satisfies RouteObject[]
