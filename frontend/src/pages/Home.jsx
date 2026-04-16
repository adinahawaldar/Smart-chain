import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import CrisisSection from '../components/CrisisSection'
import Infrastructure from '../components/Infrastructure'
import ArchitectSection from '../components/ArchitectSection'
import CaseStudy from '../components/CaseStudy'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <CrisisSection/>
    <Infrastructure/>
    <CaseStudy/>
    <ArchitectSection/>
    <Footer/>
      </>
  )
}

export default Home
