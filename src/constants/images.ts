/** Royalty-free Unsplash assets — dermatology / clinic / skincare context */

const u = (id: string, w = 1400, q = 82) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`

const assetGlob = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function fileNameFromPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

/** Resolve bundled URL for an exact filename in `src/assets` */
function assetUrlByName(filename: string, fallback?: string): string {
  const target = filename.trim().toLowerCase()
  const hit = Object.entries(assetGlob).find(
    ([path]) => fileNameFromPath(path).toLowerCase() === target
  )
  return (hit?.[1] as string) ?? fallback ?? ''
}

export const images = {
  doctorPortrait: u('photo-1559839734-2b71ea197ec2', 1000),

  philosophyBackdrop: u('photo-1556228578-8d85b1a4d571', 1600),

  /** Section ρινοπλαστικής (Treatments → Results) */
  rhinoplastySpotlight: assetUrlByName(
    'αποτελεσματαθεραπειων3.png',
    u('photo-1616394584738-fc6e612e71b9', 1200)
  ),

  comparison: {
    rhinoplasty: {
      before: assetUrlByName('αποτελεσματαθεραπειων5.png', u('photo-1616394584738-fc6e612e71b9', 1200)),
      after: assetUrlByName('αποτελεσματαθεραπειων6.png', u('photo-1519415943484-9fa1873496d4', 1200)),
    },
    acne: {
      before: assetUrlByName('αποτελεσματαθεραπειων26.png', u('photo-1522335789203-aabd1fc54bc9', 1200)),
      after: assetUrlByName('αποτελεσματαθεραπειων27.png', u('photo-1612817288484-6f916006741a', 1200)),
    },
    brachioplasty: {
      before: assetUrlByName('μεση.png', u('photo-1515377905703-c4788e51af15', 1200)),
      after: assetUrlByName('μεση2.png', u('photo-1596755094514-f87e34085b87', 1200)),
    },
    hairLoss: {
      before: assetUrlByName('αποτελεσματαθεραπειων18.png', u('photo-1492106087820-71f1a00d2b11', 1200)),
      after: assetUrlByName('αποτελεσματαθεραπειων19.png', u('photo-1571875257727-256c39da42af', 1200)),
    },
  },

  gallery: [
    u('photo-1570172619644-dfd03ed5d881', 800),
    u('photo-1519494026892-80bbd2d6fd0d', 800),
    u('photo-1612349317150-e413f6a5b16d', 800),
    u('photo-1584464491033-f845a224b847', 800),
    u('photo-1576091160399-112ba8d25d1d', 800),
    u('photo-1540555700478-4be289fbecef', 800),
  ],

  maps: {
    athens: `https://www.google.com/maps?q=${encodeURIComponent(
      'Στρατάρχου Παπάγου Αλεξάνδρου 50, Ζωγράφος 15771, Αττική, Ελλάδα'
    )}&output=embed`,
    piraeus: `https://www.google.com/maps?q=${encodeURIComponent(
      'Γρηγορίου Λαμπράκη 109, Πειραιάς 185 34, Ελλάδα'
    )}&output=embed`,
  },
} as const

export type ComparisonTreatment = keyof typeof images.comparison
