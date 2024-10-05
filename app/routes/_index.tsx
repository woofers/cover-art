import React from 'react'
import Delay from 'app/delay'
import { Link } from 'react-router-dom'

const IndexPage = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">Go to About</Link>
      <Delay delay={6000} />
      <React.Suspense fallback={<p>Loading 5</p>}>
        <Delay delay={5000} />
      </React.Suspense>
      <React.Suspense fallback={<p>Loading 3</p>}>
        <Delay delay={1000} />
      </React.Suspense>
    </div>
  )
}

export default IndexPage
