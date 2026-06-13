import { useMemo, useState } from 'react'
import { ImageLightbox } from './ImageLightbox'

type TreatmentCard = {
  title: string
  short: string
  points: string[]
  image: string
  accent?: 'laser-hair-removal'
}

type TreatmentSeed = {
  title: string
  short: string
  points: string[]
  /** Exact filename(s) under src/assets (png / jpg / jpeg / webp); first match wins */
  imageFile?: string | string[]
  accent?: TreatmentCard['accent']
}

const treatmentSeed: TreatmentSeed[] = [
  {
    title: 'Αντιγήρανση & Botox',
    short: 'Λειαίνει ρυτίδες έκφρασης και προλαμβάνει νέες γραμμές με φυσικό αποτέλεσμα.',
    points: ['Άμεση βελτίωση έκφρασης', 'Εφαρμογή 10-15 λεπτών', 'Επιστροφή άμεσα στις δραστηριότητες'],
    imageFile: 'αποτελεσματαθεραπειων.png',
  },
  {
    title: 'Fillers υαλουρονικού',
    short: 'Αποκατάσταση όγκου και ενυδάτωσης σε χείλη, ζυγωματικά και ρινοπαρειακές.',
    points: ['Στοχευμένη διόρθωση', 'Φυσικό περίγραμμα προσώπου', 'Αποτελέσματα με διάρκεια'],
    imageFile: 'αποτελεσματαθεραπειων28.png',
  },
  {
    title: 'Biofiller',
    short: 'Αυτόλογη, βιοσυμβατή προσέγγιση για φυσικό όγκο και λεία επιφάνεια χωρίς συνθετικό υλικό.',
    points: ['Κύτταρα του ίδιου του οργανισμού', 'Ήπια διάχυση & αρμονία', 'Ιδανικό για πρόσωπο & λεπτές διορθώσεις'],
    imageFile: 'αποτελεσματαθεραπειων8.png',
  },
  {
    title: 'Laser Hair Removal',
    short: 'Η υπογραφή μας: ιατρική αποτρίχωση laser και ολοκληρωμένη βελτίωση υφής και τόνου δέρματος.',
    accent: 'laser-hair-removal',
    points: ['Αποτρίχωση προσώπου & σώματος', 'Μείωση δυσχρωμιών & πόρων', 'Πρωτόκολλα ανά τύπο δέρματος'],
    imageFile: ['lazerhairremoval.png', 'ιατρος8.png', 'ιατρος8.jpeg', 'ιατρος8.jpg'],
  },
  {
    title: 'Θεραπεία ακμής',
    short: 'Πρωτόκολλα για ενεργή ακμή και ουλές με ιατρική παρακολούθηση.',
    points: ['Έλεγχος φλεγμονής', 'Μείωση σημαδιών/ουλών', 'Σταδιακή εξισορρόπηση λιπαρότητας'],
    imageFile: 'αποτελεσματαθεραπειων12.png',
  },
  {
    title: 'PRP / Plasma',
    short: 'Αυτόλογη αναζωογόνηση με πλάσμα πλούσιο σε αιμοπετάλια για λάμψη και ανάπλαση.',
    points: ['Ενεργοποίηση κολλαγόνου', 'Βελτίωση υφής και τόνου', 'Ιδανικό συμπληρωματικά σε άλλα πρωτόκολλα'],
    imageFile: 'prp.jpg',
  },
  {
    title: 'Μεσοθεραπεία',
    short: 'Ενυδάτωση και θρέψη σε βάθος με κοκτέιλ βιταμινών, αμινοξέων και υαλουρονικού.',
    points: ['Άμεση φωτεινότητα', 'Ενίσχυση ελαστικότητας', 'Πρόληψη αφυδάτωσης'],
    imageFile: 'mesotherapy.png',
  },
  {
    title: 'Κλινική δερματολογία',
    short: 'Διάγνωση και αντιμετώπιση δερματολογικών παθήσεων με ασφάλεια και ακρίβεια.',
    points: ['Σπίλοι και χαρτογράφηση', 'Ατοπική δερματίτιδα/ροδόχρους', 'Εξατομικευμένο θεραπευτικό πλάνο'],
    imageFile: 'αποτελεσματαθεραπειων15.png',
  },
  {
    title: 'Τριχόπτωση & αλωπεκία',
    short: 'Ολοκληρωμένη προσέγγιση για ενδυνάμωση θύλακα και βελτίωση πυκνότητας.',
    points: ['Διαγνωστικός έλεγχος', 'PRP και μεσοθεραπεία τριχωτού', 'Πρωτόκολλα συντήρησης'],
    imageFile: 'αποτελεσματαθεραπειων2.png',
  },
]

function fileNameFromAssetPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

function resolveAssetUrl(assetMap: Record<string, string>, wantName: string): string | '' {
  const target = wantName.trim().toLowerCase()
  const hit = Object.entries(assetMap).find(
    ([path]) => fileNameFromAssetPath(path).toLowerCase() === target
  )
  return hit?.[1] ?? ''
}

/** Φωτογραφίες θεραπειών: η μία κάτω από την άλλη, στοιχισμένες (όχι καρουζέλ) */
export function TreatmentsStacked() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const assetMap = useMemo(() => {
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>
    const entries = Object.entries(files).filter(
      ([path]) =>
        !path.includes('hero.png') && !path.includes('vite.svg') && !path.includes('react.svg')
    )
    return Object.fromEntries(entries) as Record<string, string>
  }, [])

  const fallbackPool = useMemo(() => Object.values(assetMap), [assetMap])

  const cards: TreatmentCard[] = useMemo(
    () =>
      treatmentSeed.map((item, i) => {
        const names = item.imageFile
          ? Array.isArray(item.imageFile)
            ? item.imageFile
            : [item.imageFile]
          : []
        const byName =
          names.map((n) => resolveAssetUrl(assetMap, n)).find((url) => url.length > 0) ?? ''
        const image =
          byName ||
          fallbackPool[i % Math.max(fallbackPool.length, 1)] ||
          fallbackPool[0] ||
          ''
        return {
          title: item.title,
          short: item.short,
          points: item.points,
          image,
          accent: item.accent,
        }
      }),
    [assetMap, fallbackPool]
  )

  return (
    <section id="treatments-carousel" className="treatments-stacked">
      <div className="treatments-stacked-inner">
        <div className="treatments-stacked-head">
          <p className="section-label fade-up">Εξατομικευμένες Θεραπείες</p>
          <h2 className="section-title fade-up">
            Θεραπείες <em>προσαρμοσμένες</em> στο δέρμα σας
          </h2>
          <div className="gold-rule fade-up" />
        </div>

        <div className="treatments-stacked-list">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`treatment-stack-card fade-up${card.accent === 'laser-hair-removal' ? ' treatment-stack-card--laser' : ''}`}
            >
              <button
                type="button"
                className="treatment-stack-media"
                onClick={() => setActiveIndex(index)}
                aria-label={`Άνοιγμα σε πλήρη οθόνη — ${card.title}`}
              >
                <span className="treatment-stack-num">{String(index + 1).padStart(2, '0')}</span>
                {card.image ? <img src={card.image} alt={card.title} loading="lazy" decoding="async" /> : null}
                <span className="treatment-stack-zoom" aria-hidden>⤢</span>
              </button>
              <div className="treatment-stack-body">
                <h3>
                  {card.accent === 'laser-hair-removal' ? (
                    <>
                      <span className="treatment-laser-brand">Laser Hair Removal</span>
                      <span className="treatment-laser-el">Ιατρική αποτρίχωση &amp; laser δέρματος</span>
                    </>
                  ) : (
                    card.title
                  )}
                </h3>
                <p>{card.short}</p>
                <ul>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ImageLightbox
        images={cards.map((card) => ({ src: card.image, alt: card.title }))}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </section>
  )
}
