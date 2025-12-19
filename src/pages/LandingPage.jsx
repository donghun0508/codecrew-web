import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import TargetUsers from '@/components/landing/TargetUsers'
import Stats from '@/components/landing/Stats'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TargetUsers />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
