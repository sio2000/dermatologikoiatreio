import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Philosophy } from './components/Philosophy'
import { Doctor } from './components/Doctor'
import { Services } from './components/Services'
import { TreatmentsCarousel } from './components/TreatmentsCarousel'
import { BiofillerSpotlight } from './components/BiofillerSpotlight'
import { RhinoplastySpotlight } from './components/RhinoplastySpotlight'
import { Results } from './components/Results'
import { Gallery } from './components/Gallery'
import { Locations } from './components/Locations'
import { Testimonials } from './components/Testimonials'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { FullGalleryPage } from './components/FullGalleryPage'
import { AdminPage } from './components/AdminPage'
import { useScrollReveal } from './hooks/useScrollReveal'

export default function App() {
  useScrollReveal()
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [route, setRoute] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }))

  useEffect(() => {
    let progress = 0
    const interval = window.setInterval(() => {
      progress += Math.random() * 14
      if (progress >= 100) {
        progress = 100
        window.clearInterval(interval)
        window.setTimeout(() => setLoading(false), 420)
      }
      setLoadProgress(progress)
    }, 180)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const syncRoute = () =>
      setRoute({
        pathname: window.location.pathname,
        hash: window.location.hash,
      })
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('app:navigate', syncRoute as EventListener)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('app:navigate', syncRoute as EventListener)
    }
  }, [])

  useEffect(() => {
    if (route.pathname === '/') {
      const anchor = route.hash.split('?')[0]
      const target = anchor ? document.querySelector(anchor.startsWith('#') ? anchor : `#${anchor}`) : null
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [route.pathname, route.hash])

  if (route.pathname === '/full-gallery') {
    return <FullGalleryPage />
  }

  if (route.pathname === '/admin') {
    return <AdminPage />
  }

  return (
    <>
      <div className={`deluxe-loader${loading ? '' : ' hidden'}`} aria-hidden={!loading}>
        <p className="deluxe-loader-text">ADVANCED DERMA: Ανακαλύψτε την καλύτερη εκδοχή του εαυτού σας.</p>
        <div className="deluxe-loader-bar">
          <span className="deluxe-loader-fill" style={{ width: `${loadProgress}%` }} />
        </div>
      </div>
      <a href="#main-content" className="skip-link">
        Μετάβαση στο περιεχόμενο
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Philosophy />
        <Doctor />
        <Services />
        <TreatmentsCarousel />
        <BiofillerSpotlight />
        <RhinoplastySpotlight />
        <Results />
        <Gallery />
        <Locations />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
