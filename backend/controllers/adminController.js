const { login } = require('../services/adminAuth')
const { assertSlotShape, getTreatmentLabelForKey } = require('../utils/validation')
const {
  readAvailability,
  readBookings,
  addAvailabilitySlot,
  addAvailabilitySlotsBatch,
  removeAvailabilitySlot,
} = require('../services/jsonStore')
const { withStoreLock } = require('../utils/storeLock')

async function postLogin(req, res) {
  try {
    const password = req.body?.password
    if (typeof password !== 'string') {
      return res.status(400).json({ error: 'Password required' })
    }
    const token = login(password)
    if (!token) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    return res.json({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}

async function getAdminAvailability(req, res) {
  try {
    const slots = await withStoreLock(() => readAvailability())
    return res.json({ slots })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}

async function postAdminAvailability(req, res) {
  try {
    const slot = assertSlotShape(req.body || {})
    await addAvailabilitySlot(slot)
    return res.status(201).json({ slot })
  } catch (e) {
    const status = e.status || 500
    if (status >= 500) console.error(e)
    return res.status(status).json({ error: e.message || 'Server error' })
  }
}

async function postAdminAvailabilityBatch(req, res) {
  try {
    const raw = req.body?.slots
    if (!Array.isArray(raw) || raw.length === 0) {
      return res.status(400).json({ error: 'Χρειάζεται μη κενός πίνακας slots' })
    }
    const slots = []
    for (const item of raw) {
      slots.push(assertSlotShape(item || {}))
    }
    const { added, skipped } = await addAvailabilitySlotsBatch(slots)
    return res.status(201).json({ added, skipped })
  } catch (e) {
    const status = e.status || 500
    if (status >= 500) console.error(e)
    return res.status(status).json({ error: e.message || 'Server error' })
  }
}

async function deleteAdminAvailability(req, res) {
  try {
    const slot = assertSlotShape(req.body || {})
    await removeAvailabilitySlot(slot)
    return res.json({ ok: true })
  } catch (e) {
    const status = e.status || 500
    if (status >= 500) console.error(e)
    return res.status(status).json({ error: e.message || 'Server error' })
  }
}

async function getAdminBookings(req, res) {
  try {
    const bookings = await withStoreLock(() => readBookings())
    const sorted = [...bookings].sort((a, b) => {
      const da = `${a.date}T${a.time}`
      const db = `${b.date}T${b.time}`
      return db.localeCompare(da)
    })
    const enriched = sorted.map((b) => {
      const t = typeof b.treatment === 'string' ? b.treatment.trim().toLowerCase() : ''
      const labelFromKey = t ? getTreatmentLabelForKey(t) : ''
      const treatmentLabel =
        (typeof b.treatmentLabel === 'string' && b.treatmentLabel.trim()) || labelFromKey || ''
      const notes = typeof b.notes === 'string' ? b.notes : ''
      return { ...b, treatmentLabel, notes }
    })
    return res.json({ bookings: enriched })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  postLogin,
  getAdminAvailability,
  postAdminAvailability,
  postAdminAvailabilityBatch,
  deleteAdminAvailability,
  getAdminBookings,
}
