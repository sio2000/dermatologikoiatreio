import { useEffect, useMemo, useRef, useState } from 'react'

type TreatmentCard = {
  title: string
  short: string
  points: string[]
  image: string
  accent?: 'laser-hair-removal'
}

type TreatmentSeed = {
  title: string
  short: string
  points: string[]
  /** Exact filename(s) under src/assets (png / jpg / jpeg / webp); first match wins */
  imageFile?: string | string[]
  accent?: TreatmentCard['accent']
}

const treatmentSeed: TreatmentSeed[] = [
  {
    title: 'Αντιγήρανση & Botox',
    short: 'Λειαίνει ρυτίδες έκφρασης και προλαμβάνει νέες γραμμές με φυσικό αποτέλεσμα.',
    points: ['Άμεση βελτίωση έκφρασης', 'Εφαρμογή 10-15 λεπτών', 'Επιστροφή άμεσα στις δραστηριότητες'],
    imageFile: 'αποτελεσματαθεραπειων.png',
  },
  {
    title: 'Fillers υαλουρονικού',
    short: 'Αποκατάσταση όγκου και ενυδάτωσης σε χείλη, ζυγωματικά και ρινοπαρειακές.',
    points: ['Στοχευμένη διόρθωση', 'Φυσικό περίγραμμα προσώπου', 'Αποτελέσματα με διάρκεια'],
    imageFile: 'αποτελεσματαθεραπειων28.png',
  },
  {
    title: 'Biofiller',
    short: 'Αυτόλογη, βιοσυμβατή προσέγγιση για φυσικό όγκο και λεία επιφάνεια χωρίς συνθετικό υλικό.',
    points: ['Κύτταρα του ίδιου του οργανισμού', 'Ήπια διάχυση & αρμονία', 'Ιδανικό για πρόσωπο & λεπτές διορθώσεις'],
    imageFile: 'αποτελεσματαθεραπειων8.png',
  },
  {
    title: 'Laser Hair Removal',
    short: 'Η υπογραφή μας: ιατρική αποτρίχωση laser και ολοκληρωμένη βελτίωση υφής και τόνου δέρματος.',
    accent: 'laser-hair-removal',
    points: ['Αποτρίχωση προσώπου & σώματος', 'Μείωση δυσχρωμιών & πόρων', 'Πρωτόκολλα ανά τύπο δέρματος'],
    imageFile: ['lazerhairremoval.png', 'ιατρος8.png', 'ιατρος8.jpeg', 'ιατρος8.jpg'],
  },
  {
    title: 'Θεραπεία ακμής',
    short: 'Πρωτόκολλα για ενεργή ακμή και ουλές με ιατρική παρακολούθηση.',
    points: ['Έλεγχος φλεγμονής', 'Μείωση σημαδιών/ουλών', 'Σταδιακή εξισορρόπηση λιπαρότητας'],
    imageFile: 'αποτελεσματαθεραπειων12.png',
  },
  {
    title: 'PRP / Plasma',
    short: 'Αυτόλογη αναζωογόνηση με πλάσμα πλούσιο σε αιμοπετάλια για λάμψη και ανάπλαση.',
    points: ['Ενεργοποίηση κολλαγόνου', 'Βελτίωση υφής και τόνου', 'Ιδανικό συμπληρωματικά σε άλλα πρωτόκολλα'],
    imageFile: 'prp.jpg',
  },
  {
    title: 'Μεσοθεραπεία',
    short: 'Ενυδάτωση και θρέψη σε βάθος με κοκτέιλ βιταμινών, αμινοξέων και υαλουρονικού.',
    points: ['Άμεση φωτεινότητα', 'Ενίσχυση ελαστικότητας', 'Πρόληψη αφυδάτωσης'],
    imageFile: 'mesotherapy.png',
  },
  {
    title: 'Κλινική δερματολογία',
    short: 'Διάγνωση και αντιμετώπιση δερματολογικών παθήσεων με ασφάλεια και ακρίβεια.',
    points: ['Σπίλοι και χαρτογράφηση', 'Ατοπική δερματίτιδα/ροδόχρους', 'Εξατομικευμένο θεραπευτικό πλάνο'],
    imageFile: 'αποτελεσματαθεραπειων15.png',
  },
  {
    title: 'Τριχόπτωση & αλωπεκία',
    short: 'Ολοκληρωμένη προσέγγιση για ενδυνάμωση θύλακα και βελτίωση πυκνότητας.',
    points: ['Διαγνωστικός έλεγχος', 'PRP και μεσοθεραπεία τριχωτού', 'Πρωτόκολλα συντήρησης'],
    imageFile: 'αποτελεσματαθεραπειων2.png',
  },
]

function fileNameFromAssetPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

function resolveAssetUrl(assetMap: Record<string, string>, wantName: string): string | '' {
  const target = wantName.trim().toLowerCase()
  const hit = Object.entries(assetMap).find(
    ([path]) => fileNameFromAssetPath(path).toLowerCase() === target
  )
  return hit?.[1] ?? ''
}

export function TreatmentsCarousel() {
  const [angle, setAngle] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const dragRef = useRef({
    isDown: false,
    lastX: 0,
    velocity: 0,
    angle: 0,
    moved: false,
    recentlyDragged: false,
  })
  const assetMap = useMemo(() => {
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>
    const entries = Object.entries(files).filter(
      ([path]) =>
        !path.includes('hero.png') && !path.includes('vite.svg') && !path.includes('react.svg')
    )
    return Object.fromEntries(entries) as Record<string, string>
  }, [])

  const fallbackPool = useMemo(() => Object.values(assetMap), [assetMap])

  const cards: TreatmentCard[] = useMemo(
    () =>
      treatmentSeed.map((item, i) => {
        const names = item.imageFile
          ? Array.isArray(item.imageFile)
            ? item.imageFile
            : [item.imageFile]
          : []
        const byName =
          names.map((n) => resolveAssetUrl(assetMap, n)).find((url) => url.length > 0) ?? ''
        const image =
          byName ||
          fallbackPool[i % Math.max(fallbackPool.length, 1)] ||
          fallbackPool[0] ||
          ''
        return {
          title: item.title,
          short: item.short,
          points: item.points,
          image,
          accent: item.accent,
        }
      }),
    [assetMap, fallbackPool]
  )

  useEffect(() => {
    let rafId = 0
    let localAngle = dragRef.current.angle

    const animate = () => {
      if (!dragRef.current.isDown) {
        dragRef.current.velocity *= 0.95
      }
      localAngle += 0.002 + dragRef.current.velocity
      dragRef.current.angle = localAngle
      setAngle(localAngle)
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handlePointerDown = (clientX: number) => {
    dragRef.current.isDown = true
    dragRef.current.lastX = clientX
    dragRef.current.moved = false
    setDragging(true)
  }

  const handlePointerMove = (clientX: number) => {
    if (!dragRef.current.isDown) return
    const delta = clientX - dragRef.current.lastX
    if (Math.abs(delta) > 2) {
      dragRef.current.moved = true
    }
    dragRef.current.velocity = delta * 0.003
    dragRef.current.lastX = clientX
  }

  const stopDragging = () => {
    dragRef.current.recentlyDragged = dragRef.current.moved
    dragRef.current.isDown = false
    setDragging(false)
  }

  const cardAngle = (2 * Math.PI) / Math.max(cards.length, 1)
  const radius = 360

  return (
    <section id="treatments-carousel" className="treatments-carousel">
      <div className="treatments-carousel-inner">
        <div className="treatments-carousel-head">
          <div>
            <p className="section-label fade-up">Εξατομικευμένες Θεραπείες</p>
            <h2 className="section-title fade-up">
              Θεραπείες <em>προσαρμοσμένες</em> στο δέρμα σας
            </h2>
            <p className="treatments-intro fade-up">
              Περιηγηθείτε στις βασικές επιλογές και πατήστε σε οποιοδήποτε σημείο της κάρτας για
              να δείτε σύντομες πληροφορίες της θεραπείας.
            </p>
          </div>
        </div>

        <div
          className={`treatments-3d-container${dragging ? ' is-dragging' : ''}`}
          onMouseDown={(event) => handlePointerDown(event.clientX)}
          onMouseMove={(event) => handlePointerMove(event.clientX)}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onTouchStart={(event) => handlePointerDown(event.touches[0].clientX)}
          onTouchMove={(event) => handlePointerMove(event.touches[0].clientX)}
          onTouchEnd={stopDragging}
          onTouchCancel={stopDragging}
        >
          <div className="treatments-3d-track">
            {cards.map((card, index) => {
              const current = angle + index * cardAngle
              const x = Math.sin(current) * radius
              const z = Math.cos(current) * radius - radius
              const scale = (z + radius * 2) / (radius * 2)
              const opacity = 0.3 + scale * 0.7
              const depthRank = Math.round((z + radius * 2) * 100)
              const centerBoost = Math.round((radius - Math.abs(x)) * 10)

              return (
                <article
                  key={card.title}
                  className={`treatment-card-3d${card.accent === 'laser-hair-removal' ? ' treatment-card-3d--laser' : ''}`}
                  style={{
                    transform: `translateX(${x}px) translateZ(${z}px) scale(${0.62 + scale * 0.38})`,
                    opacity,
                    zIndex: depthRank + centerBoost + index,
                  }}
                >
                  <button
                    type="button"
                    className={`treatment-card-3d-inner${flipped[index] ? ' is-flipped' : ''}`}
                    onClick={() => {
                      if (dragRef.current.recentlyDragged) {
                        dragRef.current.recentlyDragged = false
                        return
                      }
                      setFlipped((state) => ({ ...state, [index]: !state[index] }))
                    }}
                    aria-label={`Εναλλαγή πληροφοριών για ${card.title}`}
                  >
                    <span className="treatment-card-face treatment-card-front">
                      <span className="treatment-card-num">{String(index + 1).padStart(2, '0')}</span>
                      {card.image ? <img src={card.image} alt={card.title} /> : null}
                      <span className="treatment-card-overlay" />
                      <span className="treatment-card-icon">✦</span>
                      <h3>
                        {card.accent === 'laser-hair-removal' ? (
                          <>
                            <span className="treatment-laser-brand">Laser Hair Removal</span>
                            <span className="treatment-laser-el">Ιατρική αποτρίχωση &amp; laser δέρματος</span>
                          </>
                        ) : (
                          card.title
                        )}
                      </h3>
                      <p className={card.accent === 'laser-hair-removal' ? 'treatment-short-laser' : undefined}>
                        {card.accent === 'laser-hair-removal' ? (
                          <>
                            Έμφαση στη θεραπεία <strong>Laser Hair Removal</strong> — αποτρίχωση, λάμψη και εξατομικευμένα
                            πρωτόκολλα ανά τύπο δέρματος.
                          </>
                        ) : (
                          card.short
                        )}
                      </p>
                      <span className="treatment-card-line" />
                    </span>
                    <span className="treatment-card-face treatment-card-back">
                      <h3>
                        {card.accent === 'laser-hair-removal' ? (
                          <>
                            <span className="treatment-laser-brand">Laser Hair Removal</span>
                            <span className="treatment-laser-el">Ιατρική αποτρίχωση</span>
                          </>
                        ) : (
                          card.title
                        )}
                      </h3>
                      <ul>
                        {card.points.slice(0, 2).map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </span>
                  </button>
                </article>
              )
            })}
          </div>
          <p className="treatments-drag-hint">Σύρετε οριζόντια για έλεγχο περιστροφής</p>
        </div>
        <div className="treatments-details-grid">
          {cards.slice(0, 4).map((card) => (
            <article key={`${card.title}-details`} className="treatment-detail-item">
              <h4>
                {card.accent === 'laser-hair-removal' ? (
                  <>
                    <span className="treatment-laser-brand treatment-laser-brand--compact">Laser Hair Removal</span>
                    <span className="treatment-laser-el treatment-laser-el--compact">Αποτρίχωση &amp; δέρμα</span>
                  </>
                ) : (
                  card.title
                )}
              </h4>
              <ul>
                {card.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
