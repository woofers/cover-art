import React from 'react'
import Index from './routes/_index'
import './tailwind.css'
import Delay from './delay'

const App = () => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/cover-art/favicon.ico" />
    </head>
    <body>
      <div id="root">
        <div className="flex min-h-screen flex-col text-zinc-800 bg-zinc-200 font-sans">
          <React.Suspense fallback={<p>Loading 1</p>}>
            <Delay delay={2000} />
          </React.Suspense>

          <React.Suspense fallback={<p>Loading 5</p>}>

            <Delay delay={5000} />
          </React.Suspense>
          <React.Suspense fallback={<p>Loading 3</p>}>
            <Delay delay={1000} />
          </React.Suspense>
        </div>
      </div>
    </body>
  </html>
)

export default App
