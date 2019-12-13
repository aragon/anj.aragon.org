import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Web3ReactProvider } from '@web3-react/core'
import { Link, Router } from 'components/Router'
import Navbar from 'components/Navbar'
import { Web3Provider } from '@ethersproject/providers'

import './app.css'

function getWeb3Library(provider) {
  return new Web3Provider(provider)
}

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <Root>
        <Navbar />
        <div className="content">
          <React.Suspense fallback={<em>Loading...</em>}>
            <Router>
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </div>
      </Root>
    </Web3ReactProvider>
  )
}

export default App
