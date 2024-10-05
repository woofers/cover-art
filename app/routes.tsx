import React from 'react'

import ErrorPage from './routes/_error'
import IndexPage from './routes/_index'
import AboutPage from './routes/about'

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
