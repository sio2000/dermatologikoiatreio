import { useMemo } from 'react'
import { images } from '../constants/images'

function fileNameFromAssetPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

export function Doctor() {
  const doctorImage = useMemo(() => {
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>

    const preferred = Object.entries(files).find(
      ([path]) => fileNameFromAssetPath(path).toLowerCase() === 'ιατρος4.png'
    )?.[1]
    if (preferred) return preferred

    const fromAssets = Object.entries(files).find(([path]) => path.includes('ιατρος.png'))?.[1]
    return fromAssets ?? images.doctorPortrait
  }, [])

  return (
    <section id="doctor">
      <div className="doctor-inner">
        <div className="doctor-portrait fade-in">
          <div className="portrait-accent" aria-hidden />
          <div className="portrait-frame">
            <img
              src={doctorImage}
              alt="Δρ. Χρυσούλα Ζήσιμου"
              className="portrait-photo"
              width={600}
              height={800}
              loading="lazy"
            />
          </div>
          <div className="portrait-accent-2">
            <span className="credentials-chip">Δερματολόγος — Αφροδισιολόγος</span>
          </div>
        </div>

        <div className="doctor-text">
          <p className="section-label fade-up">Η Ιατρός μας</p>
          <h2 className="doctor-name fade-up">
            Δρ. Χρυσούλα
            <br />
            Ζήσιμου
          </h2>
          <p className="doctor-title fade-up">Δερματολόγος – Αφροδισιολόγος</p>

          <p className="doctor-bio fade-up">
            Η Δρ. Χρυσούλα Ζήσιμου αποτελεί κορυφαία ειδικό στον τομέα της δερματολογίας και
            αισθητικής ιατρικής στην Αθήνα. Με περισσότερα από 15 χρόνια κλινικής εμπειρίας
            και συνεχή επιστημονική κατάρτιση σε κέντρα αριστείας της Ευρώπης, προσφέρει
            υπηρεσίες ύψιστης ιατρικής ποιότητας.
          </p>

          <blockquote className="doctor-quote fade-up">
            «Η αληθινή ομορφιά δεν κρύβει — αναδεικνύει. Αυτή είναι η φιλοσοφία κάθε θεραπείας
            που σχεδιάζω.»
          </blockquote>

          <div className="doctor-credentials fade-up">
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Μέλος της Ελληνικής Δερματολογικής Εταιρείας
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Πιστοποίηση στις ενέσιμες θεραπείες αισθητικής (Allergan, Galderma)
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Εκπαίδευση σε κέντρα της Γαλλίας, Ιταλίας & Γερμανίας
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Συγγραφέας επιστημονικών δημοσιεύσεων στη δερματολογία
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Τακτική παρουσία σε διεθνή συνέδρια αισθητικής ιατρικής
            </div>
          </div>

          <div className="doctor-education fade-up">
            <article className="doctor-edu-card">
              <span className="doctor-edu-icon">🎓</span>
              <div>
                <h4>Εθνικό & Καποδιστριακό Πανεπιστήμιο Αθηνών</h4>
                <p>Ιατρική Σχολή ΕΚΠΑ</p>
              </div>
            </article>
            <article className="doctor-edu-card">
              <span className="doctor-edu-icon">🏥</span>
              <div>
                <h4>Νοσοκομείο «Ανδρέας Συγγρός»</h4>
                <p>Ειδίκευση Δερματολογίας — Αφροδισιολογίας</p>
              </div>
            </article>
            <article className="doctor-edu-card">
              <span className="doctor-edu-icon">📋</span>
              <div>
                <h4>Συνεχής Επιστημονική Εκπαίδευση</h4>
                <p>Διεθνή Συνέδρια & Πιστοποιήσεις</p>
              </div>
            </article>
          </div>

          <div className="doctor-stats fade-up">
            <div className="doctor-stat">
              <strong>15+</strong>
              <span>Χρόνια εμπειρίας</span>
            </div>
            <div className="doctor-stat">
              <strong>2K+</strong>
              <span>Ασθενείς</span>
            </div>
            <div className="doctor-stat">
              <strong>200+</strong>
              <span>Θεραπείες</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
