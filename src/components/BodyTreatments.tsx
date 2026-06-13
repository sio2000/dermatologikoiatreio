import { THERAPY_SLUG_BY_NAME } from '../constants/therapies'

const bodyTreatments = [
  {
    title: 'RF Alma',
    desc: 'Τέλος στο «φλοιό πορτοκαλιού»: μη παρεμβατική, επαναστατική τεχνολογία για επιδερμική σύσφιξη των ιστών και καταπολέμηση της κυτταρίτιδας και του τοπικού λίπους, με εντυπωσιακά αποτελέσματα.',
  },
  {
    title: 'Body Filler',
    desc: 'Μη χειρουργική αύξηση και ανόρθωση με υαλουρονικό οξύ, για φυσικό όγκο και σφριγηλότητα χωρίς ενθέματα.',
  },
  {
    title: 'Barbie Botox',
    desc: 'Βοτουλινική στους τραπεζοειδείς για πιο λεπτή γραμμή λαιμού και κομψούς ώμους, με ανακούφιση από τη μυϊκή ένταση.',
  },
  {
    title: 'Αποτρίχωση Laser Alexandrite',
    desc: 'Τέλος στην ανεπιθύμητη τριχοφυΐα με τρόπο γρήγορο και ασφαλή, σε πρόσωπο και σώμα.',
  },
  {
    title: 'Hyacorp Body Contouring',
    desc: 'Μη χειρουργική θεραπεία σώματος που σμιλεύει τη σιλουέτα και χαρίζει λεία, σφιχτή επιδερμίδα με άμεσα ορατά αποτελέσματα.',
  },
  {
    title: 'PB Serum',
    desc: 'Καινοτόμος μέθοδος λιποδιάλυσης για σώμα και πρόσωπο, που βελτιώνει την υφή, την ελαστικότητα και τη συνολική εικόνα της επιδερμίδας.',
  },
  {
    title: 'Θεραπεία Lipopeptis',
    desc: 'Στοχευμένη λιπόλυση, σύσφιξη και ενεργοποίηση του μεταβολισμού για λείο και σφριγηλό δέρμα.',
  },
  {
    title: 'Θεραπεία Κυτταρίτιδας CelluErase',
    desc: 'Αποτελεσματική και ανώδυνη αντιμετώπιση της κυτταρίτιδας, με βελτίωση της υφής του δέρματος και ορατά αποτελέσματα από την πρώτη συνεδρία.',
  },
  {
    title: 'Θεραπεία Κυτταρίτιδας Alidya',
    desc: 'Ενέσιμη θεραπεία κυτταρίτιδας που βελτιώνει την κυκλοφορία και μειώνει την όψη «φλοιού πορτοκαλιού», για πιο σφριγηλό δέρμα.',
  },
  {
    title: 'Λιποδιάλυση Aqualyx & Michelangelo',
    desc: 'Προηγμένη ενέσιμη μέθοδος λιποδιάλυσης για το επίμονο τοπικό λίπος — φυσική σμίλευση χωρίς χειρουργείο.',
  },
  {
    title: 'Μεσοθεραπεία Σώματος',
    desc: 'Αναδομεί και ενυδατώνει σε βάθος, μειώνει την κυτταρίτιδα και βελτιώνει το περίγραμμα του σώματος με ασφαλή, μη επεμβατικό τρόπο.',
  },
  {
    title: 'Ραγάδες',
    desc: 'Στην Advanced Derma προσφέρουμε σύγχρονες θεραπείες που μειώνουν την ορατότητα των ραγάδων και ενισχύουν τη λείανση του δέρματος.',
  },
  {
    title: 'Ευρυαγγείες',
    desc: 'Αντιμετώπιση των διατεταμένων αγγείων σε πρόσωπο και κάτω άκρα με σύγχρονες και ασφαλείς μεθόδους.',
  },
  {
    title: 'Ραδιοσυχνότητες RF',
    desc: 'Προηγμένη, μη επεμβατική μέθοδος αναδόμησης και σύσφιξης του δέρματος για πρόσωπο και σώμα.',
  },
  {
    title: 'Botox Υπεριδρωσίας',
    desc: 'Ενέσιμη θεραπεία που μειώνει δραστικά την παραγωγή ιδρώτα, προσφέροντας άμεση ανακούφιση και βελτίωση της ποιότητας ζωής.',
  },
]

const bodyIntroImage = new URL('../assets/lazerhairremoval.png', import.meta.url).href

export function BodyTreatments() {
  return (
    <section id="body-treatments" className="body-treatments" aria-labelledby="body-treatments-heading">
      <div className="body-treatments-inner">
        <div className="svc-intro svc-intro--reverse">
          <div className="svc-intro-copy">
            <p className="section-label fade-up">Θεραπείες</p>
            <h2 id="body-treatments-heading" className="section-title fade-up">
              Σώμα
            </h2>
            <div className="gold-rule fade-up" />
            <p className="body-treatments-lead fade-up">
              Συνδυάζουμε την ιατρική γνώση με τη σύγχρονη τεχνολογία για τη βελτίωση της υφής
              του δέρματος και το σχήμα του σώματος.
            </p>
          </div>
          <figure className="svc-intro-media fade-in">
            <img src={bodyIntroImage} alt="Θεραπείες σώματος — Advanced Derma" loading="lazy" decoding="async" />
          </figure>
        </div>

        <div className="body-treatments-grid">
          {bodyTreatments.map((item) => {
            const slug = THERAPY_SLUG_BY_NAME[item.title]
            const content = (
              <>
                <h3>
                  {item.title}
                  {slug ? (
                    <span className="treatment-chip-arrow" aria-hidden>
                      {' '}
                      →
                    </span>
                  ) : null}
                </h3>
                <p>{item.desc}</p>
              </>
            )
            return slug ? (
              <a key={item.title} href={`/therapy/${slug}`} className="body-treatment-card body-treatment-card--link fade-up">
                {content}
              </a>
            ) : (
              <article key={item.title} className="body-treatment-card fade-up">
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
