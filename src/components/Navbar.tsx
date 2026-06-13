import { useEffect, useState } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)
  const logoUrl = new URL('../assets/logo.jpg', import.meta.url).href

  return (
    <>
      <nav id="main-nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <img src={logoUrl} alt="Advanced Derma logo" className="nav-logo-image" />
          <span className="nav-logo-text">
            <span className="nav-logo-main">Advanced Derma</span>
            <span className="nav-logo-sub">Δερματολογία · Αισθητική Ιατρική</span>
          </span>
        </a>

        <ul className="nav-links">
          <li>
            <a href="#doctor">Ιατρός</a>
          </li>
          <li>
            <a href="#face-treatments">Πρόσωπο</a>
          </li>
          <li>
            <a href="#body-treatments">Σώμα</a>
          </li>
          <li>
            <a href="#clinical-dermatology">Κλινική Δερματολογία</a>
          </li>
          <li>
            <a href="#locations">Τοποθεσίες</a>
          </li>
          <li>
            <a href="#testimonials">Αξιολογήσεις</a>
          </li>
        </ul>

        <div className="nav-actions">
          <a href="#offers" className="nav-offers-pill">
            <span className="nav-offers-pill-spark" aria-hidden>
              ✦
            </span>
            Προσφορές
          </a>
          <a href="#booking" className="nav-cta">
            Ραντεβού
          </a>
        </div>

        <button
          type="button"
          className="nav-mobile-toggle"
          aria-label={mobileOpen ? 'Κλείσιμο μενού' : 'Ανοιχτό μενού'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`nav-drawer-overlay${mobileOpen ? ' open' : ''}`}
        role="presentation"
        onClick={closeMobile}
        onKeyDown={(e) => e.key === 'Escape' && closeMobile()}
      />

      <aside className={`nav-drawer-panel${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <ul className="nav-drawer-links">
          <li>
            <a href="#philosophy" onClick={closeMobile}>
              Φιλοσοφία
            </a>
          </li>
          <li>
            <a href="#doctor" onClick={closeMobile}>
              Ιατρός
            </a>
          </li>
          <li>
            <a href="#face-treatments" onClick={closeMobile}>
              Πρόσωπο
            </a>
          </li>
          <li>
            <a href="#body-treatments" onClick={closeMobile}>
              Σώμα
            </a>
          </li>
          <li>
            <a href="#clinical-dermatology" onClick={closeMobile}>
              Κλινική Δερματολογία
            </a>
          </li>
          <li>
            <a href="#offers" onClick={closeMobile}>
              Προσφορές
            </a>
          </li>
          <li>
            <a href="#locations" onClick={closeMobile}>
              Τοποθεσίες
            </a>
          </li>
          <li>
            <a href="#gallery" onClick={closeMobile}>
              Gallery
            </a>
          </li>
          <li>
            <a href="#testimonials" onClick={closeMobile}>
              Αξιολογήσεις
            </a>
          </li>
        </ul>
        <a href="#booking" className="nav-drawer-cta" onClick={closeMobile}>
          Ραντεβού
        </a>
      </aside>
    </>
  )
}
