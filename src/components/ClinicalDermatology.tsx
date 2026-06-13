import { THERAPY_SLUG_BY_NAME } from '../constants/therapies'

const skinConditions = [
  'Ακμή',
  'Ροδόχρους νόσος',
  'Τριχόπτωση',
  'Παθήσεις ονύχων',
  'Σπίλοι',
  'Ψηφιακή Χαρτογράφηση Σπίλων',
  'Όγκοι δέρματος',
  'Σεξουαλικώς μεταδιδόμενα νοσήματα',
  'Κονδυλώματα',
  'Παιδοδερματολογία',
  'Υπερκερατώσεις',
  'Κρυοθεραπεία',
  'Δερματοχειρουργική',
  'Ατοπική δερματίτιδα',
  'Σμηγματορροϊκή δερματίτιδα',
  'Ψωρίαση',
  'Κνίδωση',
  'Χηλοειδή και ουλές',
  'Μυρμηγκιές',
  'Ψώρα',
  'Μυκητιάσεις',
  'Θηλώματα',
  'Ξανθελάσματα',
  'Έλκη',
  'Έρπης ζωστήρας',
  'Λεύκη',
]

const clinicalIntroImage = new URL('../assets/mesotherapy.png', import.meta.url).href

export function ClinicalDermatology() {
  return (
    <section id="clinical-dermatology" className="clinical-derm" aria-labelledby="clinical-derm-heading">
      <div className="clinical-derm-inner">
        <div className="svc-intro">
          <div className="svc-intro-copy">
            <p className="section-label fade-up">Κλινική Δερματολογία</p>
            <h2 id="clinical-derm-heading" className="section-title fade-up">
              Παθήσεις <em>Δέρματος</em>
            </h2>
            <div className="gold-rule fade-up" />
            <p className="clinical-derm-lead fade-up">
              Ουσιαστική φροντίδα με επίκεντρο την υγεία του δέρματος: διάγνωση και θεραπεία
              δερματολογικών παθήσεων με σύγχρονη ιατρική προσέγγιση.
            </p>
          </div>
          <figure className="svc-intro-media fade-in">
            <img src={clinicalIntroImage} alt="Κλινική δερματολογία — Advanced Derma" loading="lazy" decoding="async" />
          </figure>
        </div>

        <ul className="clinical-derm-grid fade-up" aria-label="Παθήσεις δέρματος">
          {skinConditions.map((name) => {
            const slug = THERAPY_SLUG_BY_NAME[name]
            return (
              <li key={name} className={`clinical-derm-chip${slug ? ' is-clickable' : ''}`}>
                <span className="clinical-derm-mark" aria-hidden />
                {slug ? (
                  <a href={`/therapy/${slug}`} className="clinical-derm-link">
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
