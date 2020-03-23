import React from 'react'
import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Web3ConnectProvider } from 'lib/web3-connect'
import env from 'lib/environment'

import '../public/app.css'

if (env('SENTRY_DSN')) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: env('NODE_ENV'),
    release: 'anj.aragon.org@' + env('BUILD'),
  })
}

console.log('BUILD2', process.env.BUILD)

export default class extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Aragon Court</title>
        </Head>
        <Web3ConnectProvider>
          <Navbar />
          <div>
            <Component {...pageProps} />
          </div>
        </Web3ConnectProvider>
      </>
    )
  }
}
