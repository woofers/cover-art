import Index from './routes/_index'
import "./tailwind.css"

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
          <Index />
        </div>
      </div>
    </body>
  </html>
)

export default App
