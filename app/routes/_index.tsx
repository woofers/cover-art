import React from 'react'
import { Layout } from '../layout'
import Delay from 'app/delay'
import { Link } from 'react-router-dom'
import Colors from 'components/styled/colors'

const IndexPage = () => {
  return (
    <Layout>
      <h1>Home</h1>
      <Link to="/about">Go to About</Link>
      <React.Suspense fallback={<p>Loading 2000ms</p>}>
        <Delay delay={2000} />
      </React.Suspense>
      <React.Suspense fallback={<p>Loading 4000ms</p>}>
        <Delay delay={4000} />
      </React.Suspense>
      <React.Suspense fallback={<p>Loading 1000ms</p>}>
        <Delay delay={1000} />
      </React.Suspense>
      <Colors />
    </Layout>
  )
}

export default IndexPage
