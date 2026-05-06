const fs = require('fs')
const path = require('path')

/**
 * Ανοιχτά paths για:
 * - Τοπικά: cwd = ρίζα repo ή ο φάκελος `backend/` (node server από εκεί)
 * - Netlify Function: ρίζα zip ≈ cwd (`/var/task`) και τα αρχεία στο `backend/data/` μέσω `included_files`
 * - Ενωμένο bundle (esbuild): το `__dirname` εδώ μπορεί να μη δείχνει στο `backend/utils` — για αυτό ελέγχουμε `process.cwd()`
 */
function resolveBackendDataDir() {
  const ping = 'availability.json'
  const dirs = [
    path.join(process.cwd(), 'backend', 'data'),
    path.join(process.cwd(), 'data'),
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', '..', 'backend', 'data'),
  ]
  for (const dir of dirs) {
    try {
      if (fs.existsSync(path.join(dir, ping))) return dir
    } catch (_) {
      /* noop */
    }
  }
  return path.join(process.cwd(), 'backend', 'data')
}

const DATA_DIR = resolveBackendDataDir()
const AVAILABILITY_FILE = path.join(DATA_DIR, 'availability.json')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

module.exports = { DATA_DIR, AVAILABILITY_FILE, BOOKINGS_FILE }
