import React from 'react'
import PricingCard from '../components/PricingCard'
import FooterNavStore from '../components/FooterNavStore'

const PricingPage = () => {
  return (
    <>
    <div className="min-h-screen bg-brand-light md:pl-60 md:pt-0 p-0 md:p-0 mb-20 md:mb-0">
      <PricingCard gridsize={true} />
    </div>
    <FooterNavStore />
    </>
  )
}

export default PricingPage
