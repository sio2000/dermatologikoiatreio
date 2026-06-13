import { images } from '../constants/images'
import { THERAPY_IMAGE_BY_SLUG } from '../constants/therapies'

const rootAssetGlob = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const galleryAssetGlob = import.meta.glob('../assets/galleryfront/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function fileNameFromPath(assetPath: string) {
  const seg = assetPath.replace(/\\/g, '/').split('/')
  return seg[seg.length - 1]?.split('?')[0] ?? ''
}

function assetUrlByName(filename: string): string | undefined {
  const target = filename.trim().toLowerCase()
  const hit = Object.entries(rootAssetGlob).find(
    ([path]) => fileNameFromPath(path).toLowerCase() === target
  )
  return hit?.[1]
}

/** Όλες οι εικόνες που χρησιμοποιεί το site (τοπικές + εξωτερικές). */
export function collectSiteImageUrls(): string[] {
  const urls = new Set<string>()

  for (const url of Object.values(rootAssetGlob)) {
    if (url) urls.add(url)
  }
  for (const url of Object.values(galleryAssetGlob)) {
    if (url) urls.add(url)
  }

  urls.add(images.doctorPortrait)
  urls.add(images.philosophyBackdrop)
  urls.add(images.rhinoplastySpotlight)

  for (const pair of Object.values(images.comparison)) {
    urls.add(pair.before)
    urls.add(pair.after)
  }
  for (const url of images.gallery) {
    urls.add(url)
  }

  for (const filename of Object.values(THERAPY_IMAGE_BY_SLUG)) {
    const url = assetUrlByName(filename)
    if (url) urls.add(url)
  }

  return [...urls]
}

function preloadOne(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export type PreloadProgress = {
  loaded: number
  total: number
  percent: number
}

/**
 * Προ-φόρτωση εικόνων με περιορισμένο parallelism ώστε να μην «πνίγει» το δίκτυο.
 * Αποτυχίες δεν μπλοκάρουν την ολοκλήρωση.
 */
export async function preloadSiteImages(
  urls: string[],
  onProgress?: (progress: PreloadProgress) => void,
  concurrency = 6
): Promise<PreloadProgress> {
  const unique = [...new Set(urls.filter(Boolean))]
  const total = unique.length
  if (total === 0) {
    const empty = { loaded: 0, total: 0, percent: 100 }
    onProgress?.(empty)
    return empty
  }

  let loaded = 0
  let index = 0

  const report = () => {
    const progress = {
      loaded,
      total,
      percent: Math.min(100, Math.round((loaded / total) * 100)),
    }
    onProgress?.(progress)
    return progress
  }

  const worker = async () => {
    while (index < total) {
      const current = index
      index += 1
      await preloadOne(unique[current])
      loaded += 1
      report()
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, total) }, () => worker())
  await Promise.all(workers)
  return report()
}
