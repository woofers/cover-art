import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../layout'

const AboutPage = () => {
  return (
    <Layout>
      <h1>About</h1>
      <Link to="/">Go Home</Link>
    </Layout>
  )
}

export default AboutPage
