import { useEffect, useMemo } from 'react'
import { THERAPY_BY_SLUG, THERAPY_IMAGE_BY_SLUG } from '../constants/therapies'

function fileNameFromAssetPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

export function TherapyDetailPage({ slug }: { slug: string }) {
  const therapy = THERAPY_BY_SLUG[slug]

  const image = useMemo(() => {
    const wanted = THERAPY_IMAGE_BY_SLUG[slug]
    if (!wanted) return ''
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>
    const hit = Object.entries(files).find(
      ([path]) => fileNameFromAssetPath(path).toLowerCase() === wanted.toLowerCase()
    )
    return hit?.[1] ?? ''
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (therapy) document.title = `${therapy.name} | Advanced Derma`
  }, [therapy])

  if (!therapy) {
    return (
      <main className="therapy-page">
        <div className="therapy-shell">
          <h1 className="section-title">Η θεραπεία δεν βρέθηκε</h1>
          <p className="therapy-intro">
            Η σελίδα που ζητήσατε δεν είναι διαθέσιμη. Επιστρέψτε στην αρχική για να δείτε όλες
            τις θεραπείες μας.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="therapy-page">
      <div className="therapy-shell">
        <header className="therapy-header">
          <p className="section-label">{therapy.category}</p>
          <h1 className="section-title therapy-title">{therapy.name}</h1>
          <div className="gold-rule" />
          <p className="therapy-tagline">{therapy.tagline}</p>
        </header>

        {image ? (
          <figure className="therapy-hero-image">
            <img src={image} alt={therapy.name} loading="eager" decoding="async" />
          </figure>
        ) : null}

        <p className="therapy-intro">{therapy.intro}</p>

        {therapy.bullets.length > 0 ? (
          <ul className="therapy-bullets" aria-label="Βασικά σημεία">
            {therapy.bullets.map((b) => (
              <li key={b}>
                <span className="therapy-bullet-mark" aria-hidden>
                  ✦
                </span>
                {b}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="therapy-sections">
          {therapy.sections.map((sec) => (
            <section key={sec.heading} className="therapy-section">
              <h2>{sec.heading}</h2>
              {sec.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="therapy-cta">
          <h2 className="therapy-cta-title">Κλείστε την προσωπική σας αξιολόγηση</h2>
          <p className="therapy-cta-text">
            Συζητήστε με τη Δρ. Χρυσούλα Ζήσιμου το ιδανικό πλάνο για τις ανάγκες της
            επιδερμίδας σας.
          </p>
          <a href="/#booking" className="therapy-cta-btn">
            Κλείστε Ραντεβού
          </a>
        </div>

        <p className="therapy-disclaimer">
          * Οι πληροφορίες έχουν ενημερωτικό χαρακτήρα και δεν υποκαθιστούν την ιατρική
          συμβουλή. Το κατάλληλο πρωτόκολλο καθορίζεται εξατομικευμένα μετά από αξιολόγηση.
        </p>
      </div>
    </main>
  )
}
