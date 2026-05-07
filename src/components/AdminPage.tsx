import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiUrl } from '../lib/api'
import './AdminPage.css'

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

const CLINICS = [
  {
    id: 'athens' as const,
    title: 'Ιατρείο Αθήνας',
    subtitle: 'Στρατάρχου Παπάγου Αλεξάνδρου 50, 2ος όροφος, 15771',
    variant: 'athens' as const,
  },
  {
    id: 'piraeus' as const,
    title: 'Ιατρείο Πειραιά',
    subtitle: 'Γρ. Λαμπράκη 109, 185 34 Πειραιάς',
    variant: 'piraeus' as const,
  },
]

/** Ώρες σε 24ωρη μορφή, ανά 1 πλήρη ώρα (χωρίς π.μ./μ.μ.) */
const TIME_OPTIONS: string[] = (() => {
  const out: string[] = []
  for (let h = 8; h <= 21; h++) {
    out.push(`${pad2(h)}:00`)
  }
  return out
})()

/** 24ωρη μορφή — χωρίς π.μ./μ.μ. */
function timeOptionLabel(t: string): string {
  return `Ώρα ${t}`
}

const TREATMENT_LABELS: Record<string, string> = {
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

const CLINIC_LABELS: Record<string, string> = {
  athens: 'Αθήνα',
  piraeus: 'Πειραιάς',
}

const BOOKINGS_PAGE_SIZE = 16

function formatTreatmentDisplay(treatment: unknown): string {
  if (treatment == null) return '—'
  const key = typeof treatment === 'string' ? treatment.trim().toLowerCase() : ''
  if (!key) return '—'
  return TREATMENT_LABELS[key] ?? key
}

/** Εμφάνιση θεραπείας: προτιμά το αποθηκευμένο label από τον server, μετά το κλειδί */
function displayTreatmentOnCard(b: BookingRow): string {
  const label = typeof b.treatmentLabel === 'string' ? b.treatmentLabel.trim() : ''
  if (label) return label
  return formatTreatmentDisplay(b.treatment)
}

function formatGreekDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  return `${d} ${GREEK_MONTHS[mo]} ${y}`
}

function parseHM(s: string): number {
  const [h, min] = s.split(':').map(Number)
  return h * 60 + min
}

function formatHM(totalMin: number): string {
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${pad2(h)}:${pad2(m)}`
}

/** Ενδιάμεσες ώρες με βήμα σε λεπτά, κλειστό διάστημα [από, έως] — στη γραμμή διαχείρισης χρησιμοποιείται βήμα 60 λεπτά */
function rangeTimesInclusive(from: string, to: string, stepMin: number): string[] {
  let a = parseHM(from)
  let b = parseHM(to)
  if (a > b) [a, b] = [b, a]
  const out: string[] = []
  for (let t = a; t <= b; t += stepMin) {
    out.push(formatHM(t))
  }
  return out
}

type Slot = { clinic: string; date: string; time: string }
type BookingRow = Slot & {
  name: string
  phone: string
  email: string
  id: string
  createdAt: string
  treatment?: string
  treatmentLabel?: string
  notes?: string
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

/** Χρονική στιγμή ραντεβού (τοπική) */
function bookingTs(b: BookingRow): number {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b.date)
  if (!dm) return 0
  const tm = /^(\d{1,2}):(\d{2})$/.exec(b.time.trim())
  if (!tm) return 0
  return new Date(Number(dm[1]), Number(dm[2]) - 1, Number(dm[3]), Number(tm[1]), Number(tm[2]), 0).getTime()
}

/** Απόκρυψη στη λίστα μόνο — τα δεδομένα παραμένουν στο σύστημα */
function isBookingDateTimePast(b: BookingRow): boolean {
  const t = bookingTs(b)
  return t > 0 && t < Date.now()
}

function bookingSortTimeAsc(a: BookingRow, b: BookingRow): number {
  return bookingTs(a) - bookingTs(b)
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

function AdminCalendar({
  clinicId,
  title,
  subtitle,
  variant,
  token,
  slots,
  onSlotsChange,
}: {
  clinicId: 'athens' | 'piraeus'
  title: string
  subtitle: string
  variant: 'athens' | 'piraeus'
  token: string
  slots: Slot[]
  onSlotsChange: () => void
}) {
  const [calYear, setCalYear] = useState(() => new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth())
  const [pickedDay, setPickedDay] = useState<string | null>(null)
  const [timeSingle, setTimeSingle] = useState('09:00')
  const [timeFrom, setTimeFrom] = useState('09:00')
  const [timeTo, setTimeTo] = useState('17:00')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [rangeMsg, setRangeMsg] = useState('')

  const calCells = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1)
    let startDow = firstDay.getDay()
    startDow = (startDow + 6) % 7
    const dim = new Date(calYear, calMonth + 1, 0).getDate()
    const today = new Date()
    const days: { d: number; past: boolean; today: boolean }[] = []
    for (let d = 1; d <= dim; d++) {
      const thisDate = new Date(calYear, calMonth, d)
      const past = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const isToday =
        d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
      days.push({ d, past, today: isToday })
    }
    return { emptyLen: startDow, days }
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

  const slotsForClinicDay = useMemo(() => {
    if (!pickedDay) return []
    return slots
      .filter((s) => s.clinic === clinicId && s.date === pickedDay)
      .map((s) => s.time)
      .sort()
  }, [slots, clinicId, pickedDay])

  async function addSlot() {
    if (!pickedDay) return
    setErr('')
    setRangeMsg('')
    setBusy(true)
    try {
      const res = await fetch(apiUrl('/api/admin/availability'), {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ clinic: clinicId, date: pickedDay, time: timeSingle }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Αποτυχία')
      onSlotsChange()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Σφάλμα')
    } finally {
      setBusy(false)
    }
  }

  async function addRangeSlots() {
    if (!pickedDay) return
    setErr('')
    setRangeMsg('')
    const times = rangeTimesInclusive(timeFrom, timeTo, 60)
    if (times.length === 0) {
      setErr('Επίλεξε έγκυρο διάστημα ωρών.')
      return
    }
    setBusy(true)
    try {
      const slots = times.map((t) => ({ clinic: clinicId, date: pickedDay, time: t }))
      const res = await fetch(apiUrl('/api/admin/availability/batch'), {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ slots }),
      })
      const data = await res.json().catch(() => ({} as Record<string, unknown>))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Αποτυχία')
      const added =
        typeof data.added === 'number' && Number.isFinite(data.added) ? data.added : 0
      const skipped =
        typeof data.skipped === 'number' && Number.isFinite(data.skipped) ? data.skipped : 0
      setRangeMsg(`Προστέθηκαν ${added} ώρες${skipped ? ` (${skipped} υπήρχαν ήδη)` : ''}.`)
      onSlotsChange()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Σφάλμα')
    } finally {
      setBusy(false)
    }
  }

  async function removeSlot(date: string, time: string) {
    setErr('')
    setRangeMsg('')
    setBusy(true)
    try {
      const res = await fetch(apiUrl('/api/admin/availability'), {
        method: 'DELETE',
        headers: authHeaders(token),
        body: JSON.stringify({ clinic: clinicId, date, time }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Αποτυχία')
      onSlotsChange()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Σφάλμα')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`admin-cal-block admin-cal-block--${variant}`}>
      <header className="admin-cal-head">
        <h3 className="admin-cal-title">{title}</h3>
        <p className="admin-cal-subtitle">{subtitle}</p>
      </header>
      <div className="admin-calendar-header">
        <div className="admin-cal-month">
          {GREEK_MONTHS[calMonth]} {calYear}
        </div>
        <div className="admin-cal-nav-btns">
          <button type="button" className="admin-cal-nav" onClick={() => changeMonth(-1)} aria-label="Προηγούμενος μήνας">
            ‹
          </button>
          <button type="button" className="admin-cal-nav" onClick={() => changeMonth(1)} aria-label="Επόμενος μήνας">
            ›
          </button>
        </div>
      </div>
      <div className="admin-cal-grid">
        {CAL_DAY_NAMES.map((dn) => (
          <div key={dn} className="admin-cal-dow">
            {dn}
          </div>
        ))}
        {Array.from({ length: calCells.emptyLen }, (_, i) => (
          <div key={`e-${i}`} className="admin-cal-cell empty" />
        ))}
        {calCells.days.map(({ d, past, today }) => {
          const iso = `${calYear}-${pad2(calMonth + 1)}-${pad2(d)}`
          const hasSlot = slots.some((s) => s.clinic === clinicId && s.date === iso)
          const selected = pickedDay === iso
          return (
            <button
              key={iso}
              type="button"
              className={`admin-cal-cell${past ? ' past' : ''}${today ? ' today' : ''}${selected ? ' selected' : ''}${!past && hasSlot ? ' has-slots' : ''}`}
              disabled={past}
              onClick={() => {
                setPickedDay(iso)
                setErr('')
                setRangeMsg('')
              }}
            >
              {d}
            </button>
          )
        })}
      </div>
      {pickedDay && (
        <div className="admin-day-panel">
          <p className="admin-day-label">
            Επιλεγμένη ημέρα: <strong>{formatGreekDate(pickedDay)}</strong>
            <span className="admin-day-iso"> ({pickedDay})</span>
          </p>

          <div className="admin-time-block">
            <h4 className="admin-time-block-title">Μία ώρα</h4>
            <div className="admin-add-row">
              <label className="admin-select-wrap" htmlFor={`single-${clinicId}`}>
                <span className="admin-select-label">Επιλογή ώρας</span>
                <select
                  id={`single-${clinicId}`}
                  className="admin-select"
                  value={timeSingle}
                  onChange={(e) => setTimeSingle(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {timeOptionLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="admin-btn admin-btn-primary" disabled={busy} onClick={() => void addSlot()}>
                Προσθήκη ώρας
              </button>
            </div>
          </div>

          <div className="admin-time-block admin-time-block--range">
            <h4 className="admin-time-block-title">Διάστημα ωρών (ανά 1 ώρα)</h4>
            <p className="admin-time-hint">
              Προστίθεται μία διαθέσιμη ώρα ανά πλήρη ώρα, από την ώρα «Από» έως την ώρα «Έως» (συμπεριλαμβανομένων).
            </p>
            <div className="admin-range-row">
              <label className="admin-select-wrap" htmlFor={`from-${clinicId}`}>
                <span className="admin-select-label">Από (επιλογή ώρας)</span>
                <select
                  id={`from-${clinicId}`}
                  className="admin-select"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {timeOptionLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              <span className="admin-range-mid" aria-hidden>
                έως
              </span>
              <label className="admin-select-wrap" htmlFor={`to-${clinicId}`}>
                <span className="admin-select-label">Έως (επιλογή ώρας)</span>
                <select
                  id={`to-${clinicId}`}
                  className="admin-select"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {timeOptionLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="admin-btn admin-btn-secondary" disabled={busy} onClick={() => void addRangeSlots()}>
                Προσθήκη όλων των ενδιάμεσων ωρών
              </button>
            </div>
            {rangeMsg && <p className="admin-range-ok">{rangeMsg}</p>}
          </div>

          {slotsForClinicDay.length > 0 && (
            <div className="admin-slots-box">
              <h4 className="admin-slots-box-title">Ώρες διαθεσιμότητας για αυτή την ημέρα</h4>
              <ul className="admin-slot-list">
                {slotsForClinicDay.map((t) => (
                  <li key={t} className="admin-slot-item">
                    <span className="admin-slot-time">{timeOptionLabel(t)}</span>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" disabled={busy} onClick={() => void removeSlot(pickedDay, t)}>
                      Αφαίρεση
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {err && <p className="admin-err">{err}</p>}
    </div>
  )
}

export function AdminPage() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('derma_admin_token'))
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loadErr, setLoadErr] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [clinicFilter, setClinicFilter] = useState<'all' | 'athens' | 'piraeus'>('all')
  const [treatmentFilter, setTreatmentFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(0)
  const [notesModal, setNotesModal] = useState<{ patient: string; notes: string } | null>(null)

  const loadData = useCallback(async () => {
    if (!token) return
    setLoadErr('')
    try {
      const [a, b] = await Promise.all([
        fetch(apiUrl('/api/admin/availability'), { headers: authHeaders(token) }),
        fetch(apiUrl('/api/admin/bookings'), { headers: authHeaders(token) }),
      ])
      if (a.status === 401 || b.status === 401) {
        sessionStorage.removeItem('derma_admin_token')
        setToken(null)
        return
      }
      const aj = await a.json()
      const bj = await b.json()
      if (!a.ok) throw new Error(aj.error || 'Δεδομένα διαθεσιμότητας')
      if (!b.ok) throw new Error(bj.error || 'Ραντεβού')
      setSlots(aj.slots || [])
      setBookings(bj.bookings || [])
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : 'Σφάλμα φόρτωσης')
    }
  }, [token])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    if (!notesModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotesModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [notesModal])

  useEffect(() => {
    setPage(0)
  }, [clinicFilter, treatmentFilter])

  const visibleBookings = useMemo(() => {
    let list = bookings.filter((b) => !isBookingDateTimePast(b))
    if (clinicFilter !== 'all') list = list.filter((b) => b.clinic === clinicFilter)
    if (treatmentFilter !== 'all') {
      const tf = treatmentFilter.toLowerCase()
      list = list.filter((b) => (typeof b.treatment === 'string' ? b.treatment.trim().toLowerCase() : '') === tf)
    }
    return [...list].sort(bookingSortTimeAsc)
  }, [bookings, clinicFilter, treatmentFilter])

  const totalPages =
    visibleBookings.length === 0 ? 0 : Math.ceil(visibleBookings.length / BOOKINGS_PAGE_SIZE)
  const effectivePage = totalPages === 0 ? 0 : Math.min(page, totalPages - 1)
  const pageStart = effectivePage * BOOKINGS_PAGE_SIZE
  const paginatedBookings = visibleBookings.slice(pageStart, pageStart + BOOKINGS_PAGE_SIZE)
  const showFrom = visibleBookings.length === 0 ? 0 : pageStart + 1
  const showTo = visibleBookings.length === 0 ? 0 : Math.min(pageStart + BOOKINGS_PAGE_SIZE, visibleBookings.length)

  useEffect(() => {
    if (totalPages === 0) {
      setPage(0)
      return
    }
    setPage((prev) => Math.min(prev, totalPages - 1))
  }, [totalPages])

  async function handleRefresh() {
    setRefreshing(true)
    try {
      await loadData()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginErr('')
    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const text = await res.text()
      let data: Record<string, unknown> = {}
      try {
        if (text) data = JSON.parse(text) as Record<string, unknown>
      } catch {
        /* 502/HTML από edge — όχι JSON */
      }
      if (!res.ok) {
        if (res.status === 502 || res.status === 503) {
          throw new Error(
            'Ο διακομιστής δεν απάντησε (503/502). Συχνότερα χρειάζεται επαν-deploy ή έλεγχος των Netlify Functions, όχι λάθος κωδικός.',
          )
        }
        const apiErr =
          typeof data.error === 'string' && data.error.trim() !== '' ? data.error : ''
        throw new Error(apiErr || 'Σφάλμα σύνδεσης')
      }
      const newToken = data.token
      if (typeof newToken !== 'string' || !newToken) {
        throw new Error('Η απάντηση του διακομιστή δεν περιλαμβάνει token')
      }
      sessionStorage.setItem('derma_admin_token', newToken)
      setToken(newToken)
      setPassword('')
    } catch (err) {
      setLoginErr(err instanceof Error ? err.message : 'Σφάλμα')
    }
  }

  async function deleteBooking(bookingId: string) {
    if (!token) return
    const ok = window.confirm('Να διαγραφεί οριστικά αυτή η κράτηση;')
    if (!ok) return
    try {
      const res = await fetch(apiUrl('/api/admin/bookings'), {
        method: 'DELETE',
        headers: authHeaders(token),
        body: JSON.stringify({ id: bookingId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Αποτυχία διαγραφής')
      await loadData()
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : 'Σφάλμα διαγραφής')
    }
  }

  function logout() {
    sessionStorage.removeItem('derma_admin_token')
    setToken(null)
  }

  if (!token) {
    return (
      <div className="admin-root admin-root--login">
        <div className="admin-login-card">
          <p className="admin-login-kicker">Advanced Derma</p>
          <h1 className="admin-h1 admin-h1--login">Πίνακας διαχείρισης</h1>
          <p className="admin-login-note">Σύνδεση για τη Δρ. Χρυσούλα Ζήσιμου</p>
          <form onSubmit={handleLogin}>
            <label className="admin-label" htmlFor="admin-pw">
              Κωδικός πρόσβασης
            </label>
            <div className="admin-password-wrap">
              <input
                id="admin-pw"
                type={showPassword ? 'text' : 'password'}
                className="admin-input admin-input--password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Απόκρυψη κωδικού πρόσβασης' : 'Εμφάνιση κωδικού πρόσβασης'}
                aria-pressed={showPassword}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {loginErr && <p className="admin-err">{loginErr}</p>}
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-block">
              Σύνδεση
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-root admin-dashboard">
      <header className="admin-topbar">
        <div className="admin-brand">
          <p className="admin-brand-kicker">Advanced Derma</p>
          <h1 className="admin-h1 admin-h1--dashboard">Πίνακας ραντεβού</h1>
        </div>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={logout}>
          Αποσύνδεση
        </button>
      </header>

      <section className="admin-welcome">
        <div className="admin-welcome-inner">
          <p className="admin-welcome-line">Αγαπητή Δρ. Χρυσούλα Ζήσιμου,</p>
          <p className="admin-welcome-text">
            Καλώς ήρθατε στον πίνακα διαχείρισης. Εδώ οργανώνετε τη διαθεσιμότητα για το ιατρείο της Αθήνας και του Πειραιά,
            ελέγχετε τις κρατήσεις των ασθενών και ενημερώνετε το πρόγραμμα με ασφάλεια και σαφήνεια.
          </p>
        </div>
      </section>

      {loadErr && <p className="admin-err admin-banner">{loadErr}</p>}

      <section className="admin-section">
        <div className="admin-section-head">
          <h2 className="admin-section-title">Ημερολόγια διαθεσιμότητας</h2>
          <p className="admin-section-desc">Ξεχωριστό ημερολόγιο ανά ιατρείο — επιλέξτε ημέρα και ώρες σε ελληνική μορφή (24ωρο).</p>
        </div>
        <div className="admin-calendars">
          {CLINICS.map((c) => (
            <AdminCalendar
              key={c.id}
              clinicId={c.id}
              title={c.title}
              subtitle={c.subtitle}
              variant={c.variant}
              token={token}
              slots={slots}
              onSlotsChange={loadData}
            />
          ))}
        </div>
      </section>

      <section className="admin-section admin-section--bookings">
        <div className="admin-section-head admin-section-head--row">
          <div>
            <h2 className="admin-section-title">Κρατήσεις ασθενών</h2>
            <p className="admin-section-desc">Προβολή μελλοντικών και σημερινών ραντεβού (έως την ώρα του ραντεβού).</p>
          </div>
          <button type="button" className="admin-btn admin-btn-primary" disabled={refreshing} onClick={() => void handleRefresh()}>
            {refreshing ? 'Ανανέωση…' : 'Ανανέωση λίστας'}
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="admin-bookings-empty">
            <p className="admin-bookings-empty-title">Δεν υπάρχουν κρατήσεις ακόμη</p>
            <p className="admin-bookings-empty-sub">Όταν οι ασθενείς κλείσουν ραντεβού από την ιστοσελίδα, θα εμφανίζονται εδώ.</p>
          </div>
        ) : (
          <>
            <div className="admin-bookings-filters">
              <span className="admin-filters-label">Φίλτρα (προαιρετικά)</span>
              <div className="admin-filters-row">
                <label className="admin-filter-field">
                  <span className="admin-filter-caption">Ιατρείο</span>
                  <select
                    className="admin-select admin-select--filter"
                    value={clinicFilter}
                    onChange={(e) => setClinicFilter(e.target.value as 'all' | 'athens' | 'piraeus')}
                  >
                    <option value="all">Όλα</option>
                    <option value="athens">Μόνο Αθήνα</option>
                    <option value="piraeus">Μόνο Πειραιάς</option>
                  </select>
                </label>
                <label className="admin-filter-field">
                  <span className="admin-filter-caption">Θεραπεία</span>
                  <select
                    className="admin-select admin-select--filter"
                    value={treatmentFilter}
                    onChange={(e) => setTreatmentFilter(e.target.value)}
                  >
                    <option value="all">Όλες οι θεραπείες</option>
                    {Object.entries(TREATMENT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {visibleBookings.length === 0 ? (
              <div className="admin-bookings-empty">
                <p className="admin-bookings-empty-title">
                  {bookings.every(isBookingDateTimePast)
                    ? 'Δεν εμφανίζονται ενεργές κρατήσεις'
                    : 'Δεν βρέθηκαν κρατήσεις'}
                </p>
                <p className="admin-bookings-empty-sub">
                  {bookings.every(isBookingDateTimePast)
                    ? 'Όλες οι καταχωρημένες κρατήσεις αφορούν ημερομηνίες και ώρες που έχουν ήδη περάσει. Δεν εμφανίζονται πλέον εδώ — παραμένουν όμως καταγεγραμμένες στο σύστημα.'
                    : 'Δοκιμάστε άλλο συνδυασμό φίλτρων (ιατρείο / θεραπεία).'}
                </p>
              </div>
            ) : (
              <>
                <p className="admin-bookings-meta">
                  Εμφάνιση <strong>{showFrom}</strong>–<strong>{showTo}</strong> από <strong>{visibleBookings.length}</strong>
                  {totalPages > 1 ? (
                    <>
                      {' '}
                      · Σελίδα <strong>{effectivePage + 1}</strong> από <strong>{totalPages}</strong>
                    </>
                  ) : null}
                </p>
                <div className="admin-booking-cards" aria-label="Λίστα κρατήσεων">
                  {paginatedBookings.map((b) => (
                    <article key={b.id} className="admin-booking-card">
                      <div className="admin-booking-card-top">
                        <span className={`admin-badge admin-badge--${b.clinic}`}>{CLINIC_LABELS[b.clinic] ?? b.clinic}</span>
                        <time className="admin-booking-when" dateTime={`${b.date}T${b.time}`}>
                          {formatGreekDate(b.date)} · ώρα {b.time} <span className="admin-time-24h">(24ωρο)</span>
                        </time>
                      </div>
                      <h3 className="admin-booking-name">{b.name}</h3>
                      <dl className="admin-booking-dl">
                        <div className="admin-booking-dl-row">
                          <dt>Θεραπεία</dt>
                          <dd>{displayTreatmentOnCard(b)}</dd>
                        </div>
                        <div className="admin-booking-dl-row">
                          <dt>Τηλέφωνο</dt>
                          <dd>
                            <a href={`tel:${(b.phone || '').replace(/\s/g, '')}`}>{b.phone}</a>
                          </dd>
                        </div>
                        <div className="admin-booking-dl-row">
                          <dt>Email</dt>
                          <dd>
                            {b.email ? (
                              <a href={`mailto:${b.email}`}>{b.email}</a>
                            ) : (
                              <span className="admin-muted">—</span>
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="admin-booking-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-notes"
                          onClick={() =>
                            setNotesModal({
                              patient: b.name,
                              notes: typeof b.notes === 'string' ? b.notes.trim() : '',
                            })
                          }
                        >
                          Προβολή παρατηρήσεων
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-booking-delete"
                          onClick={() => void deleteBooking(b.id)}
                        >
                          Διαγραφή κράτησης
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                {totalPages > 1 ? (
                  <nav className="admin-pagination" aria-label="Σελιδοποίηση κρατήσεων">
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      disabled={effectivePage <= 0}
                      onClick={() => setPage((p) => Math.max(0, Math.min(p, totalPages - 1) - 1))}
                    >
                      Προηγούμενη
                    </button>
                    <span className="admin-pagination-status">
                      {effectivePage + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      disabled={effectivePage >= totalPages - 1}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, Math.min(p, totalPages - 1) + 1))
                      }
                    >
                      Επόμενη
                    </button>
                  </nav>
                ) : null}
              </>
            )}
          </>
        )}
      </section>

      {notesModal ? (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setNotesModal(null)}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-notes-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setNotesModal(null)}
              aria-label="Κλείσιμο διαλόγου"
            >
              ×
            </button>
            <h2 id="admin-notes-modal-title" className="admin-modal-title">
              Παρατηρήσεις ασθενούς
            </h2>
            <p className="admin-modal-patient">{notesModal.patient}</p>
            <div className="admin-modal-body">
              {notesModal.notes
                ? notesModal.notes
                : 'Δεν υπάρχουν καταγεγραμμένες παρατηρήσεις για αυτό το ραντεβού.'}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
