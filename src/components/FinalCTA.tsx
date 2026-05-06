import { useEffect, useRef } from 'react'
import { mountCtaGlow } from '../three/skinScenes'
import { Booking } from './Booking'

export function FinalCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    return mountCtaGlow(c)
  }, [])

  return (
    <section id="final-cta">
      <canvas id="cta-canvas" ref={canvasRef} />
      <div className="cta-gradient" aria-hidden />

      <div className="final-cta-unified">
        <div className="final-cta-content">
          <h2 className="final-cta-title fade-up" id="booking-section-title">
            Επενδύστε
            <br />
            στην <em>επιδερμίδα</em> σας
          </h2>
          <p className="final-cta-sub fade-up" id="booking-section-desc">
            Κάθε θεραπεία είναι μια επένδυση στην αυτοπεποίθησή σας. Κλείστε το ραντεβού σας
            σήμερα και ανακαλύψτε τη φυσική σας λάμψη.
          </p>
        </div>

        <div
          id="booking"
          className="final-cta-booking-merged"
          role="region"
          aria-labelledby="booking-section-title"
          aria-describedby="booking-section-desc"
        >
          <Booking />
        </div>
      </div>
    </section>
  )
}
