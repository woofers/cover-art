import React from 'react'
import { redirect, type RouteObject } from 'react-router'

const _reactRouterLazy =
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
  },
  {
    path: '/redirect',
    loader: async () => {
      return redirect("/about")
    }
  }
] satisfies RouteObject[]
