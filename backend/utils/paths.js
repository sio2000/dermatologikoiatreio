const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'data')
const AVAILABILITY_FILE = path.join(DATA_DIR, 'availability.json')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

module.exports = { DATA_DIR, AVAILABILITY_FILE, BOOKINGS_FILE }
