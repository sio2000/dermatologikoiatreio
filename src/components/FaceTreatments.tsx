import { THERAPY_SLUG_BY_NAME } from '../constants/therapies'

const faceTreatments = [
  'Υαλουρονικό Οξύ',
  'Botox',
  'Baby Botox',
  'Bacio',
  'Yaqoot',
  'Αυτόλογο Biofiller',
  'Profhilo Skin Booster',
  'Θεραπεία Sculptra',
  'Θεραπεία Karisma',
  'Θεραπεία Sisthaema HEVO-T',
  'Juvelook',
  'Novacutan Bio Pro',
  'Πολυνουκλεοτίδια (Rejuran)',
  'Liquid Rhinoplasty — χωρίς χειρουργείο',
  'Ανορθωτικά Νήματα',
  'IV Drip',
  'Hydrafacial',
  'Glass Skin',
  'Skin Pro',
  'DermaPen',
  'Fractional Laser CO2',
  'Αποτρίχωση Laser Alexandrite',
  'Ριζική Αποτρίχωση',
  'Βαθύς Καθαρισμός Προσώπου',
  'Θεραπεία Βαθιάς Ενυδάτωσης',
  'Θεραπεία με Διαμάντι — Dermabrasion',
  'Θεραπεία με Εξωσώματα (Exosomes)',
  'Μεσοθεραπεία Προσώπου',
  'Μεσοθεραπεία Ματιών — Nanosoft',
  'Μεσοθεραπεία Neck Lift',
  'Ραδιοσυχνότητες RF',
  'Φωτοθεραπεία LED',
  'Χημικό Peeling',
  'PRX-T33 Peeling Βιοδιέγερσης',
  'Peeling Λεύκανσης Ευαίσθητων Περιοχών (Μπικίνι · Μασχάλες)',
]

const faceIntroImage = new URL('../assets/face.png', import.meta.url).href

export function FaceTreatments() {
  return (
    <section id="face-treatments" className="face-treatments" aria-labelledby="face-treatments-heading">
      <div className="face-treatments-inner">
        <div className="svc-intro">
          <div className="svc-intro-copy">
            <p className="section-label fade-up">Θεραπείες</p>
            <h2 id="face-treatments-heading" className="section-title fade-up">
              Πρόσωπο
            </h2>
            <div className="gold-rule fade-up" />
            <p className="face-treatments-lead fade-up">
              Σύγχρονες θεραπείες προσώπου που αναδεικνύουν την υγεία και την ποιότητα του
              δέρματος, με εξατομικευμένα πρωτόκολλα από εξειδικευμένο προσωπικό.
            </p>
          </div>
          <figure className="svc-intro-media fade-in">
            <img src={faceIntroImage} alt="Θεραπείες προσώπου — Advanced Derma" loading="lazy" decoding="async" />
          </figure>
        </div>

        <ul className="face-treatments-grid fade-up" aria-label="Θεραπείες προσώπου">
          {faceTreatments.map((name) => {
            const slug = THERAPY_SLUG_BY_NAME[name]
            return (
              <li key={name} className={`face-treatment-chip${slug ? ' is-clickable' : ''}`}>
                <span className="face-treatment-mark" aria-hidden>
                  ✦
                </span>
                {slug ? (
                  <a href={`/therapy/${slug}`} className="face-treatment-link">
                    {name}
                    <span className="treatment-chip-arrow" aria-hidden>
                      →
                    </span>
                  </a>
                ) : (
                  name
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
