const HERO_IMAGE_URL = new URL('../../assets/hero4.png', import.meta.url).href

export function HeroSkinAnalysis() {
  return (
    <section id="hero" className="hero-dm" aria-label="Hero">
      <div className="hero-dm-main">
        <div className="hero-dm-grid">
          <div className="hero-dm-copy">
            <h1 className="hero-dm-title">
              <span className="hero-dm-title-line">
                Η επιστήμη της δερματολογίας
              </span>
              <span className="hero-dm-title-line">
                συναντά την <em>αισθητική αρμονία</em>.
              </span>
            </h1>
            <p className="hero-dm-lead">
              Στην Advanced Derma προσφέρουμε ιατρικά εξατομικευμένες θεραπείες που
              αναδεικνύουν το καλύτερο αποτέλεσμα για την επιδερμίδα σας, με απόλυτη ασφάλεια,
              φυσική αισθητική και σεβασμό στη μοναδικότητα κάθε προσώπου. Με πολυετή εμπειρία
              και εξειδίκευση στην αντιμετώπιση και θεραπεία της <strong>Ακμής</strong>, μέσα
              από συνδυαστικά πρωτόκολλα χωρίς παρενέργειες και με εντυπωσιακά αποτελέσματα.
            </p>
            <div className="hero-dm-actions">
              <a href="#booking" className="hero-dm-btn hero-dm-btn--primary">
                Κλείστε Ραντεβού
              </a>
              <a href="#doctor" className="hero-dm-btn hero-dm-btn--ghost">
                Γνωρίστε την Ιατρό
              </a>
            </div>
          </div>

          <div className="hero-dm-visual">
            <div className="hero-dm-canvas-slot">
              <img
                src={HERO_IMAGE_URL}
                alt="Υγιής, λαμπερή επιδερμίδα — Advanced Derma"
                className="hero-dm-photo"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
