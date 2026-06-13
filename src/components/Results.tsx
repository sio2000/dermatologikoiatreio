import { useMemo, useState } from 'react'
import { ImageLightbox } from './ImageLightbox'

/* Πριν & Μετά: στατικές εικόνες-post — κάθε εικόνα περιέχει ήδη το πριν (αριστερά) και το μετά (δεξιά) */
const RESULT_IMAGE_FILES = [
  'αποτελεσματαθεραπειων2.png',
  'αποτελεσματαθεραπειων3.png',
  'αποτελεσματαθεραπειων4.png',
  'αποτελεσματαθεραπειων11.png',
  'αποτελεσματαθεραπειων13.png',
  'αποτελεσματαθεραπειων14.png',
  'αποτελεσματαθεραπειων16.png',
  'αποτελεσματαθεραπειων17.png',
  'αποτελεσματαθεραπειων28.png',
  'αποτελεσματαθεραπειων31.png',
  'αποτελεσματαθεραπειων32.png',
]

function fileNameFromAssetPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

export function Results() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const resultImages = useMemo(() => {
    const files = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>

    return RESULT_IMAGE_FILES.map((name) => {
      const hit = Object.entries(files).find(
        ([path]) => fileNameFromAssetPath(path).toLowerCase() === name.toLowerCase()
      )
      return hit?.[1] ?? ''
    }).filter((url) => url.length > 0)
  }, [])

  return (
    <section id="results">
      <div className="results-inner">
        <div className="results-header">
          <h2 className="section-title fade-up">
            Αποτελέσματα που <em>Μιλούν</em>
          </h2>
          <div className="gold-rule fade-up" />
          <p className="fade-up results-ba-lead">{`Δείτε το Πριν & Μετά`}</p>
        </div>

        <div className="results-static-grid fade-in">
          {resultImages.map((src, i) => (
            <button
              key={src}
              type="button"
              className="results-static-item"
              onClick={() => setActiveIndex(i)}
              aria-label={`Άνοιγμα σε πλήρη οθόνη — αποτέλεσμα θεραπείας ${i + 1}`}
            >
              <img
                src={src}
                alt={`Πριν και Μετά — αποτέλεσμα θεραπείας ${i + 1}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>

        <p className="results-note">
          * Τα αποτελέσματα ενδέχεται να διαφέρουν ανά άτομο. Όλες οι φωτογραφίες είναι
          πραγματικών ασθενών με τη συγκατάθεσή τους.
        </p>
      </div>

      <ImageLightbox
        images={resultImages.map((src, i) => ({
          src,
          alt: `Πριν και Μετά — αποτέλεσμα θεραπείας ${i + 1}`,
        }))}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </section>
  )
}
