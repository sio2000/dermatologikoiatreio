import { useCallback, useMemo, useRef, useState } from 'react'
import { images, type ComparisonTreatment } from '../constants/images'

type Tab = { key: ComparisonTreatment; label: string }

const TABS: Tab[] = [
  { key: 'hairLoss', label: 'Τριχόπτωση' },
  { key: 'acne', label: 'Θεραπεία Ακμής' },
  { key: 'brachioplasty', label: 'Βραχιονοπλαστική' },
  { key: 'rhinoplasty', label: 'Ρινοπλαστική' },
]

export function Results() {
  const [treatment, setTreatment] = useState<ComparisonTreatment>('hairLoss')
  const [pct, setPct] = useState(50)
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const pair = useMemo(() => images.comparison[treatment], [treatment])

  /** 1:1 με το ποντίκι: κέντρο λωρίδας στο ίδιο % με το x στο πλαίσιο σύγκρισης */
  const setPositionFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const w = rect.width
    if (w <= 0) return
    const rel = clientX - rect.left
    const raw = (rel / w) * 100
    setPct(Math.max(0, Math.min(100, raw)))
  }, [])

  const onPointerMove = useCallback(
    (clientX: number) => {
      setPositionFromClientX(clientX)
    },
    [setPositionFromClientX]
  )

  const pickTab = useCallback((k: ComparisonTreatment) => {
    setTreatment(k)
    setPct(50)
  }, [])

  return (
    <section id="results">
      <div className="results-inner">
        <div className="results-header">
          <h2 className="section-title fade-up">
            Αποτελέσματα που <em>Μιλούν</em>
          </h2>
          <div className="gold-rule fade-up" />
          <p className="fade-up results-ba-lead">{`Δείτε το Πριν & Μετά`}</p>
        </div>

        <div className="comparison-wrapper fade-in">
          <div className="comparison-tabs" role="tablist" aria-label="Κατηγορία πριν-μετά">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={treatment === tab.key}
                className={`comp-tab${treatment === tab.key ? ' active' : ''}`}
                onClick={() => pickTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            ref={containerRef}
            className="comparison-container"
            id="comparison"
            role="presentation"
            onMouseDown={(e) => {
              e.preventDefault()
              dragging.current = true
              onPointerMove(e.clientX)
            }}
            onMouseLeave={() => {
              dragging.current = false
            }}
            onMouseUp={() => {
              dragging.current = false
            }}
            onMouseMove={(e) => {
              if (dragging.current) onPointerMove(e.clientX)
            }}
            onTouchStart={(e) => {
              const t = e.touches[0]
              if (!t) return
              dragging.current = true
              onPointerMove(t.clientX)
            }}
            onTouchEnd={() => {
              dragging.current = false
            }}
            onTouchMove={(e) => {
              if (dragging.current && e.touches[0])
                onPointerMove(e.touches[0].clientX)
            }}
          >
            {/* After = πλήρες δεξιά· Before = επάνω, κλιπ αριστερά (αριστερά = Πριν, δεξιά = Μετά) */}
            <div
              id="comp-after"
              className="comp-side comp-after comp-side-image comp-comparison-base"
              style={{
                backgroundImage: `url(${pair.after})`,
              }}
            >
              <div className="comp-texture" aria-hidden />
              <div className="comp-label-stack comp-label-stack--after">
                <span className="comp-label">Μετά</span>
                <span className="comp-sub-label">After Treatment</span>
              </div>
            </div>

            <div
              className="comp-side comp-before comp-side-image comp-comparison-top"
              style={{
                clipPath: `inset(0 ${100 - pct}% 0 0)`,
                backgroundImage: `url(${pair.before})`,
              }}
            >
              <div className="comp-texture" aria-hidden />
              <div className="comp-label-stack comp-label-stack--before">
                <span className="comp-label">Πριν</span>
                <span className="comp-sub-label">Before Treatment</span>
              </div>
            </div>

            <div className="comp-glow" id="comp-glow" style={{ left: `${pct}%` }} aria-hidden />

            <div className="comp-divider" id="comp-divider" style={{ left: `${pct}%` }} />

            <div className="comp-handle" id="comp-handle" style={{ left: `${pct}%` }} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l-6-6 6-6" />
                <path d="M15 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          <p className="results-note">
            * Τα αποτελέσματα ενδέχεται να διαφέρουν ανά άτομο. Όλες οι φωτογραφίες είναι
            πραγματικών ασθενών με τη συγκατάθεσή τους.
          </p>
        </div>
      </div>
    </section>
  )
}
