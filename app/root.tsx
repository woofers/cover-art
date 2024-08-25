import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'
import './tailwind.css'
import React from 'react'

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <div id="root">
        <div className="flex min-h-screen flex-col text-zinc-800 bg-zinc-200 font-sans">
          {children}
        </div>
      </div>
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
)

export const HydrateFallback = () => <div></div>

const App = () => <Outlet />

export default App
