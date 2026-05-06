const CLINICS = new Set(['athens', 'piraeus'])

/** Keys + ελληνικές ετικέτες — συγχρονισμένα με το Booking UI */
const TREATMENT_LABELS = {
  aging: 'Αντιγήρανση & Botox',
  fillers: 'Fillers υαλουρονικού',
  biofiller: 'Biofiller',
  laser: 'Laser Hair Removal — Αποτρίχωση & laser δέρματος',
  acne: 'Θεραπεία ακμής',
  prp: 'PRP / Plasma',
  meso: 'Μεσοθεραπεία',
  derm: 'Κλινική δερματολογία',
  hair: 'Τριχόπτωση & αλωπεκία',
  rhinoplasty: 'Ρινοπλαστική',
}

const TREATMENT_KEYS = new Set(Object.keys(TREATMENT_LABELS))

/** Παλαιές φόρμες / αποθηκευμένα labels → κλειδί */
const TREATMENT_LEGACY_ALIASES = {
  'laser θεραπεία': 'laser',
}

function getTreatmentLabelForKey(key) {
  if (typeof key !== 'string') return ''
  return TREATMENT_LABELS[key.trim().toLowerCase()] || ''
}

function isValidDateStr(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

function isValidTimeStr(s) {
  if (typeof s !== 'string' || !/^\d{2}:\d{2}$/.test(s)) return false
  const [h, min] = s.split(':').map(Number)
  return h >= 0 && h <= 23 && min >= 0 && min <= 59
}

function normalizeSlot(clinic, date, time) {
  return { clinic: String(clinic).trim().toLowerCase(), date: String(date).trim(), time: String(time).trim() }
}

function assertSlotShape(body) {
  const clinic = body?.clinic
  const date = body?.date
  const time = body?.time
  if (!CLINICS.has(clinic)) {
    const err = new Error('Invalid or missing clinic (use athens or piraeus)')
    err.status = 400
    throw err
  }
  if (!isValidDateStr(date) || !isValidTimeStr(time)) {
    const err = new Error('Invalid date or time format (date: YYYY-MM-DD, time: HH:mm)')
    err.status = 400
    throw err
  }
  return normalizeSlot(clinic, date, time)
}

function normalizeTreatmentString(raw) {
  if (raw == null) return ''
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw).trim()
  if (typeof raw !== 'string') return ''
  const t = typeof raw.normalize === 'function' ? raw.normalize('NFC') : raw
  return t.trim()
}

function foldLabel(s) {
  const t = typeof s.normalize === 'function' ? s.normalize('NFC') : s
  return t.trim().toLowerCase().replace(/\s+/g, ' ')
}

function validateTreatment(body) {
  const trimmed = normalizeTreatmentString(body?.treatment)
  if (!trimmed) {
    const err = new Error('Treatment is required (invalid or missing value)')
    err.status = 400
    throw err
  }
  const lower = trimmed.toLowerCase()
  if (TREATMENT_LEGACY_ALIASES[lower]) return TREATMENT_LEGACY_ALIASES[lower]
  if (TREATMENT_KEYS.has(lower)) return lower
  // Match full Greek labels (case/whitespace) when client sends text instead of key
  const foldedIn = foldLabel(trimmed)
  const revFold = Object.entries(TREATMENT_LABELS).find(([, lab]) => {
    if (typeof lab !== 'string') return false
    return foldLabel(lab) === foldedIn || lab.trim() === trimmed
  })
  if (revFold) return revFold[0]
  const err = new Error('Treatment is required (invalid or missing value)')
  err.status = 400
  throw err
}

function validateNotes(body) {
  const raw = body?.notes
  if (raw == null || raw === '') return ''
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return String(raw).trim().slice(0, 12000)
  }
  if (typeof raw !== 'string') {
    const err = new Error('Invalid notes field')
    err.status = 400
    throw err
  }
  const trimmed = raw.trim()
  if (trimmed.length > 12000) {
    const err = new Error('Notes exceed maximum length')
    err.status = 400
    throw err
  }
  return trimmed
}

function validateBookBody(body) {
  const slot = assertSlotShape(body || {})
  const treatment = validateTreatment(body || {})
  const notes = validateNotes(body || {})
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (name.length < 2) {
    const err = new Error('Name is required (min 2 characters)')
    err.status = 400
    throw err
  }
  if (phone.length < 6) {
    const err = new Error('Phone is required (min 6 characters)')
    err.status = 400
    throw err
  }
  if (email.length > 0) {
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!basic.test(email)) {
      const err = new Error('Invalid email')
      err.status = 400
      throw err
    }
  }
  return { ...slot, name, phone, email, treatment, notes }
}

module.exports = {
  CLINICS,
  TREATMENT_KEYS,
  TREATMENT_LABELS,
  getTreatmentLabelForKey,
  isValidDateStr,
  isValidTimeStr,
  assertSlotShape,
  validateTreatment,
  validateNotes,
  validateBookBody,
}
