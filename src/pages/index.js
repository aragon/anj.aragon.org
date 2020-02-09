import React from 'react'
import Basics from '../components/Basics'
import BecomeAJuror from '../components/BecomeAJuror'
import Converter from '../components/converter/Converter'
import LockedConverter from '../components/converter/LockedConverter'
import CourtGuides from '../components/CourtGuides'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Info from '../components/Info'
import Stats from '../components/Stats'
import Subscribe from '../components/Subscribe'
import { useNow, FIRST_TERM, PREACTIVATION_LOCKED } from '../utils'

export default () => {
  const now = useNow()
	const lockConverter = now <= FIRST_TERM && now >= PREACTIVATION_LOCKED
  return (
    <div>
      <Hero />
      <Stats />
      {lockConverter ? <LockedConverter /> : <Converter />}
      <Features />
      <Info />
      <CourtGuides />
      <BecomeAJuror />
      <Basics />
      <Subscribe />
      <Footer />
    </div>
  )
}
