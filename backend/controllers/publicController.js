const { CLINICS } = require('../utils/validation')
const { getFreeSlotsForClinic, createBooking } = require('../services/jsonStore')
const { validateBookBody, getTreatmentLabelForKey } = require('../utils/validation')
const crypto = require('crypto')

async function getAvailability(req, res) {
  try {
    const clinic = String(req.query.clinic || '').toLowerCase()
    if (!CLINICS.has(clinic)) {
      return res.status(400).json({ error: 'Invalid or missing clinic query (athens | piraeus)' })
    }
    const slots = await getFreeSlotsForClinic(clinic)
    return res.json({ slots })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}

async function postBook(req, res) {
  try {
    console.log('[POST /api/book] incoming:', JSON.stringify(req.body))
    const body = validateBookBody(req.body || {})
    const record = {
      id: crypto.randomUUID(),
      clinic: body.clinic,
      date: body.date,
      time: body.time,
      name: body.name,
      phone: body.phone,
      email: body.email,
      treatment: body.treatment,
      treatmentLabel: getTreatmentLabelForKey(body.treatment),
      notes: body.notes,
      createdAt: new Date().toISOString(),
    }
    const saved = await createBooking(record)
    console.log('[POST /api/book] saved:', saved.id, 'treatment:', saved.treatment, 'notes:', saved.notes ? `(${saved.notes.length} chars)` : '(empty)')
    return res.status(201).json({ booking: saved })
  } catch (e) {
    const status = e.status || 500
    if (status >= 500) console.error(e)
    else console.warn('[POST /api/book] rejected:', status, e.message)
    return res.status(status).json({ error: e.message || 'Server error' })
  }
}

module.exports = { getAvailability, postBook }
