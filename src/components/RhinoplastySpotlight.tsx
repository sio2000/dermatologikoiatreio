import { images } from '../constants/images'

export function RhinoplastySpotlight() {
  return (
    <section id="rhinoplasty-spotlight" className="rhino-spotlight" aria-labelledby="rhino-spotlight-heading">
      <div className="rhino-spotlight-inner">
        <div className="rhino-spotlight-copy">
          <p className="section-label fade-up">Liquid Rhinoplasty</p>
          <h2 id="rhino-spotlight-heading" className="section-title fade-up rhino-spotlight-heading">
            Ρινοπλαστική <em>χωρίς</em> χειρουργείο.
            <span className="rhino-spotlight-heading-sub">Άμεσο, ανώδυνο αποτέλεσμα.</span>
          </h2>
          <div className="gold-rule fade-up" />
          <p className="rhino-spotlight-lede fade-up">
            Η Liquid Rhinoplasty είναι μια πρωτοποριακή, μη χειρουργική μέθοδος διόρθωσης του
            σχήματος της μύτης με ενέσιμο εμφύτευμα υαλουρονικού οξέος. Δυσμορφίες,
            βαθουλώματα και ελλείμματα ιστού «γεμίζουν» με ακρίβεια, χωρίς νυστέρι και χωρίς
            ανάρρωση.
          </p>
          <p className="rhino-spotlight-body fade-up">
            Η εφαρμογή ολοκληρώνεται σε λίγα λεπτά, το αποτέλεσμα είναι άμεσα ορατό και
            φυσικό, ενώ η βελτίωση του σχήματος μπορεί να φτάσει έως και την πλήρη διόρθωση
            της δυσμορφίας. Με μικρή συντήρηση ανά τακτά διαστήματα, το αποτέλεσμα
            διατηρείται σε βάθος χρόνου.
          </p>
          <ul className="rhino-spotlight-highlights fade-up" aria-label="Στοιχεία προσέγγισης">
            <li>
              <span className="rhino-spotlight-hi-mark" aria-hidden />
              <span>Χωρίς χειρουργείο — με ενέσιμο υαλουρονικό οξύ</span>
            </li>
            <li>
              <span className="rhino-spotlight-hi-mark" aria-hidden />
              <span>Άμεση, ανώδυνη εφαρμογή σε λίγα λεπτά</span>
            </li>
            <li>
              <span className="rhino-spotlight-hi-mark" aria-hidden />
              <span>Φυσικό αποτέλεσμα χωρίς χρόνο αποθεραπείας</span>
            </li>
          </ul>
          <p className="rhino-spotlight-foot fade-up">
            <a href="#results" className="rhino-spotlight-link">
              Δείτε πριν &amp; μετά
              <span className="rhino-spotlight-link-arrow" aria-hidden>
                →
              </span>
            </a>
          </p>
        </div>

        <figure className="rhino-spotlight-visual fade-in">
          <div className="rhino-spotlight-visual-glow" aria-hidden />
          <div className="rhino-spotlight-frame">
            <img
              src={images.rhinoplastySpotlight}
              alt="Ενδεικτικό αποτέλεσμα θεραπείας — Liquid Rhinoplasty"
              className="rhino-spotlight-img"
              width={900}
              height={1120}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="rhino-spotlight-caption">
            Φυσική γραμμή &amp; ισορροπία — κλινική εμπειρία Advanced Derma
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
