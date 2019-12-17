import React from 'react'
import Hero from '../components/Hero'
import Converter from '../components/converter/Converter'
import Features from '../components/Features'
import WhatHappens from '../components/WhatHappens'
import About from '../components/About'
import BecomeAJuror from '../components/BecomeAJuror'
import Basics from '../components/Basics'
import Subscribe from '../components/Subscribe'
import Footer from '../components/Footer'
import { useWeb3Connect } from '../web3-connect'

export default () => {
  const { account, activate, deactivate } = useWeb3Connect()
  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: '9999',
          border: '2px solid #333',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '10px',
          }}
        >
          Account: {account}
        </div>
        {['injected', 'frame', 'fortmatic', 'portis'].map(connectorName => (
          <button
            key={connectorName}
            onClick={() => activate(connectorName)}
            style={{
              background: 'white',
              transition: 'none',
            }}
          >
            activate {connectorName}
          </button>
        ))}
        <button
          onClick={deactivate}
          style={{
            background: 'white',
            transition: 'none',
          }}
        >
          deactivate
        </button>
      </div>
      <Hero />
      <Converter />
      <Features />
      <WhatHappens />
    </div>
  )
}
