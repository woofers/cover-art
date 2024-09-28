import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './app'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <App />
    </StrictMode>
  )
})
