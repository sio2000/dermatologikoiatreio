import { useMemo, useState } from 'react'
import { images } from '../constants/images'
import { ImageLightbox } from './ImageLightbox'

function fileNameFromAssetPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

export function Doctor() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const assetFiles = useMemo(
    () =>
      import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
        eager: true,
        query: '?url',
        import: 'default',
      }) as Record<string, string>,
    []
  )

  const doctorImage = useMemo(() => {
    const preferred = Object.entries(assetFiles).find(
      ([path]) => fileNameFromAssetPath(path).toLowerCase() === 'ιατρος7.jpeg'
    )?.[1]
    if (preferred) return preferred

    const fromAssets = Object.entries(assetFiles).find(([path]) => path.includes('ιατρος.png'))?.[1]
    return fromAssets ?? images.doctorPortrait
  }, [assetFiles])

  /* Φωτογραφίες ιατρού από συνέδρια */
  const conferencePhotos = useMemo(() => {
    const wanted = [
      'ιατρος5.jpeg',
      'ιατρος6.jpeg',
      'ιατρος9.jpeg',
      'ιατρος10.jpeg',
      'ιατρος12.jpeg',
      'ιατρος13.jpeg',
    ]
    return wanted
      .map((name) =>
        Object.entries(assetFiles).find(
          ([path]) => fileNameFromAssetPath(path).toLowerCase() === name
        )?.[1]
      )
      .filter((url): url is string => Boolean(url))
  }, [assetFiles])

  /* Μικροεικόνες με την ιατρό — κάτω από το πορτρέτο (προτίμηση .png, αλλιώς .jpeg) */
  const doctorThumbs = useMemo(() => {
    const wanted = ['ιατρος', 'ιατρος2', 'ιατρος3', 'ιατρος5', 'ιατρος6', 'ιατρος7', 'ιατρος8', 'ιατρος11', 'ιατρος14']
    const byName = (name: string) =>
      Object.entries(assetFiles).find(
        ([path]) => fileNameFromAssetPath(path).toLowerCase() === name
      )?.[1]
    return wanted
      .map((base) => byName(`${base}.png`) ?? byName(`${base}.jpeg`) ?? byName(`${base}.jpg`))
      .filter((url): url is string => Boolean(url))
  }, [assetFiles])

  /* Όλες οι εικόνες του section (πορτρέτο + μικροεικόνες + συνέδρια) για fullscreen προβολή */
  const lightboxImages = useMemo(
    () => [
      { src: doctorImage, alt: 'Δρ. Χρυσούλα Ζήσιμου' },
      ...doctorThumbs.map((src, i) => ({ src, alt: `Η Δρ. Χρυσούλα Ζήσιμου — φωτογραφία ${i + 1}` })),
      ...conferencePhotos.map((src, i) => ({
        src,
        alt: `Η Δρ. Χρυσούλα Ζήσιμου σε συνέδριο δερματολογίας — φωτογραφία ${i + 1}`,
      })),
    ],
    [doctorImage, doctorThumbs, conferencePhotos]
  )

  return (
    <section id="doctor">
      <div className="doctor-inner">
        <div className="doctor-portrait fade-in">
          <div className="portrait-stack">
            <div className="portrait-accent" aria-hidden />
            <button
              type="button"
              className="portrait-frame portrait-frame--button"
              onClick={() => setActiveIndex(0)}
              aria-label="Άνοιγμα φωτογραφίας σε πλήρη οθόνη"
            >
              <img
                src={doctorImage}
                alt="Δρ. Χρυσούλα Ζήσιμου"
                className="portrait-photo"
                width={600}
                height={800}
                loading="lazy"
              />
              <span className="portrait-zoom" aria-hidden>⤢</span>
            </button>
            <div className="portrait-accent-2">
              <span className="credentials-chip">Δερματολόγος — Αφροδισιολόγος</span>
            </div>
          </div>

          {doctorThumbs.length > 0 ? (
            <div className="doctor-photo-thumbs fade-up" aria-label="Φωτογραφίες της ιατρού">
              {doctorThumbs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className="doctor-photo-thumb"
                  onClick={() => setActiveIndex(i + 1)}
                  aria-label={`Άνοιγμα φωτογραφίας ${i + 1} σε πλήρη οθόνη`}
                >
                  <img
                    src={src}
                    alt={`Η Δρ. Χρυσούλα Ζήσιμου — φωτογραφία ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="doctor-text">
          <p className="section-label fade-up">Η Ιατρός μας</p>
          <h2 className="doctor-name fade-up">
            Δρ. Χρυσούλα
            <br />
            Ζήσιμου
          </h2>
          <p className="doctor-title fade-up">Δερματολόγος – Αφροδισιολόγος</p>

          <p className="doctor-bio fade-up">
            Η Δρ. Χρυσούλα Ζήσιμου είναι Δερματολόγος – Αφροδισιολόγος, με πάνω από 20 χρόνια
            εμπειρίας, και διατηρεί ιδιωτικά ιατρεία στην περιοχή του Ζωγράφου και στον
            Πειραιά. Είναι πτυχιούχος της Ιατρικής Σχολής του Εθνικού και Καποδιστριακού
            Πανεπιστημίου Αθηνών και ειδικεύτηκε στην Δερματολογία στο Νοσοκομείο Δερματικών
            και Αφροδίσιων Νόσων «Ανδρέας Συγγρός». Κατά το 5ο έτος των σπουδών της έλαβε
            υποτροφία του Πανεπιστημίου Αθηνών, καθώς πέτυχε μέσο όρο βαθμολογίας 10,00.
          </p>
          <p className="doctor-bio fade-up">
            Είναι, επίσης, υποψήφια Διδάκτωρ της Ιατρικής Σχολής του Εθνικού και
            Καποδιστριακού Πανεπιστημίου Αθηνών και μετεκπαιδεύτηκε με υποτροφία στην Κλινική
            και Αισθητική Δερματολογία και στις Εφαρμογές Laser, στην Πανεπιστημιακή Κλινική
            Denver Colorado Hospital. Η γιατρός υπήρξε Επιστημονική συνεργάτης της
            Πανεπιστημιακής Κλινικής του Νοσοκομείου Αφροδίσιων και Δερματικών Νόσων «Ανδρέας
            Συγγρός» και διαθέτει έντονη συγγραφική δραστηριότητα με μεγάλο αριθμό
            επιστημονικών δημοσιεύσεων στην Ελλάδα και το εξωτερικό. Τέλος, είναι μέλος της
            Ελληνικής Εταιρείας Δερματολογίας – Αφροδισιολογίας, της Ελληνικής Εταιρείας
            Δερματοχειρουργικής, της European Academy of Dermatology Venereology, καθώς και
            της American Academy of Dermatology Venereology.
          </p>
          <p className="doctor-bio fade-up">
            Επίσης, είναι εγγεγραμμένη στον Παγκύπριο Ιατρικό Σύλλογο καθώς και στο Υπουργείο
            Υγείας της Κύπρου. Είναι εξειδικευμένη σε όλους τους τομείς της ιατρικής και
            αισθητικής δερματολογίας καθώς και στη μικρο-χειρουργική. Παράλληλα έχει δώσει
            έμφαση στις θεραπείες που αφορούν την ακμή.
          </p>
          <p className="doctor-bio fade-up">
            Εδώ και 2 χρόνια διαπρέπει σε Ελλάδα και εξωτερικό. Συγκεκριμένα, συνεργάζεται με
            δύο πολυδύναμες κλινικές σε Κατάρ και Μπαχρέιν.
          </p>

          <blockquote className="doctor-quote fade-up">
            «Η αληθινή ομορφιά δεν κρύβει — αναδεικνύει. Αυτή είναι η φιλοσοφία κάθε θεραπείας
            που σχεδιάζω.»
          </blockquote>

          <div className="doctor-credentials fade-up">
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Μέλος της Ελληνικής Δερματολογικής Εταιρείας
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Πιστοποίηση στις ενέσιμες θεραπείες αισθητικής (Allergan, Galderma)
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Εκπαίδευση σε κέντρα της Γαλλίας, Ιταλίας & Γερμανίας
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Συγγραφέας επιστημονικών δημοσιεύσεων στη δερματολογία
            </div>
            <div className="cred-item">
              <span className="cred-dot" aria-hidden />
              Τακτική παρουσία σε διεθνή συνέδρια αισθητικής ιατρικής
            </div>
          </div>

          <div className="doctor-education fade-up">
            <article className="doctor-edu-card">
              <span className="doctor-edu-icon">🎓</span>
              <div>
                <h4>Εθνικό & Καποδιστριακό Πανεπιστήμιο Αθηνών</h4>
                <p>Ιατρική Σχολή ΕΚΠΑ</p>
              </div>
            </article>
            <article className="doctor-edu-card">
              <span className="doctor-edu-icon">🏥</span>
              <div>
                <h4>Νοσοκομείο «Ανδρέας Συγγρός»</h4>
                <p>Ειδίκευση Δερματολογίας — Αφροδισιολογίας</p>
              </div>
            </article>
            <article className="doctor-edu-card">
              <span className="doctor-edu-icon">📋</span>
              <div>
                <h4>Συνεχής Επιστημονική Εκπαίδευση</h4>
                <p>Διεθνή Συνέδρια & Πιστοποιήσεις</p>
              </div>
            </article>
          </div>

          {conferencePhotos.length > 0 ? (
            <div className="doctor-conferences fade-up">
              <p className="doctor-conferences-title">Διεθνή και Ελληνικά συνέδρια δερματολογίας</p>
              <div className="doctor-conferences-grid">
                {conferencePhotos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className="doctor-conference-item"
                    onClick={() => setActiveIndex(1 + doctorThumbs.length + i)}
                    aria-label={`Άνοιγμα φωτογραφίας από συνέδριο ${i + 1} σε πλήρη οθόνη`}
                  >
                    <img
                      src={src}
                      alt={`Η Δρ. Χρυσούλα Ζήσιμου σε συνέδριο δερματολογίας — φωτογραφία ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="doctor-stats fade-up">
            <div className="doctor-stat">
              <strong>20+</strong>
              <span>Χρόνια εμπειρίας</span>
            </div>
            <div className="doctor-stat">
              <strong>9K+</strong>
              <span>Ασθενείς</span>
            </div>
            <div className="doctor-stat">
              <strong>4.000+</strong>
              <span>Θεραπείες</span>
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </section>
  )
}
