import React from 'react'
import About from '../components/About'
import Basics from '../components/Basics'
import BecomeAJuror from '../components/BecomeAJuror'
import Converter from '../components/converter/Converter'
import Features from '../components/Features'
import Footer from '../components/Footer'
import GetAnj from '../components/GetAnj'
import Hero from '../components/Hero'
import Subscribe from '../components/Subscribe'
import WhatHappens from '../components/WhatHappens'
import { ENABLE_CONVERTER_AT } from '../utils'

export default () => {
  const now = new Date()
  return (
    <div>
      <Hero />
      {now > ENABLE_CONVERTER_AT ? <Converter /> : <GetAnj />}
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
