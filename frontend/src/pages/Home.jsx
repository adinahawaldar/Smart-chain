import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import CrisisSection from '../components/CrisisSection'
import Infrastructure from '../components/Infrastructure'
// import ArchitectSection from '../components/ArchitectSection'
import CaseStudy from '../components/CaseStudy'
import StatsSection from '../components/StatsSection'
import FAQSection from '../components/FAQSection'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <StatsSection/>
    <CrisisSection/>
    <Infrastructure/>
    <CaseStudy/>
    {/* <ArchitectSection/> */}
    <FAQSection/>
    <Footer/>
      </>
  )
}

export default Home
