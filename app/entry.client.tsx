import React, { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider
} from 'react-router-dom'
import { routes } from './routes'
import App from './app'

void hydrate()

function castToLazy<T extends {}>(route: T) {
  return route as { lazy: () => Promise<T> } & T
}

async function loadLazyRoutes() {
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    m => castToLazy(m.route).lazy
  )
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async m => {
        const routeModule = await castToLazy(m.route).lazy()
        Object.assign(m.route, { ...routeModule, lazy: undefined })
      })
    )
  }
}

async function hydrate() {
  await loadLazyRoutes()
  const router = createBrowserRouter(routes)
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <App assetMap={window.assetMap}>
          <RouterProvider router={router} fallbackElement={null} />
        </App>
      </StrictMode>
    )
  })
}
