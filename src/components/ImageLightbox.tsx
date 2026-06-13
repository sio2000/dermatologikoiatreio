import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

type ImageLightboxProps = {
  images: { src: string; alt: string }[]
  index: number | null
  onClose: () => void
  onIndexChange: (next: number) => void
}

/** Κοινό fullscreen lightbox — άνοιγμα εικόνας σε πλήρη οθόνη με πλοήγηση. */
export function ImageLightbox({ images, index, onClose, onIndexChange }: ImageLightboxProps) {
  const len = images.length

  const showPrev = useCallback(() => {
    if (index === null || len === 0) return
    onIndexChange((index - 1 + len) % len)
  }, [index, len, onIndexChange])

  const showNext = useCallback(() => {
    if (index === null || len === 0) return
    onIndexChange((index + 1) % len)
  }, [index, len, onIndexChange])

  useEffect(() => {
    if (index === null) {
      document.body.style.removeProperty('overflow')
      return
    }
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.removeProperty('overflow')
    }
  }, [index, onClose, showPrev, showNext])

  if (index === null || len === 0) return null

  return createPortal(
    <div
      className="full-gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Προβολή εικόνας πλήρους οθόνης"
      onClick={onClose}
    >
      <button
        type="button"
        className="full-gallery-lightbox-close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Κλείσιμο"
      >
        ×
      </button>
      {len > 1 ? (
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
      ) : null}
      <img
        src={images[index].src}
        alt={images[index].alt}
        onClick={(e) => e.stopPropagation()}
      />
      {len > 1 ? (
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
      ) : null}
    </div>,
    document.body
  )
}
