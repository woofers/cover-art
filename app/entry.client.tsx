import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createRouter } from './router'
import App from './app'
import { RouterProvider } from '@tanstack/react-router'

const router = createRouter()

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
