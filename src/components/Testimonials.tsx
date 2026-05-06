import { useMemo } from 'react'

const testimonialItems = [
  {
    text: 'Η Δρ. Ζήσιμου είναι εξαιρετική επαγγελματίας. Η θεραπεία αντιγήρανσης που ακολούθησα έδωσε φυσικά αποτελέσματα που ξεπέρασαν κάθε μου προσδοκία. Η ατμόσφαιρα του ιατρείου είναι ανεπανάληπτη.',
    name: 'Σοφία Κ.',
    treatment: 'Botox & Fillers',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    text: 'Χρόνια πολεμούσα την ακμή. Μετά από 4 μήνες θεραπείας, η επιδερμίδα μου άλλαξε εντελώς. Η προσέγγιση είναι εξατομικευμένη και ο χρόνος που αφιερώνεται σε κάθε ασθενή είναι αξιοθαύμαστος.',
    name: 'Αλέξανδρος Μ.',
    treatment: 'Θεραπεία Ακμής',
    avatar:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=160&q=80',
  },
  {
    text: 'Έκανα Laser Hair Removal (ιατρική αποτρίχωση) και fractional CO₂ — τα αποτελέσματα είναι εκπληκτικά. Το ιατρείο διαθέτει εξοπλισμό αιχμής και η Δρ. Ζήσιμου εξηγεί με λεπτομέρεια κάθε βήμα της διαδικασίας.',
    name: 'Ελένη Π.',
    treatment: 'Laser Hair Removal & CO₂',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
  },
] as const

export function Testimonials() {
  const localGallery = useMemo(() => {
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>

    return Object.entries(files)
      .filter(([path]) => !path.includes('hero.png') && !path.includes('vite.svg') && !path.includes('react.svg'))
      .map(([, url]) => url)
      .slice(0, 10)
  }, [])
  const loopGallery = [...localGallery, ...localGallery]

  return (
    <section id="testimonials">
      <div className="testimonials-inner">
        <div className="testimonials-header">
          <p className="section-label fade-up">Κριτικές</p>
          <h2 className="section-title fade-up">
            Λένε για <em>εμάς</em>
          </h2>
          <div className="gold-rule fade-up" />
        </div>

        <div className="testimonials-track">
          {testimonialItems.map((item) => (
            <article key={item.name} className="testimonial-card fade-up">
              <span className="testimonial-quote-mark" aria-hidden>
                "
              </span>
              <div className="testimonial-stars" aria-label="Βαθμολογία 5 στα 5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="star">
                    ★
                  </span>
                ))}
              </div>
              <p className="testimonial-text">{item.text}</p>
              <footer className="testimonial-author">
                <img src={item.avatar} alt={`Προφίλ ${item.name}`} className="author-avatar-photo" loading="lazy" />
                <div>
                  <div className="author-name">{item.name}</div>
                  <div className="author-treatment">{item.treatment}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div className="testimonials-gallery-rotator fade-in">
          <p className="testimonials-gallery-kicker">Στιγμές από τον χώρο και τις θεραπείες μας</p>
          <div className="testimonials-gallery-marquee">
            <div className="testimonials-gallery-track">
              {loopGallery.map((src, i) => (
                <article key={`${src}-${i}`} className="testimonials-gallery-card">
                  <img src={src} alt={`Γκαλερί κλινικής — φωτογραφία ${(i % localGallery.length) + 1}`} loading="lazy" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
