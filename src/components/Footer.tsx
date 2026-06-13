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

export function Footer() {
  const logoUrl = new URL('../assets/logo.jpg', import.meta.url).href

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logoUrl} alt="Advanced Derma logo" className="footer-logo-image" />
          <div className="footer-logo-main">Advanced Derma</div>
          <div className="footer-logo-sub">Δερματολογία · Αισθητική Ιατρική</div>
          <p className="footer-desc">
            Εξειδικευμένη κλινική δερματολογίας και αισθητικής ιατρικής στο κέντρο της
            Αθήνας. Υπό τη διεύθυνση της Δρ. Χρυσούλας Ζήσιμου.
          </p>
          <div className="footer-social">
            <a
              className="social-btn"
              href="https://www.facebook.com/advancedermaa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook — Advanced Derma"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
          <ul className="footer-instagram" aria-label="Προφίλ Instagram">
            {[
              { handle: '@advanced_derma', href: 'https://www.instagram.com/advanced_derma/' },
              { handle: '@advanced_laser_', href: 'https://www.instagram.com/advanced_laser_/' },
              { handle: '@advanced_peiraias', href: 'https://www.instagram.com/advanced_peiraias/' },
              { handle: '@chrysoula_zisimou', href: 'https://www.instagram.com/chrysoula_zisimou/' },
            ].map((profile) => (
              <li key={profile.handle}>
                <a
                  className="footer-instagram-link"
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram — ${profile.handle}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                  {profile.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-therapies">
          <div id="footer-therapies" className="footer-col-title">
            Θεραπείες
          </div>
          <ul className="footer-links">
            <li>
              <a href="#face-treatments">Πρόσωπο</a>
            </li>
            <li>
              <a href="#body-treatments">Σώμα</a>
            </li>
            <li>
              <a href="#clinical-dermatology">Κλινική Δερματολογία</a>
            </li>
            <li>
              <a href="#services">Laser Hair Removal</a>
            </li>
            <li>
              <a href="#biofiller-spotlight">Biofiller</a>
            </li>
            <li>
              <a href="#services">PRP θεραπεία</a>
            </li>
            <li>
              <a href="#services">Μεσοθεραπεία</a>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-clinic">
          <div id="footer-clinic" className="footer-col-title">
            Ιατρείο
          </div>
          <ul className="footer-links">
            <li>
              <a href="#doctor">Ο ιατρός μας</a>
            </li>
            <li>
              <a href="#philosophy">Φιλοσοφία</a>
            </li>
            <li>
              <a href="#results">Αποτελέσματα</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#testimonials">Αξιολογήσεις</a>
            </li>
            <li>
              <a href="#locations">Επικοινωνία</a>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-contact-title">
          <div id="footer-contact-title" className="footer-col-title">
            Επικοινωνία
          </div>
          <ul className="footer-links footer-links--contact">
            <li>
              <a href="#locations">Στρατάρχου Παπάγου Αλεξάνδρου 50, Ζωγράφος</a>
            </li>
            <li>
              <a href="#locations">Γρηγορίου Λαμπράκη 109, 1ος όροφος, Πειραιάς</a>
            </li>
            <li>
              <a href={MAILTO_HREF} className="footer-contact-link">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <span className="footer-contact-label">Αθήνα (κινητό)</span>{' '}
              <a href={TEL_ATHENS_MOBILE_HREF} className="footer-contact-link">
                {TEL_ATHENS_MOBILE_LABEL}
              </a>
            </li>
            <li>
              <span className="footer-contact-label">Σταθερό</span>{' '}
              <a href={TEL_ATHENS_LAND_HREF} className="footer-contact-link">
                {TEL_ATHENS_LAND_LABEL}
              </a>
            </li>
            <li>
              <span className="footer-contact-label">Πειραιάς</span>{' '}
              <a href={TEL_PIRAEUS_MOBILE_HREF} className="footer-contact-link">
                {TEL_PIRAEUS_MOBILE_LABEL}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} Advanced Derma. Δρ. Χρυσούλα Ζήσιμου. Με επιφύλαξη παντός
          δικαιώματος.
        </p>
        <p className="footer-powered">
          <a
            href="https://devtaskhub.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-powered-link"
          >
            powered by www.devtaskhub.com
          </a>
        </p>
      </div>
    </footer>
  )
}
