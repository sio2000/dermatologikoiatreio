import { useCallback, useMemo, useRef, useState } from 'react'

/**
 * Νέα ενότητα: Viral Trend Exosomes — βίντεο αριστερά, κείμενο δεξιά.
 * Ακολουθεί το ίδιο μοτίβο με το Biofiller: σερβίρισμα .mp4 (H.264 + AAC · faststart)
 * από το `public/videos/exosomes.mp4` για πλήρη συμβατότητα browsers.
 */
function resolveExosomesMp4Src(): string {
  const env = import.meta.env.VITE_EXOSOMES_VIDEO_URL
  if (typeof env === 'string' && env.trim() !== '') return env.trim()
  return '/videos/exosomes.mp4'
}

export function ExosomesSpotlight() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)
  const [videoError, setVideoError] = useState('')
  const src = useMemo(() => resolveExosomesMp4Src(), [])

  const resetError = useCallback(() => setVideoError(''), [])

  const play = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    resetError()
    void v.play().catch((e) => {
      setVideoError(
        e instanceof Error ? e.message : String(e || 'Το πρόγραμμα περιήγησης μπλόκαρε την αναπαραγωγή.'),
      )
    })
    setActive(true)
  }, [resetError])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      resetError()
      void v.play().catch((e) => {
        setVideoError(e instanceof Error ? e.message : 'Δεν ήταν δυνατή η έναρξη αναπαραγωγής.')
      })
      setActive(true)
    } else {
      v.pause()
      setActive(false)
    }
  }, [resetError])

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
      id="exosomes-spotlight"
      className="exosomes-spotlight"
      aria-labelledby="exosomes-spotlight-heading"
    >
      <div className="exosomes-spotlight-aurora" aria-hidden>
        <span className="exosomes-aurora-blob exosomes-aurora-blob--a" />
        <span className="exosomes-aurora-blob exosomes-aurora-blob--b" />
        <span className="exosomes-aurora-blob exosomes-aurora-blob--c" />
      </div>

      <div className="exosomes-spotlight-inner">
        <figure className="exosomes-spotlight-visual fade-in">
          <div className="exosomes-visual-aura" aria-hidden />
          <span className="exosomes-visual-badge" aria-hidden>
            <span className="exosomes-visual-badge-dot" />
            VIRAL · 2026
          </span>
          <div className="exosomes-video-shell">
            <video
              ref={videoRef}
              className="exosomes-video"
              playsInline
              controls={active}
              preload="metadata"
              onPlay={() => {
                setActive(true)
                setVideoError('')
              }}
              onPause={() => setActive(false)}
              onEnded={() => setActive(false)}
              onError={() => {
                setVideoError(
                  'Δεν ήταν δυνατή η φόρτωση του βίντεο. Ελέγξτε τη σύνδεση ή δοκιμάστε άλλο φυλλομετρητή (π.χ. Safari).',
                )
                setActive(false)
              }}
              onLoadedData={resetError}
            >
              <source src={src} type="video/mp4" />
            </video>
            {videoError ? (
              <p className="exosomes-video-error" role="alert">
                {videoError}
              </p>
            ) : null}
            <div
              className={`exosomes-video-overlay${active ? ' is-hidden' : ''}`}
              aria-hidden={active}
            >
              <span className="exosomes-video-overlay-shine" />
            </div>
            <div className="exosomes-video-actions">
              <button
                type="button"
                className="exosomes-btn exosomes-btn-play"
                onClick={active ? togglePlay : play}
                aria-label={active ? 'Παύση βίντεο' : 'Αναπαραγωγή βίντεο'}
              >
                {active ? (
                  <span className="exosomes-btn-icon" aria-hidden>
                    ❚❚
                  </span>
                ) : (
                  <span className="exosomes-btn-icon exosomes-btn-icon-play" aria-hidden>
                    ▶
                  </span>
                )}
                <span className="exosomes-btn-text">{active ? 'Παύση' : 'Αναπαραγωγή'}</span>
              </button>
              <button
                type="button"
                className="exosomes-btn exosomes-btn-fs"
                onClick={requestVideoFullscreen}
                aria-label="Πλήρης οθόνη"
              >
                <span className="exosomes-btn-icon" aria-hidden>
                  ⛶
                </span>
                <span className="exosomes-btn-text">Πλήρης οθόνη</span>
              </button>
            </div>
            {!active ? (
              <button
                type="button"
                className="exosomes-hero-play"
                onClick={play}
                aria-label="Έναρξη αναπαραγωγής βίντεο Exosomes"
              >
                <span className="exosomes-hero-play-ring" aria-hidden />
                <span className="exosomes-hero-play-icon" aria-hidden>
                  ▶
                </span>
              </button>
            ) : null}
          </div>
          <figcaption className="exosomes-spotlight-caption">
            Δείτε τη θεραπεία Exosomes σε εξέλιξη — πατήστε αναπαραγωγή ή πλήρη οθόνη.
          </figcaption>
        </figure>

        <div className="exosomes-spotlight-copy">
          <p className="section-label fade-up exosomes-section-label">
            <span className="exosomes-pulse-dot" aria-hidden />
            Viral Trend · 2026
          </p>
          <h2 id="exosomes-spotlight-heading" className="fade-up exosomes-spotlight-heading">
            <span className="exosomes-heading-brand">Exosomes</span>
            <span className="exosomes-heading-sub">
              Η νέα γενιά <em>κυτταρικής</em> αναγέννησης
            </span>
          </h2>
          <div className="gold-rule fade-up" />

          <div className="exosomes-tag-row fade-up" aria-label="Χαρακτηριστικά θεραπείας">
            <span className="exosomes-tag">Βιο-σήματα</span>
            <span className="exosomes-tag">Λάμψη &amp; Σύσφιξη</span>
            <span className="exosomes-tag">Zero downtime</span>
          </div>

          <p className="exosomes-spotlight-lede fade-up">
            Τα <strong>Exosomes</strong> είναι μικροσκοπικά «μηνύματα» που ενεργοποιούν τα κύτταρα
            του δέρματος — ανανέωση κολλαγόνου, ομοιόμορφος τόνος και αληθινή λάμψη, χωρίς ενέσιμα
            υλικά πλήρωσης. Είναι το trend που έγινε viral σε όλο τον κόσμο και πλέον είναι διαθέσιμο
            στην <em>Advanced Derma</em>.
          </p>
          <p className="exosomes-spotlight-body fade-up">
            Εφαρμόζονται μετά από microneedling ή laser, για στοχευμένη αναγέννηση σε γραμμές, ουλές
            ακμής, λεπτή υφή και ευαισθησία. Η εμπειρία είναι ήπια, χωρίς αναμονή ανάρρωσης, και τα
            αποτελέσματα φωτεινά και διακριτικά — όπως αρμόζει σε ένα πρόσωπο που θέλει να μοιάζει
            ξεκούραστο, όχι «παρεμβαμένο».
          </p>

          <ul className="exosomes-benefits fade-up" aria-label="Οφέλη θεραπείας Exosomes">
            <li>
              <span className="exosomes-benefit-mark" aria-hidden />
              <div>
                <strong>Λάμψη &amp; ομοιομορφία</strong>
                <span>Φωτεινός, ξεκούραστος τόνος δέρματος.</span>
              </div>
            </li>
            <li>
              <span className="exosomes-benefit-mark" aria-hidden />
              <div>
                <strong>Επανόρθωση &amp; σύσφιξη</strong>
                <span>Διέγερση κολλαγόνου — αναζωογόνηση χωρίς όγκο.</span>
              </div>
            </li>
            <li>
              <span className="exosomes-benefit-mark" aria-hidden />
              <div>
                <strong>Καθαρή υφή</strong>
                <span>Βελτίωση σε σημάδια ακμής, πόρους και θαμπάδα.</span>
              </div>
            </li>
          </ul>

          <p className="exosomes-spotlight-foot fade-up">
            <a href="#final-cta" className="exosomes-spotlight-cta">
              Κλείστε ραντεβού για Exosomes
              <span className="exosomes-spotlight-cta-arrow" aria-hidden>
                →
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
