const fs = require('fs/promises')
const path = require('path')
const { withStoreLock } = require('../utils/storeLock')
const { DATA_DIR, AVAILABILITY_FILE, BOOKINGS_FILE } = require('../utils/paths')

const BLOB_KEY = 'booking-state-v1'

/** Seed από τα αρχεία δίσκου — όχι `require("./x.json")` (σπάει με Netlify/esbuild bundles). */
async function cloneSeedFromDisk() {
  const availability = await readJsonArray(AVAILABILITY_FILE)
  const bookings = await readJsonArray(BOOKINGS_FILE)
  return { availability, bookings }
}

/**
 * Στο Netlify Functions (AWS Lambda η βάση) το `/var/task` είναι read-only — οποιαδήποτε γραφή σε
 * `backend/data/` δίνει EROFS. Όλες οι εγγραφές πρέπει μέσω Netlify Blobs.
 *
 * Ο έλεγχος `NETLIFY` είναι αναξιόπιστος (λεκτάν μη ορισμένος ή esbuild quirks). Οι τιμές
 * `AWS_LAMBDA_FUNCTION_NAME` / `AWS_EXECUTION_ENV` ορίζονται στην εκτέλεση κάθε φορά στην Lambda.
 */
function runningOnAwsLambdaRuntime() {
  const fn =
    typeof process.env.AWS_LAMBDA_FUNCTION_NAME === 'string' &&
    process.env.AWS_LAMBDA_FUNCTION_NAME.trim() !== ''
  const env =
    typeof process.env.AWS_EXECUTION_ENV === 'string' &&
    process.env.AWS_EXECUTION_ENV.includes('Lambda')
  return fn || env
}

function useBlobStore() {
  const lambda = runningOnAwsLambdaRuntime()

  const raw = process.env.USE_BLOB_STORAGE
  if (typeof raw === 'string' && raw.trim() !== '') {
    const hint = raw.trim().toLowerCase()
    if (['1', 'true', 'yes', 'on'].includes(hint)) return true
    if (['0', 'false', 'no', 'off'].includes(hint)) {
      if (lambda) return true /* RO FS σε Lambda — να αγνοείται ψευδο-απενεργοποίηση Blobs */
      return false
    }
  }

  if (lambda) return true

  if (process.env.NETLIFY === 'true' || process.env.NETLIFY === '1') return true

  return false
}

function getBlobStore() {
  const { getStore } = require('@netlify/blobs')
  return getStore({ name: 'advanced-derma-booking' })
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function readJsonArray(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch (e) {
    if (e && e.code === 'ENOENT') return []
    throw e
  }
}

async function atomicWriteJson(filePath, data) {
  await ensureDataDir()
  const serialized = JSON.stringify(data, null, 2)
  const dir = path.dirname(filePath)
  const base = path.basename(filePath)
  const tmp = path.join(dir, `.${base}.tmp.${process.pid}.${Date.now()}`)
  await fs.writeFile(tmp, serialized, 'utf8')
  await fs.rename(tmp, filePath)
}

function slotKey(s) {
  return `${s.clinic}|${s.date}|${s.time}`
}

async function readFullState() {
  if (useBlobStore()) {
    const store = getBlobStore()
    const data = await store.get(BLOB_KEY, { type: 'json' })
    if (data != null && Array.isArray(data.availability) && Array.isArray(data.bookings)) {
      return { availability: data.availability, bookings: data.bookings }
    }
    const seed = await cloneSeedFromDisk()
    await store.setJSON(BLOB_KEY, seed)
    return seed
  }

  const availability = await readJsonArray(AVAILABILITY_FILE)
  const bookings = await readJsonArray(BOOKINGS_FILE)
  return { availability, bookings }
}

async function writeFullState(state) {
  if (useBlobStore()) {
    const store = getBlobStore()
    await store.setJSON(BLOB_KEY, {
      availability: state.availability,
      bookings: state.bookings,
    })
    return
  }

  await atomicWriteJson(AVAILABILITY_FILE, state.availability)
  await atomicWriteJson(BOOKINGS_FILE, state.bookings)
}

function readAvailability() {
  return readFullState().then((s) => s.availability)
}

function readBookings() {
  return readFullState().then((s) => s.bookings)
}

async function writeAvailability(slots) {
  return withStoreLock(async () => {
    const state = await readFullState()
    state.availability = slots
    await writeFullState(state)
  })
}

async function writeBookings(bookings) {
  return withStoreLock(async () => {
    const state = await readFullState()
    state.bookings = bookings
    await writeFullState(state)
  })
}

/** Slots that exist in availability and are not yet booked */
async function getFreeSlotsForClinic(clinic) {
  return withStoreLock(async () => {
    const { availability, bookings } = await readFullState()
    const booked = new Set(bookings.map((b) => slotKey(b)))
    return availability.filter((s) => s.clinic === clinic && !booked.has(slotKey(s)))
  })
}

async function addAvailabilitySlot(slot) {
  return withStoreLock(async () => {
    const state = await readFullState()
    if (state.availability.some((s) => slotKey(s) === slotKey(slot))) {
      const err = new Error('Slot already exists')
      err.status = 409
      throw err
    }
    state.availability.push(slot)
    await writeFullState(state)
    return slot
  })
}

async function removeAvailabilitySlot(slot) {
  return withStoreLock(async () => {
    const state = await readFullState()
    const next = state.availability.filter((s) => slotKey(s) !== slotKey(slot))
    if (next.length === state.availability.length) {
      const err = new Error('Slot not found')
      err.status = 404
      throw err
    }
    state.availability = next
    await writeFullState(state)
    return true
  })
}

async function createBooking(record) {
  return withStoreLock(async () => {
    const state = await readFullState()
    const existsInAvail = state.availability.some((s) => slotKey(s) === slotKey(record))
    if (!existsInAvail) {
      const err = new Error('Slot is not available')
      err.status = 400
      throw err
    }
    if (state.bookings.some((b) => slotKey(b) === slotKey(record))) {
      const err = new Error('Slot already booked')
      err.status = 409
      throw err
    }
    const stored = { ...record }
    state.bookings.push(stored)
    await writeFullState(state)
    return stored
  })
}

module.exports = {
  readAvailability,
  readBookings,
  writeAvailability,
  writeBookings,
  getFreeSlotsForClinic,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  createBooking,
  slotKey,
  AVAILABILITY_FILE,
  BOOKINGS_FILE,
}
