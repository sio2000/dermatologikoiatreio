const express = require('express')
const { adminAuthMiddleware } = require('../middleware/adminAuth')
const {
  postLogin,
  getAdminAvailability,
  postAdminAvailability,
  postAdminAvailabilityBatch,
  deleteAdminAvailability,
  getAdminBookings,
} = require('../controllers/adminController')

const router = express.Router()

router.post('/login', postLogin)
router.use(adminAuthMiddleware)
router.get('/availability', getAdminAvailability)
router.post('/availability/batch', postAdminAvailabilityBatch)
router.post('/availability', postAdminAvailability)
router.delete('/availability', deleteAdminAvailability)
router.get('/bookings', getAdminBookings)

module.exports = router
