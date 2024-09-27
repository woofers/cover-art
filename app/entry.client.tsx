import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/_index'
import './tailwind.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <div className="flex min-h-screen flex-col text-zinc-800 bg-zinc-200 font-sans">
      <App />
    </div>
  </StrictMode>
)
