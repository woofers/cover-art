import type { MetaFunction } from '@remix-run/node'
import { ThreeCanvas } from 'components/three-canvas'

export const meta: MetaFunction = () => [
  { title: 'Cover Art' },
  { name: 'description', content: 'Testing cover art' }
]

const Index = () => {
  return (
    <div className="p-12">
      <h1 className="text-3xl">Cover Art</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/guides/spa-mode"
            rel="noreferrer"
          >
            SPA Mode Guide
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
      <ThreeCanvas />
    </div>
  )
}

export default Index
