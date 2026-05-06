import { useEffect, useMemo, useState } from 'react'

export function FullGalleryPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const galleryImages = useMemo(() => {
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>

    return Object.entries(files)
      .filter(([path]) => !path.includes('hero.png') && !path.includes('vite.svg') && !path.includes('react.svg'))
      .map(([, url]) => url)
  }, [])

  const showPrev = () => {
    if (activeIndex === null || galleryImages.length === 0) return
    setActiveIndex((activeIndex - 1 + galleryImages.length) % galleryImages.length)
  }

  const showNext = () => {
    if (activeIndex === null || galleryImages.length === 0) return
    setActiveIndex((activeIndex + 1) % galleryImages.length)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeIndex === null) return
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, galleryImages.length])

  /** Πλήρης φόρτωση αρχικής (χωρίς άλμα στο section ραντεβού). */
  const openHomeFresh = () => {
    window.location.href = '/'
  }

  const goHome = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new Event('app:navigate'))
  }

  return (
    <main className="full-gallery-page">
      <div className="full-gallery-shell">
        <div className="full-gallery-topbar">
          <button type="button" className="full-gallery-desktop-back" onClick={goHome}>
            ← Επιστροφή
          </button>
        </div>
        <p className="section-label">Advanced Derma Gallery</p>
        <h1 className="section-title">
          Πλήρης συλλογή <em>πραγματικών περιστατικών και χώρου</em>
        </h1>
        <p className="full-gallery-intro">
          Περιηγηθείτε σε όλο το οπτικό υλικό του ιατρείου: θεραπευτικά αποτελέσματα, στιγμές
          φροντίδας και την αισθητική του χώρου μας.
        </p>

        <section className="full-gallery-grid" aria-label="Πλήρης γκαλερί εικόνων">
          {galleryImages.map((src, idx) => (
            <figure
              key={src}
              className="full-gallery-item"
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActiveIndex(idx)
                }
              }}
            >
              <img src={src} alt={`Advanced Derma Gallery ${idx + 1}`} loading="lazy" />
            </figure>
          ))}
        </section>

        <section className="full-gallery-cta">
          <p className="section-label">Next Step</p>
          <h2 className="section-title">
            Κλείστε την προσωπική σας <em>διάγνωση</em>
          </h2>
          <p className="full-gallery-cta-text">
            Επιλέξτε το ραντεβού σας και συζητήστε με τη Δρ. Χρυσούλα Ζήσιμου το ιδανικό πλάνο για
            τις ανάγκες της επιδερμίδας σας.
          </p>
          <button type="button" className="full-gallery-cta-btn" onClick={openHomeFresh}>
            Κλείσιμο Ραντεβού
          </button>
        </section>
      </div>

      {activeIndex !== null ? (
        <div className="full-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Προβολή εικόνας">
          <button className="full-gallery-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Κλείσιμο">
            ×
          </button>
          <button className="full-gallery-lightbox-nav prev" onClick={showPrev} aria-label="Προηγούμενη εικόνα">
            ‹
          </button>
          <img src={galleryImages[activeIndex]} alt={`Εικόνα ${activeIndex + 1} από ${galleryImages.length}`} />
          <button className="full-gallery-lightbox-nav next" onClick={showNext} aria-label="Επόμενη εικόνα">
            ›
          </button>
        </div>
      ) : null}
    </main>
  )
}
