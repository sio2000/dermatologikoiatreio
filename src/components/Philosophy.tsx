import { images } from '../constants/images'

export function Philosophy() {
  const sectionImage = new URL('../assets/section1.png', import.meta.url).href

  return (
    <section id="philosophy">
      <div className="philosophy-inner">
        <div className="philosophy-visual fade-in">
          <div
            className="philosophy-bg"
            style={{ backgroundImage: `url(${images.philosophyBackdrop})` }}
            role="presentation"
            aria-hidden
          />
          <img
            src={sectionImage}
            alt="Χώρος και αισθητική φιλοσοφία του ιατρείου"
            className="philosophy-main-image"
            loading="lazy"
          />
          <div className="philosophy-badge">
            <div className="philosophy-badge-number">15+</div>
            <div className="philosophy-badge-text">Χρόνια εμπειρίας</div>
          </div>
        </div>

        <div>
          <p className="section-label fade-up">Φιλοσοφία</p>
          <h2 className="section-title fade-up">
            Η επιστήμη συναντά
            <br />
            την <em>αισθητική αρμονία</em>
          </h2>
          <div className="gold-rule fade-up" />
          <p
            className="fade-up"
            style={{
              color: 'var(--text-body)',
              fontSize: '0.95rem',
              lineHeight: 1.85,
              marginBottom: 16,
            }}
          >
            Στην Advanced Derma πιστεύουμε ότι κάθε επιδερμίδα είναι μοναδική. Η
            προσέγγισή μας συνδυάζει την ιατρική επιστήμη με τη βαθιά κατανόηση της
            αισθητικής αρμονίας, για αποτελέσματα που αναδεικνύουν τη φυσική σας ομορφιά.
          </p>

          <div className="philosophy-pillars">
            <div className="pillar fade-up">
              <span className="pillar-num">01</span>
              <div className="pillar-content">
                <h4>Εξατομικευμένη Προσέγγιση</h4>
                <p>
                  Κάθε πρόγραμμα θεραπείας σχεδιάζεται αποκλειστικά για τις ανάγκες της
                  δικής σας επιδερμίδας, μετά από διεξοδική κλινική αξιολόγηση.
                </p>
              </div>
            </div>
            <div className="pillar fade-up">
              <span className="pillar-num">02</span>
              <div className="pillar-content">
                <h4>Φυσικά Αποτελέσματα</h4>
                <p>
                  Στόχος μας δεν είναι η αλλαγή, αλλά η ανάδειξη. Κάθε θεραπεία αποσκοπεί
                  σε αποτελέσματα που φαίνονται αυθεντικά και φυσικά.
                </p>
              </div>
            </div>
            <div className="pillar fade-up">
              <span className="pillar-num">03</span>
              <div className="pillar-content">
                <h4>Ιατρική Ακρίβεια</h4>
                <p>
                  Χρησιμοποιούμε αποκλειστικά πιστοποιημένα υλικά και τεχνολογίες αιχμής,
                  με απόλυτη τήρηση των κλινικών πρωτοκόλλων ασφαλείας.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
