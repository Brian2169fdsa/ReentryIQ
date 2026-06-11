import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { CtaBand } from '@/components/layout/CtaBand'
import { Hero } from '@/components/landing/Hero'
import { StatCards } from '@/components/landing/StatCards'
import { ProductPreview } from '@/components/landing/ProductPreview'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { WhoItsFor } from '@/components/landing/WhoItsFor'
import { Compliance } from '@/components/landing/Compliance'

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main>
        <Hero />
        <StatCards />
        <ProductPreview />
        <HowItWorks />
        <WhoItsFor />
        <Compliance />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  )
}
