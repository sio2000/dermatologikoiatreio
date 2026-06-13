/**
 * Εικόνες που ΔΕΝ πρέπει να εμφανίζονται στο gallery section και στη σελίδα /full-gallery.
 * (Χρησιμοποιούνται αλλού: hero, πορτρέτο ιατρού, κάρτες θεραπειών κ.λπ.)
 * Η αντιστοίχιση γίνεται με το base name (όνομα αρχείου χωρίς επέκταση), ώστε να
 * καλύπτονται και οι .png και οι .jpeg εκδοχές της ίδιας εικόνας.
 */
export const GALLERY_EXCLUDED_BASENAMES = new Set<string>([
  'hero4',
  'hero45',
  'lazerhairremoval',
  'mesotherapy',
  'prp',
  'ιατρος',
  'ιατρος2',
  'ιατρος3',
  'ιατρος4',
  'ιατρος5',
  'ιατρος6',
  'ιατρος7',
  'ιατρος9',
  'ιατρος10',
  'ιατρος11',
  'ιατρος12',
  'ιατρος13',
  'ιατρος14',
])

/** Επιστρέφει το base name (χωρίς φάκελο/επέκταση/query), σε πεζά. */
export function assetBaseName(assetPath: string): string {
  const file = assetPath.replace(/\\/g, '/').split('/').pop() ?? ''
  const noQuery = file.split('?')[0]
  const dot = noQuery.lastIndexOf('.')
  return (dot >= 0 ? noQuery.slice(0, dot) : noQuery).toLowerCase()
}
