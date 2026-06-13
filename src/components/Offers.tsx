const allInOneImageLaser = new URL('../assets/lazerhairremoval.png', import.meta.url).href
const allInOneImagePeeling = new URL('../assets/mesotherapy.png', import.meta.url).href
const allInOneImagePrx = new URL('../assets/hero45.png', import.meta.url).href

const allInOneSteps = [
  {
    label: 'Full Body Laser',
    title: 'Με την τελευταία λέξη της τεχνολογίας',
    desc: 'Laser Alexandrite για ολόκληρο το σώμα.',
    image: allInOneImageLaser,
  },
  {
    label: 'Exo NAD Peeling',
    title: 'Peeling χωρίς ενέσεις',
    desc: 'Θεραπεία τελευταίας γενιάς που συνδυάζει εξωσώματα και NAD.',
    image: allInOneImagePeeling,
  },
  {
    label: 'PRX-T33',
    title: 'Νέα Αναζωογόνηση',
    desc: 'Μη ενέσιμη βιοδιέγερση — ένα booster που θα νιώσεις, χωρίς καθόλου αποθεραπεία.',
    image: allInOneImagePrx,
  },
]

const offers = [
  {
    title: 'Φοιτητικό Laser Αποτρίχωσης',
    lines: [
      { label: 'Full body', price: '90€' },
      { label: 'Half body', price: '60€' },
    ],
    note: 'Προσφορά για φοιτητές με επίδειξη φοιτητικής ταυτότητας.',
  },
  {
    title: 'Δερματοσκόπηση + Χαρτογράφηση',
    lines: [{ label: 'Πλήρης έλεγχος σπίλων', price: '100€' }],
    note: 'Πρόληψη και έγκαιρη διάγνωση με ψηφιακή ακρίβεια.',
  },
]

export function Offers() {
  return (
    <section id="offers" className="offers-section" aria-labelledby="offers-heading">
      <div className="offers-inner">
        <div className="offers-header">
          <p className="section-label fade-up">Special Offers</p>
          <h2 id="offers-heading" className="section-title fade-up">
            Προσφορές
          </h2>
          <div className="gold-rule fade-up" />
          <p className="offers-lead fade-up">
            Υπηρεσίες σχεδιασμένες ώστε η αισθητική δερματολογία να είναι προσιτή, χωρίς καμία
            έκπτωση στην ποιότητα και την ασφάλεια — πάντα από εξειδικευμένο προσωπικό.
          </p>
        </div>

        {/* Featured: All in 1 Pack */}
        <article className="all-in-one fade-up" aria-labelledby="all-in-one-title">
          <div className="all-in-one-head">
            <p className="all-in-one-brand">Advanced Derma</p>
            <h3 id="all-in-one-title" className="all-in-one-title">
              All in 1 Pack
            </h3>
            <p className="all-in-one-price">
              Μόνο <strong>100€</strong>
            </p>
          </div>

          <div className="all-in-one-steps">
            {allInOneSteps.map((step) => (
              <div key={step.label} className="all-in-one-step">
                <div className="all-in-one-step-media">
                  <img src={step.image} alt={step.label} loading="lazy" decoding="async" />
                </div>
                <span className="all-in-one-step-label">{step.label}</span>
                <h4 className="all-in-one-step-title">{step.title}</h4>
                <p className="all-in-one-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          <a href="#booking" className="all-in-one-cta">
            Κλείστε ραντεβού
            <span aria-hidden> →</span>
          </a>
        </article>

        <div className="offers-grid offers-grid--secondary">
          {offers.map((offer) => (
            <article key={offer.title} className="offer-card fade-up">
              <h3 className="offer-title">{offer.title}</h3>
              <div className="offer-lines">
                {offer.lines.map((line) => (
                  <div key={line.label} className="offer-line">
                    <span className="offer-line-label">{line.label}</span>
                    <span className="offer-line-price">{line.price}</span>
                  </div>
                ))}
              </div>
              <p className="offer-note">{offer.note}</p>
              <a href="#booking" className="offer-cta">
                Κλείστε ραντεβού
                <span aria-hidden> →</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
