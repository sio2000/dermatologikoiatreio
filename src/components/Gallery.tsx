import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

function gallerySpanClass(index: number) {
  const wide = index % 5 === 0
  const tall = index % 9 === 3 && !wide
  return `${wide ? ' clinic-gallery-item--wide' : ''}${tall ? ' clinic-gallery-item--tall' : ''}`
}

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const galleryImages = useMemo(() => {
    const files = import.meta.glob('../assets/galleryfront/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>

    return Object.entries(files)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
      .map(([path, url]) => ({ path, url }))
  }, [])

  const len = galleryImages.length

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i !== null && len ? (i - 1 + len) % len : i))
  }, [len])

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i !== null && len ? (i + 1) % len : i))
  }, [len])

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.removeProperty('overflow')
      return
    }
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.removeProperty('overflow')
    }
  }, [activeIndex, showPrev, showNext])

  const closeLightbox = useCallback(() => setActiveIndex(null), [])

  const lightbox =
    activeIndex !== null && len > 0
      ? createPortal(
          <div
            className="full-gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Προβολή εικόνας πλήρους οθόνης"
            onClick={closeLightbox}
          >
            <button
              type="button"
              className="full-gallery-lightbox-close"
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              aria-label="Κλείσιμο"
            >
              ×
            </button>
            <button
              type="button"
              className="full-gallery-lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
              aria-label="Προηγούμενη εικόνα"
            >
              ‹
            </button>
            <img
              src={galleryImages[activeIndex].url}
              alt={`Εικόνα ${activeIndex + 1} από ${len}`}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="full-gallery-lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              aria-label="Επόμενη εικόνα"
            >
              ›
            </button>
          </div>,
          document.body
        )
      : null

  return (
    <section id="gallery" className="clinic-gallery">
      <div className="clinic-gallery-inner">
        <div className="clinic-gallery-header">
          <h2 className="section-title fade-up">
            Εμπειρία <em>κλινικής φροντίδας</em> σε κάθε λεπτομέρεια
          </h2>
          <p className="clinic-gallery-subtitle fade-up">
            Ανανεωμένο περιβάλλον, σύγχρονος εξοπλισμός και αυθεντικές στιγμές από τις θεραπείες
            μας σε έναν χώρο που αποπνέει ηρεμία και ασφάλεια.
          </p>
        </div>

        <div className="clinic-gallery-board fade-up">
          <div className="clinic-gallery-grid">
            {galleryImages.map(({ path, url }, idx) => {
              const base = path.split('/').pop()?.split('.')[0] ?? `gallery-${idx + 1}`
              return (
                <button
                  key={path}
                  type="button"
                  className={`clinic-gallery-item${gallerySpanClass(idx)}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Μεγέθυνση — ${base}`}
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="clinic-gallery-actions">
          <a href="/full-gallery" className="clinic-gallery-btn clinic-gallery-btn--primary">
            Δείτε το πλήρες gallery
          </a>
          <a
            href="https://www.instagram.com/advanced_derma/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="clinic-gallery-btn clinic-gallery-btn--instagram"
          >
            <span aria-hidden>📷</span>
            Ακολουθήστε μας στο Instagram
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
      {lightbox}
    </section>
  )
}
