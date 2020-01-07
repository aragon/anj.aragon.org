import React from 'react'
import About from '../components/About'
import Basics from '../components/Basics'
import BecomeAJuror from '../components/BecomeAJuror'
import Converter from '../components/converter/Converter'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Subscribe from '../components/Subscribe'
import WhatHappens from '../components/WhatHappens'

export default () => {
  return (
    <div>
      <Hero />
      <Converter />
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
