import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { apiUrl } from '../lib/api'

const GREEK_MONTHS = [
  'Ιανουάριος',
  'Φεβρουάριος',
  'Μάρτιος',
  'Απρίλιος',
  'Μάιος',
  'Ιούνιος',
  'Ιούλιος',
  'Αύγουστος',
  'Σεπτέμβριος',
  'Οκτώβριος',
  'Νοέμβριος',
  'Δεκέμβριος',
]

const CAL_DAY_NAMES = ['Δε', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σαβ', 'Κυρ']

const TREATMENTS = [
  ['aging', 'Αντιγήρανση & Botox'],
  ['fillers', 'Fillers υαλουρονικού'],
  ['biofiller', 'Biofiller'],
  ['laser', 'Laser Hair Removal — Αποτρίχωση & laser δέρματος'],
  ['acne', 'Θεραπεία ακμής'],
  ['prp', 'PRP / Plasma'],
  ['meso', 'Μεσοθεραπεία'],
  ['derm', 'Κλινική δερματολογία'],
  ['hair', 'Τριχόπτωση & αλωπεκία'],
  ['rhinoplasty', 'Ρινοπλαστική'],
] as const

const BOOKING_WIZARD_STORAGE_KEY = 'advanced_derma_booking_wizard_v1'

const LOCATIONS = [
  {
    id: 'athens' as const,
    title: 'Αθήνα — Advanced Derma Athens',
    lines:
      'Στρατάρχου Παπάγου Αλεξάνδρου 50\n2ος όροφος · Ζωγράφος\n15771 · ΑΤΤΙΚΗΣ',
  },
  {
    id: 'piraeus' as const,
    title: 'Πειραιάς — Advanced Derma Piraeus',
    lines: 'Γρ. Λαμπράκη 109\n185 34 · Πειραιάς',
  },
]

type ApiSlot = { clinic: string; date: string; time: string }

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function isTreatmentKey(value: unknown): value is (typeof TREATMENTS)[number][0] {
  return typeof value === 'string' && TREATMENTS.some(([k]) => k === value)
}

function isClinicId(value: unknown): value is (typeof LOCATIONS)[number]['id'] {
  return value === 'athens' || value === 'piraeus'
}

/** `#booking?treatment=biofiller` ή `#/booking?treatment=...` */
function treatmentKeyFromBookingHash(): (typeof TREATMENTS)[number][0] | null {
  const raw = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  if (!raw) return null
  const qsIdx = raw.indexOf('?')
  const base = (qsIdx === -1 ? raw : raw.slice(0, qsIdx)).replace(/^\//, '').replace(/\/$/, '')
  if (base !== 'booking') return null
  const qs = qsIdx === -1 ? '' : raw.slice(qsIdx + 1)
  const t = new URLSearchParams(qs).get('treatment')
  return isTreatmentKey(t) ? t : null
}

function readDraftTreatmentFromStorage(): (typeof TREATMENTS)[number][0] | '' {
  try {
    const raw = sessionStorage.getItem(BOOKING_WIZARD_STORAGE_KEY)
    if (!raw) return ''
    const d = JSON.parse(raw) as Record<string, unknown>
    if (d.version !== 1 || !isTreatmentKey(d.treatment)) return ''
    return d.treatment
  } catch {
    return ''
  }
}

export function Booking() {
  const [wizardDraftReady, setWizardDraftReady] = useState(false)
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [treatment, setTreatment] = useState<(typeof TREATMENTS)[number][0] | ''>('')
  const [loc, setLoc] = useState<(typeof LOCATIONS)[number]['id'] | ''>('')
  const [slot, setSlot] = useState('')
  const [calYear, setCalYear] = useState(() => new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth())
  const [pickedDay, setPickedDay] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [apiSlots, setApiSlots] = useState<ApiSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const treatmentRef = useRef(treatment)
  const notesRef = useRef(notes)
  useEffect(() => {
    treatmentRef.current = treatment
  }, [treatment])
  useEffect(() => {
    notesRef.current = notes
  }, [notes])

  /** Επαναφορά wizard από sessionStorage + προεπιλογή από `#booking?treatment=…` — μετά ένα state flag ώστε το save να μη «σβήσει» το draft πριν commit τα setState. */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_WIZARD_STORAGE_KEY)
      let hasTreatment = false
      if (raw) {
        const d = JSON.parse(raw) as Record<string, unknown>
        if (d.version === 1) {
          const draftTreatment = d.treatment
          if (isTreatmentKey(draftTreatment)) {
            hasTreatment = true
            setTreatment(draftTreatment)
          }
          if (isClinicId(d.loc)) setLoc(d.loc)
          if (typeof d.slot === 'string' && /^\d{2}:\d{2}$/.test(d.slot)) setSlot(d.slot)
          if (typeof d.pickedDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.pickedDay)) setPickedDay(d.pickedDay)
          if (typeof d.calYear === 'number' && d.calYear >= 2020 && d.calYear <= 2100) setCalYear(d.calYear)
          if (typeof d.calMonth === 'number' && d.calMonth >= 0 && d.calMonth <= 11) setCalMonth(d.calMonth)
          if (typeof d.step === 'number' && d.step >= 1 && d.step <= 4) {
            setStep(hasTreatment ? d.step : 1)
          }
          if (typeof d.fullName === 'string') setFullName(d.fullName)
          if (typeof d.phone === 'string') setPhone(d.phone)
          if (typeof d.email === 'string') setEmail(d.email)
          if (typeof d.notes === 'string') setNotes(d.notes)
        }
      }
      const hashKey = treatmentKeyFromBookingHash()
      if (hashKey) setTreatment(hashKey)
    } catch {
      /* ignore corrupt draft */
    }
    setWizardDraftReady(true)
  }, [])

  useEffect(() => {
    if (!wizardDraftReady) return
    const onHash = () => {
      const k = treatmentKeyFromBookingHash()
      if (k) setTreatment(k)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [wizardDraftReady])

  /** Defensive: αν για οποιονδήποτε λόγο φτάσει σε step 4 χωρίς θεραπεία, γύρνα στο 1. */
  useEffect(() => {
    if (!wizardDraftReady || done) return
    if (step === 4 && !treatment && !readDraftTreatmentFromStorage()) {
      setStep(1)
      setSubmitError('Παρακαλώ επιλέξτε πρώτα θεραπεία.')
    }
  }, [wizardDraftReady, done, step, treatment])

  useEffect(() => {
    if (!wizardDraftReady || done) return
    try {
      sessionStorage.setItem(
        BOOKING_WIZARD_STORAGE_KEY,
        JSON.stringify({
          version: 1,
          step,
          treatment,
          loc,
          slot,
          pickedDay,
          calYear,
          calMonth,
          fullName,
          phone,
          email,
          notes,
        })
      )
    } catch {
      /* private mode / quota */
    }
  }, [wizardDraftReady, done, step, treatment, loc, slot, pickedDay, calYear, calMonth, fullName, phone, email, notes])

  useEffect(() => {
    if (step !== 3 || !loc) {
      setApiSlots([])
      setSlotsError('')
      return
    }
    let cancelled = false
    setSlotsLoading(true)
    setSlotsError('')
    fetch(apiUrl(`/api/availability?clinic=${encodeURIComponent(loc)}`))
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Δεν ήταν δυνατή η φόρτωση των διαθέσιμων ραντεβού.')
        return data as { slots?: ApiSlot[] }
      })
      .then((data) => {
        if (cancelled) return
        setApiSlots(Array.isArray(data.slots) ? data.slots : [])
      })
      .catch((e) => {
        if (cancelled) return
        setApiSlots([])
        setSlotsError(e instanceof Error ? e.message : 'Σφάλμα δικτύου')
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [step, loc])

  const timesForPickedDay = useMemo(() => {
    if (!pickedDay) return []
    return apiSlots
      .filter((s) => s.date === pickedDay)
      .map((s) => s.time)
      .sort()
  }, [apiSlots, pickedDay])

  const calCells = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1)
    let startDow = firstDay.getDay()
    startDow = (startDow + 6) % 7
    const empty = Array.from({ length: startDow }, () => null as number | null)
    const dim = new Date(calYear, calMonth + 1, 0).getDate()
    const today = new Date()
    const days: { d: number; past: boolean; today: boolean }[] = []
    for (let d = 1; d <= dim; d++) {
      const thisDate = new Date(calYear, calMonth, d)
      const past =
        thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const isToday =
        d === today.getDate() &&
        calMonth === today.getMonth() &&
        calYear === today.getFullYear()
      days.push({ d, past, today: isToday })
    }
    return { emptyLen: empty.length, days }
  }, [calYear, calMonth])

  function changeMonth(dir: number) {
    let m = calMonth + dir
    let y = calYear
    if (m > 11) {
      m = 0
      y++
    }
    if (m < 0) {
      m = 11
      y--
    }
    setCalMonth(m)
    setCalYear(y)
  }

  function go(stepNum: number) {
    setStep(stepNum)
  }

  function dayHasAvailability(iso: string) {
    return apiSlots.some((s) => s.date === iso)
  }

  /** Ίδια λογική για submit & ενεργοποίηση κουμπιού — συμπεριλαμβάνει draft στο sessionStorage. */
  function resolvedTreatmentKey(): string {
    return (
      treatment ||
      treatmentRef.current ||
      readDraftTreatmentFromStorage() ||
      ''
    )
      .toString()
      .trim()
  }

  async function submitBooking() {
    const treatmentKey = resolvedTreatmentKey()
    const notesText = (notes.trim() || notesRef.current.trim() || '').toString()
    if (!treatmentKey) {
      setSubmitError(
        'Δεν έχει καταγραφεί θεραπεία. Επιστρέψτε στο βήμα «Θεραπεία» και επιλέξτε μία επιλογή από τη λίστα.'
      )
      setStep(1)
      return
    }
    if (!loc || !pickedDay || !slot) {
      setSubmitError('Συμπληρώστε ιατρείο, ημερομηνία και ώρα πριν την επιβεβαίωση.')
      setStep(!loc ? 2 : 3)
      return
    }
    setSubmitError('')
    setSubmitting(true)
    try {
      const res = await fetch(apiUrl('/api/book'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          clinic: loc,
          date: pickedDay,
          time: slot,
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          treatment: treatmentKey,
          notes: notesText,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; booking?: { treatment?: string } }
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Η κράτηση απέτυχε.')
      }
      try {
        sessionStorage.removeItem(BOOKING_WIZARD_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      setDone(true)
      requestAnimationFrame(() => {
        const el = document.getElementById('booking-success')
        if (el) gsap.from(el, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' })
      })
    } catch (e) {
      const raw = e instanceof Error ? e.message : 'Σφάλμα'
      const lowered = raw.toLowerCase()
      if (lowered.includes('treatment is required')) {
        setSubmitError(
          'Η θεραπεία δεν έγινε αποδεκτή από τον server ή λείπει. Επιστρέψτε στο βήμα «Θεραπεία», επιλέξτε ξανά και δοκιμάστε (αν τρέχετε το API τοπικά, επανεκκινήστε το backend μετά τις αλλαγές κώδικα).'
        )
        setStep(1)
      } else {
        setSubmitError(raw)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const canAdvance1 = !!treatment
  const canAdvance2 = !!loc
  const slotOk = !!pickedDay && !!slot && timesForPickedDay.includes(slot)
  const canAdvance3 = slotOk && !slotsLoading && !slotsError

  const treatmentReady = resolvedTreatmentKey().length > 0
  const canSubmit =
    treatmentReady && fullName.trim().length > 2 && phone.trim().length >= 6 && !submitting

  return (
    <div className="booking-inner">
      <div className="booking-steps" aria-hidden={done}>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`booking-step${step === n ? ' active' : ''}${
              n < step || done ? ' completed' : ''
            }`}
            data-step={n}
          >
            <div className="step-circle">{n}</div>
            <span className="step-label">
              {n === 1 && 'Θεραπεία'}
              {n === 2 && 'Ιατρείο'}
              {n === 3 && 'Ημερομηνία'}
              {n === 4 && 'Στοιχεία'}
            </span>
          </div>
        ))}
      </div>

      {!done ? (
        <div className="booking-form">
          {step === 1 && (
            <div className="booking-panel active" id="panel-1">
              <h3 className="panel-title">Επιλέξτε θεραπεία</h3>
              <div className="treatment-options" role="group" aria-label="Θεραπεία">
                {TREATMENTS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`treatment-opt${treatment === key ? ' selected' : ''}`}
                    onClick={() => setTreatment(key)}
                  >
                    <span className="opt-indicator" aria-hidden />
                    <span className="opt-label">{label}</span>
                  </button>
                ))}
              </div>
              <div className="booking-nav">
                <span aria-hidden />
                <button type="button" className="btn-primary" disabled={!canAdvance1} onClick={() => go(2)}>
                  <span>Επόμενο</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-panel active" id="panel-2">
              <h3 className="panel-title">Επιλέξτε ιατρείο</h3>
              <div className="location-options" role="group" aria-label="Τοποθεσία">
                {LOCATIONS.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    className={`location-card${loc === place.id ? ' selected' : ''}`}
                    onClick={() => {
                      setLoc(place.id)
                      setPickedDay(null)
                      setSlot('')
                    }}
                  >
                    <span className="opt-indicator" aria-hidden />
                    <div className="location-card-body">
                      <div className="location-name">{place.title}</div>
                      <div className="location-addr" style={{ whiteSpace: 'pre-line' }}>
                        {place.lines}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="booking-nav">
                <button type="button" className="btn-back" onClick={() => go(1)}>
                  Προηγούμενο
                </button>
                <button type="button" className="btn-primary" disabled={!canAdvance2} onClick={() => go(3)}>
                  <span>Επόμενο</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-panel active" id="panel-3">
              <h3 className="panel-title">Ημερομηνία & ώρα</h3>
              {slotsLoading && <p className="booking-api-hint">Φόρτωση διαθέσιμων ραντεβού…</p>}
              {slotsError && <p className="booking-api-err">{slotsError}</p>}
              {!slotsLoading && !slotsError && apiSlots.length === 0 && (
                <p className="booking-api-hint">Δεν υπάρχουν διαθέσιμα ραντεβού για αυτό το ιατρείο αυτή τη στιγμή.</p>
              )}
              <div className="calendar-header">
                <div className="cal-month">
                  {GREEK_MONTHS[calMonth]} {calYear}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="cal-nav"
                    aria-label="Προηγούμενος μήνας"
                    onClick={() => changeMonth(-1)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="cal-nav"
                    aria-label="Επόμενος μήνας"
                    onClick={() => changeMonth(1)}
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="cal-grid">
                {CAL_DAY_NAMES.map((dn) => (
                  <div key={dn} className="cal-day-name">
                    {dn}
                  </div>
                ))}
                {Array.from({ length: calCells.emptyLen }, (_, i) => (
                  <div key={`e-${i}`} className="cal-day empty" />
                ))}
                {calCells.days.map(({ d, past, today }) => {
                  const iso = `${calYear}-${pad2(calMonth + 1)}-${pad2(d)}`
                  const selected = pickedDay === iso
                  const hasAvail = !past && dayHasAvailability(iso)
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={`cal-day${past ? ' past' : ''}${today ? ' today' : ''}${
                        selected ? ' selected' : ''
                      }${hasAvail ? ' has-avail' : ''}`}
                      disabled={past || !hasAvail || slotsLoading || !!slotsError}
                      onClick={() => {
                        setPickedDay(iso)
                        setSlot('')
                      }}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>

              <h4 className="form-label" style={{ marginBottom: 12 }}>
                Διαθέσιμες ώρες
              </h4>
              <div className="time-slots" role="group" aria-label="Ώρα">
                {timesForPickedDay.length === 0 && pickedDay && !slotsLoading && !slotsError ? (
                  <p className="booking-api-hint">Δεν υπάρχουν ώρες για την επιλεγμένη ημέρα.</p>
                ) : (
                  timesForPickedDay.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`time-slot${slot === t ? ' selected' : ''}`}
                      onClick={() => setSlot(t)}
                    >
                      {t}
                    </button>
                  ))
                )}
              </div>

              <div className="booking-nav">
                <button type="button" className="btn-back" onClick={() => go(2)}>
                  Προηγούμενο
                </button>
                <button type="button" className="btn-primary" disabled={!canAdvance3} onClick={() => go(4)}>
                  <span>Επόμενο</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="booking-panel active" id="panel-4">
              <h3 className="panel-title">Τα στοιχεία σας</h3>
              {(() => {
                const tk = resolvedTreatmentKey()
                const tLabel = TREATMENTS.find(([k]) => k === tk)?.[1] ?? ''
                const cLabel = LOCATIONS.find((p) => p.id === loc)?.title ?? ''
                const dLabel = pickedDay
                  ? `${pickedDay.split('-').reverse().join('/')}${slot ? ` · ${slot}` : ''}`
                  : ''
                return (
                  <div className="booking-summary" aria-label="Σύνοψη επιλογών">
                    <div className="booking-summary-row">
                      <span className="booking-summary-key">Θεραπεία</span>
                      <span className="booking-summary-val">
                        {tLabel || <em style={{ color: 'var(--err, #b04a4a)' }}>— δεν έχει επιλεγεί —</em>}
                      </span>
                      <button
                        type="button"
                        className="booking-summary-edit"
                        onClick={() => go(1)}
                        aria-label="Αλλαγή θεραπείας"
                      >
                        αλλαγή
                      </button>
                    </div>
                    <div className="booking-summary-row">
                      <span className="booking-summary-key">Ιατρείο</span>
                      <span className="booking-summary-val">{cLabel || '—'}</span>
                      <button
                        type="button"
                        className="booking-summary-edit"
                        onClick={() => go(2)}
                        aria-label="Αλλαγή ιατρείου"
                      >
                        αλλαγή
                      </button>
                    </div>
                    <div className="booking-summary-row">
                      <span className="booking-summary-key">Ημερομηνία</span>
                      <span className="booking-summary-val">{dLabel || '—'}</span>
                      <button
                        type="button"
                        className="booking-summary-edit"
                        onClick={() => go(3)}
                        aria-label="Αλλαγή ημερομηνίας/ώρας"
                      >
                        αλλαγή
                      </button>
                    </div>
                  </div>
                )
              })()}
              <div className="form-fields">
                <div className="form-group">
                  <label className="form-label" htmlFor="bk-name">
                    Ονοματεπώνυμο
                  </label>
                  <input
                    id="bk-name"
                    className="form-input"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="π.χ. Μαρία Παπαδοπούλου"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bk-phone">
                    Τηλέφωνο
                  </label>
                  <input
                    id="bk-phone"
                    className="form-input"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+30"
                  />
                </div>
                <div className="form-group full">
                  <label className="form-label" htmlFor="bk-email">
                    Email{' '}
                    <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>(προαιρετικό)</span>
                  </label>
                  <input
                    id="bk-email"
                    type="email"
                    className="form-input"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group full">
                  <label className="form-label" htmlFor="bk-notes">
                    Σημειώσεις
                  </label>
                  <textarea
                    id="bk-notes"
                    className="form-input"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Προαιρετικό μήνυμα…"
                  />
                </div>
              </div>
              {submitError && <p className="booking-api-err">{submitError}</p>}
              <div className="booking-nav">
                <button type="button" className="btn-back" onClick={() => go(3)}>
                  Προηγούμενο
                </button>
                <button type="button" className="btn-primary" disabled={!canSubmit} onClick={() => void submitBooking()}>
                  <span>{submitting ? 'Αποστολή…' : 'Επιβεβαίωση Ραντεβού'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="booking-form">
          <div className="booking-success" id="booking-success">
            <div className="success-icon" aria-hidden>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" strokeWidth="1.25">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="success-title">Ραντεβού κλειστό!</h3>
            <p className="success-sub">
              Σας ευχαριστούμε που επιλέξατε την Advanced Derma. Θα επικοινωνήσουμε σύντομα για να
              επιβεβαιώσουμε το αίτημά σας.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
