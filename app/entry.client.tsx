import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import App from './app'

const router = createBrowserRouter(routes)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <App assetMap={window.assetMap}>
        <RouterProvider router={router} />
      </App>
    </StrictMode>
  )
})
