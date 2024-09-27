import type { MetaFunction } from '@remix-run/node'
import { ThreeCanvas } from 'components/three-canvas'

export const meta: MetaFunction = () => [
  { title: 'Cover Art' },
  { name: 'description', content: 'Testing cover art' }
]

const Index = () => {
  console.log(process.env.NODE_ENV)
  return <ThreeCanvas />
}

export default Index
