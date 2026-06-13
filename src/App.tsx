import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Philosophy } from './components/Philosophy'
import { Doctor } from './components/Doctor'
import { Services } from './components/Services'
import { TreatmentsStacked } from './components/TreatmentsStacked'
import { Offers } from './components/Offers'
import { FaceTreatments } from './components/FaceTreatments'
import { BodyTreatments } from './components/BodyTreatments'
import { ClinicalDermatology } from './components/ClinicalDermatology'
import { BiofillerSpotlight } from './components/BiofillerSpotlight'
import { RhinoplastySpotlight } from './components/RhinoplastySpotlight'
import { ExosomesSpotlight } from './components/ExosomesSpotlight'
import { Results } from './components/Results'
import { Gallery } from './components/Gallery'
import { Locations } from './components/Locations'
import { Testimonials } from './components/Testimonials'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { FullGalleryPage } from './components/FullGalleryPage'
import { AdminPage } from './components/AdminPage'
import { TherapyDetailPage } from './components/TherapyDetailPage'
import { useScrollReveal } from './hooks/useScrollReveal'
import { collectSiteImageUrls, preloadSiteImages } from './lib/preloadSiteImages'

const INTRO_MIN_MS = 1200
const INTRO_MAX_MS = 22000
const INTRO_FADE_MS = 420

export default function App() {
  useScrollReveal()
  /** Η αρχική οθόνη φόρτωσης εμφανίζεται μόνο την πρώτη φορά που ανοίγει ο χρήστης το site. */
  const [loading, setLoading] = useState(() => {
    try {
      return window.sessionStorage.getItem('ad_intro_seen') !== '1'
    } catch {
      return true
    }
  })
  const [loadProgress, setLoadProgress] = useState(0)
  const [route, setRoute] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }))

  useEffect(() => {
    if (!loading) return

    let cancelled = false
    const startedAt = Date.now()
    let finished = false

    const finishIntro = () => {
      if (cancelled || finished) return
      finished = true
      window.clearTimeout(maxTimer)
      setLoadProgress(100)
      window.setTimeout(() => {
        if (cancelled) return
        try {
          window.sessionStorage.setItem('ad_intro_seen', '1')
        } catch {
          /* αγνόησε αν δεν υπάρχει sessionStorage */
        }
        setLoading(false)
      }, INTRO_FADE_MS)
    }

    const maxTimer = window.setTimeout(finishIntro, INTRO_MAX_MS)

    void preloadSiteImages(collectSiteImageUrls(), ({ percent }) => {
      if (!cancelled) setLoadProgress(percent)
    }).finally(() => {
      if (cancelled) return
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, INTRO_MIN_MS - elapsed)
      window.setTimeout(finishIntro, remaining)
    })

    return () => {
      cancelled = true
      window.clearTimeout(maxTimer)
    }
  }, [loading])

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

  if (route.pathname.startsWith('/therapy/')) {
    const slug = route.pathname.replace(/^\/therapy\//, '').replace(/\/$/, '')
    return (
      <>
        <Navbar />
        <TherapyDetailPage slug={slug} />
        <Footer />
      </>
    )
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
        <TreatmentsStacked />
        <Services />
        <Offers />
        <FaceTreatments />
        <BodyTreatments />
        <ClinicalDermatology />
        <BiofillerSpotlight />
        <RhinoplastySpotlight />
        <ExosomesSpotlight />
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
