const fs = require('fs/promises')
const path = require('path')
const { withStoreLock } = require('../utils/storeLock')
const { DATA_DIR, AVAILABILITY_FILE, BOOKINGS_FILE } = require('../utils/paths')

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

function readAvailability() {
  return readJsonArray(AVAILABILITY_FILE)
}

function readBookings() {
  return readJsonArray(BOOKINGS_FILE)
}

async function writeAvailability(slots) {
  await atomicWriteJson(AVAILABILITY_FILE, slots)
}

async function writeBookings(bookings) {
  await atomicWriteJson(BOOKINGS_FILE, bookings)
}

/** Slots that exist in availability and are not yet booked */
async function getFreeSlotsForClinic(clinic) {
  return withStoreLock(async () => {
    const avail = await readAvailability()
    const bookings = await readBookings()
    const booked = new Set(bookings.map((b) => slotKey(b)))
    return avail.filter((s) => s.clinic === clinic && !booked.has(slotKey(s)))
  })
}

async function addAvailabilitySlot(slot) {
  return withStoreLock(async () => {
    const list = await readAvailability()
    if (list.some((s) => slotKey(s) === slotKey(slot))) {
      const err = new Error('Slot already exists')
      err.status = 409
      throw err
    }
    list.push(slot)
    await writeAvailability(list)
    return slot
  })
}

async function removeAvailabilitySlot(slot) {
  return withStoreLock(async () => {
    const list = await readAvailability()
    const next = list.filter((s) => slotKey(s) !== slotKey(slot))
    if (next.length === list.length) {
      const err = new Error('Slot not found')
      err.status = 404
      throw err
    }
    await writeAvailability(next)
    return true
  })
}

async function createBooking(record) {
  return withStoreLock(async () => {
    const avail = await readAvailability()
    const bookings = await readBookings()
    const existsInAvail = avail.some((s) => slotKey(s) === slotKey(record))
    if (!existsInAvail) {
      const err = new Error('Slot is not available')
      err.status = 400
      throw err
    }
    if (bookings.some((b) => slotKey(b) === slotKey(record))) {
      const err = new Error('Slot already booked')
      err.status = 409
      throw err
    }
    const stored = { ...record }
    bookings.push(stored)
    await writeBookings(bookings)
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
