import React from 'react'
import Hero from '../components/Hero'
import Converter from '../components/converter/Converter'
import GetAnj from '../components/GetAnj'
import Features from '../components/Features'
import WhatHappens from '../components/WhatHappens'
import About from '../components/About'
import BecomeAJuror from '../components/BecomeAJuror'
import Basics from '../components/Basics'
import Subscribe from '../components/Subscribe'
import Footer from '../components/Footer'
import { useWeb3Connect } from '../web3-connect'

export default () => {
  return (
    <div>
      <Hero />
      <GetAnj />
      <Features />
      <WhatHappens />
      <About />
      <Subscribe />
      <Basics />
      <BecomeAJuror />
      <Footer />
    </div>
  )
}
