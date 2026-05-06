import { images } from '../constants/images'

export function RhinoplastySpotlight() {
  return (
    <section id="rhinoplasty-spotlight" className="rhino-spotlight" aria-labelledby="rhino-spotlight-heading">
      <div className="rhino-spotlight-inner">
        <div className="rhino-spotlight-copy">
          <p className="section-label fade-up">Ρινοπλαστική</p>
          <h2 id="rhino-spotlight-heading" className="section-title fade-up rhino-spotlight-heading">
            Η ομορφιά είναι <em>φως</em>.
            <span className="rhino-spotlight-heading-sub">Η επιστήμη, ο οδηγός της.</span>
          </h2>
          <div className="gold-rule fade-up" />
          <p className="rhino-spotlight-lede fade-up">
            Πιστεύουμε ότι κάθε δέρμα αφηγείται μια ιστορία. Ο ρόλος μας είναι να αποκαλύψουμε τη
            φυσική του λάμψη, χρησιμοποιώντας τις πιο σύγχρονες ιατρικές μεθόδους με σεβασμό στη
            μοναδικότητα κάθε ανθρώπου. Δεν μεταμορφώνουμε — αναδεικνύουμε.
          </p>
          <p className="rhino-spotlight-body fade-up">
            Στη ρινοπλαστική αυτή η φιλοσοφία μεταφράζεται σε αρμονία προσώπου, λειτουργική
            αναπνοή και αποτέλεσμα που «ανήκει» στο πρόσωπό σας: διακριτικό, ισορροπημένο, με
            προτεραιότητα την ασφάλεια και την εμπειρία σας σε κάθε στάδιο — από την πρώτη
            συνάντηση έως την πλήρη ανάρρωση.
          </p>
          <ul className="rhino-spotlight-highlights fade-up" aria-label="Στοιχεία προσέγγισης">
            <li>
              <span className="rhino-spotlight-hi-mark" aria-hidden />
              <span>Ατομικό χειρουργικό πλάνο και ρεαλιστικοί στόχοι</span>
            </li>
            <li>
              <span className="rhino-spotlight-hi-mark" aria-hidden />
              <span>Λεπτομερής αξιολόγηση ανατομίας &amp; αισθητικής αρμονίας</span>
            </li>
            <li>
              <span className="rhino-spotlight-hi-mark" aria-hidden />
              <span>Συνεχής καθοδήγηση &amp; μετρήσιμα βήματα αποθεραπείας</span>
            </li>
          </ul>
          <p className="rhino-spotlight-foot fade-up">
            <a href="#results" className="rhino-spotlight-link">
              Δείτε πριν &amp; μετά — ρινοπλαστική
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
              alt="Ενδεικτικό αποτέλεσμα θεραπείας — ρινοπλαστική"
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
