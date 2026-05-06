import { images } from '../constants/images'
import {
  CONTACT_EMAIL,
  MAILTO_HREF,
  TEL_ATHENS_LAND_HREF,
  TEL_ATHENS_LAND_LABEL,
  TEL_ATHENS_MOBILE_HREF,
  TEL_ATHENS_MOBILE_LABEL,
  TEL_PIRAEUS_MOBILE_HREF,
  TEL_PIRAEUS_MOBILE_LABEL,
} from '../constants/contact'

export function Locations() {
  return (
    <section id="locations">
      <div className="locations-inner">
        <div className="locations-header">
          <p className="section-label fade-up">Τοποθεσίες</p>
          <h2 className="section-title fade-up">
            Βρείτε μας <em>κοντά σας</em>
          </h2>
          <div className="gold-rule fade-up" />
        </div>

        <div className="location-item fade-in">
          <div className="location-map">
            <iframe
              title="Χάρτης Advanced Derma Athens"
              className="location-map-embed"
              src={images.maps.athens}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <h3 className="location-clinic-name">Advanced Derma Athens</h3>
          <p className="location-address">
            Στρατάρχου Παπάγου Αλεξάνδρου 50, 2ος όροφος
            <br />
            Ζωγράφος · 15771 · ΑΤΤΙΚΗΣ
          </p>
          <div className="location-details">
            <div className="loc-detail">
              <svg className="loc-detail-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Δευτέρα–Παρασκευή · 11:00–20:00 | Σάββατο · 10:00–18:00
            </div>
            <div className="loc-detail loc-detail--contact">
              <svg className="loc-detail-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <div className="loc-detail-stack">
                <div className="loc-detail-row">
                  <span className="loc-detail-meta">Αθήνα · κινητό</span>{' '}
                  <a href={TEL_ATHENS_MOBILE_HREF} className="loc-detail-link">
                    {TEL_ATHENS_MOBILE_LABEL}
                  </a>
                </div>
                <div className="loc-detail-row">
                  <span className="loc-detail-meta">Σταθερό</span>{' '}
                  <a href={TEL_ATHENS_LAND_HREF} className="loc-detail-link">
                    {TEL_ATHENS_LAND_LABEL}
                  </a>
                </div>
              </div>
            </div>
            <div className="loc-detail">
              <svg className="loc-detail-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              <a href={MAILTO_HREF} className="loc-detail-link">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="location-item fade-in">
          <div className="location-map">
            <iframe
              title="Χάρτης Advanced Derma Piraeus — Γρηγορίου Λαμπράκη 109"
              className="location-map-embed"
              src={images.maps.piraeus}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <h3 className="location-clinic-name">Advanced Derma Piraeus</h3>
          <p className="location-address">
            Γρηγορίου Λαμπράκη 109
            <br />
            185 34 · Πειραιάς
          </p>
          <div className="location-details">
            <div className="loc-detail">
              <svg className="loc-detail-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Δευτέρα–Παρασκευή · 11:00–20:00 | Σάββατο · 10:00–18:00
            </div>
            <div className="loc-detail loc-detail--contact">
              <svg className="loc-detail-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <div className="loc-detail-stack">
                <div className="loc-detail-row">
                  <span className="loc-detail-meta">Πειραιάς · κινητό</span>{' '}
                  <a href={TEL_PIRAEUS_MOBILE_HREF} className="loc-detail-link">
                    {TEL_PIRAEUS_MOBILE_LABEL}
                  </a>
                </div>
              </div>
            </div>
            <div className="loc-detail">
              <svg className="loc-detail-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              <a href={MAILTO_HREF} className="loc-detail-link">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
