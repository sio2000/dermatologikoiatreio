import { useCallback, useRef, useState } from 'react'

/** Αν υπάρχει το `src/assets/BIOFILLER.mov`, φορτώνεται από το bundler· αλλιώς `/BIOFILLER.mov` στο `public/`. */
const biofillerAsset = import.meta.glob<string>('../assets/BIOFILLER.mov', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const BIOFILLER_VIDEO_SRC =
  (Object.values(biofillerAsset)[0] as string | undefined) ?? '/BIOFILLER.mov'

export function BiofillerSpotlight() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)

  const play = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    void v.play().catch(() => {})
    setActive(true)
  }, [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play().catch(() => {})
      setActive(true)
    } else {
      v.pause()
      setActive(false)
    }
  }, [])

  const requestVideoFullscreen = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.requestFullscreen) {
      void v.requestFullscreen()
      return
    }
    const wk = v as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
    wk.webkitEnterFullscreen?.()
  }, [])

  return (
    <section
      id="biofiller-spotlight"
      className="biofiller-spotlight"
      aria-labelledby="biofiller-spotlight-heading"
    >
      <div className="biofiller-spotlight-inner">
        <div className="biofiller-spotlight-copy">
          <p className="section-label fade-up">Νέα τεχνική</p>
          <h2 id="biofiller-spotlight-heading" className="fade-up biofiller-spotlight-heading">
            <span className="biofiller-heading-brand">Biofiller</span>
            <span className="biofiller-heading-sub">
              <em>Φυσική</em> αναδόμηση όγκου
            </span>
          </h2>
          <div className="gold-rule fade-up" />
          <div className="biofiller-tag-row fade-up" aria-label="Χαρακτηριστικά θεραπείας">
            <span className="biofiller-tag">Αυτόλογο</span>
            <span className="biofiller-tag">Βιο-ενέσιμο</span>
            <span className="biofiller-tag">Λεία γραμμή</span>
          </div>
          <p className="biofiller-spotlight-lede fade-up">
            Το <strong>Biofiller</strong> αξιοποιεί τα δικά σας κύτταρα για εντοπισμένη αποκατάσταση όγκου και λείας επιφάνειας,
            χωρίς συνθετικά υλικά — με φυσική ενσωμάτωση στο υπάρχον λίπος και ήπια, φυσική αισθητική.
          </p>
          <p className="biofiller-spotlight-body fade-up">
            Ιδανικό για αρμονικές διορθώσεις στο πρόσωπο και τις χώρους που χρειάζονται «ζωντανή» πλήρωση χωρίς την αίσθηση
            ξένου σώματος. Η εφαρμογή γίνεται με εξατομικευμένο πλάνο, με έμφαση στην ασφάλεια και το ρεαλιστικό αποτέλεσμα.
          </p>
        </div>

        <figure className="biofiller-spotlight-visual fade-in">
          <div className="biofiller-visual-aura" aria-hidden />
          <div className="biofiller-video-shell">
              <video
                ref={videoRef}
                className="biofiller-video"
                src={BIOFILLER_VIDEO_SRC}
                playsInline
                controls={active}
                preload="metadata"
                onPlay={() => setActive(true)}
                onPause={() => setActive(false)}
                onEnded={() => setActive(false)}
              />
              <div className={`biofiller-video-overlay${active ? ' is-hidden' : ''}`} aria-hidden={active}>
                <span className="biofiller-video-overlay-shine" />
              </div>
              <div className="biofiller-video-actions">
                <button
                  type="button"
                  className="biofiller-btn biofiller-btn-play"
                  onClick={active ? togglePlay : play}
                  aria-label={active ? 'Παύση βίντεο' : 'Αναπαραγωγή βίντεο'}
                >
                  {active ? (
                    <span className="biofiller-btn-icon" aria-hidden>
                      ❚❚
                    </span>
                  ) : (
                    <span className="biofiller-btn-icon biofiller-btn-icon-play" aria-hidden>
                      ▶
                    </span>
                  )}
                  <span className="biofiller-btn-text">{active ? 'Παύση' : 'Αναπαραγωγή'}</span>
                </button>
                <button
                  type="button"
                  className="biofiller-btn biofiller-btn-fs"
                  onClick={requestVideoFullscreen}
                  aria-label="Πλήρης οθόνη"
                >
                  <span className="biofiller-btn-icon" aria-hidden>
                    ⛶
                  </span>
                  <span className="biofiller-btn-text">Πλήρης οθόνη</span>
                </button>
              </div>
              {!active ? (
                <button
                  type="button"
                  className="biofiller-hero-play"
                  onClick={play}
                  aria-label="Έναρξη αναπαραγωγής βίντεο Biofiller"
                >
                  <span className="biofiller-hero-play-ring" aria-hidden />
                  <span className="biofiller-hero-play-icon" aria-hidden>
                    ▶
                  </span>
                </button>
              ) : null}
          </div>
          <figcaption className="biofiller-spotlight-caption">
            Παρακολουθήστε τη θεραπεία Biofiller: πατήστε για αναπαραγωγή ή πλήρη οθόνη.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
