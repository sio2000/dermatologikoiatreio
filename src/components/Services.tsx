import type { ReactNode } from 'react'

export function Services() {
  const serviceCards: Array<{
    id: string
    title: ReactNode
    desc: string
    icon: ReactNode
    emphasis?: boolean
  }> = [
    {
      id: 'anti',
      title: 'Αντιγήρανση',
      desc: 'Προηγμένα πρωτόκολλα αναζωογόνησης για φυσικά, νεανικά αποτελέσματα χωρίς χειρουργική επέμβαση.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="1.5" aria-hidden>
          <path d="M12 2C9 2 7 4.2 7 7.1c0 1.8 1 3.3 2.5 4.2-.9 1.2-1.5 2.6-1.5 4.2V22h8v-6.5c0-1.6-.6-3-1.5-4.2C16 10.4 17 8.9 17 7.1 17 4.2 15 2 12 2z" />
        </svg>
      ),
    },
    {
      id: 'injectables',
      title: 'Ενέσιμα',
      desc: 'Υαλουρονικό οξύ, βοτουλινική τοξίνη και μεσοθεραπείες με ακρίβεια και αισθητική λεπτότητα.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="1.5" aria-hidden>
          <path d="M4 20l6-6M14 10l6-6M8 16l8-8M14 4l6 6M4 10l6 6" />
        </svg>
      ),
    },
    {
      id: 'laser',
      title: (
        <span className="service-title-stack">
          <span className="service-laser-brand">Laser Hair Removal</span>
          <span className="service-laser-caption">Αποτρίχωση &amp; λάμψη δέρματος</span>
        </span>
      ),
      desc: 'Τελευταίας γενιάς τεχνολογία με έμφαση στο Laser Hair Removal: αποτρίχωση, ανανέωση δέρματος και δυσχρωμίες με ακρίβεια.',
      emphasis: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      ),
    },
    {
      id: 'clinical',
      title: 'Κλινική Δερματολογία',
      desc: 'Διάγνωση και θεραπεία δερματολογικών παθήσεων με σύγχρονη ιατρική προσέγγιση.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="1.5" aria-hidden>
          <path d="M12 21s-7-3.9-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 6.1-7 10-7 10z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="services">
      <div className="services-inner">
        <div className="services-header">
          <div>
            <p className="section-label fade-up">Θεραπείες</p>
            <h2 className="section-title fade-up">
              Εξειδικευμένες <em>λύσεις</em>
              <br />
              για κάθε ανάγκη
            </h2>
          </div>
        </div>

        <div className="services-grid">
          {serviceCards.map((item) => (
            <article
              key={item.id}
              className={`service-card fade-up${item.emphasis ? ' service-card--laser-spotlight' : ''}`}
            >
              <div className="service-icon">
                <div className="service-icon-ring">{item.icon}</div>
              </div>
              <h3 className="service-name">{item.title}</h3>
              <p className="service-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
