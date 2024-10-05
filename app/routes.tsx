import React from 'react'

const ErrorPage = React.lazy(() => import('./routes/_error'))
const IndexPage = React.lazy(() => import('./routes/_index'))
const AboutPage = React.lazy(() => import('./routes/about'))

export const routes = [
  {
    path: '*',
    Component: ErrorPage
  },
  {
    path: '/',
    Component: IndexPage
  },
  {
    path: '/about',
    Component: AboutPage
  }
]
