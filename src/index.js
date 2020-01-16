import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import * as Sentry from '@sentry/browser'
import env from './environment'

// Your top level component
import App from './App'

// Export your top level component as JSX (for static rendering)
export default App

if (env('SENTRY_DSN')) {
  if (typeof window !== 'undefined') {
    window.SENTRY_RELEASE = process.env.BUILD
    window.SENTRY_ENVIRONMENT = process.env.NODE_ENV
  }
  Sentry.init({ dsn: env('SENTRY_DSN') })
}

// Render your app
if (typeof document !== 'undefined') {
  const target = document.getElementById('root')

  const renderMethod = target.hasChildNodes()
    ? ReactDOM.hydrate
    : ReactDOM.render

  const render = Comp => {
    renderMethod(
      <AppContainer>
        <Comp />
      </AppContainer>,
      target
    )
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module && module.hot) {
    module.hot.accept('./App', () => {
      render(App)
    })
  }
}
