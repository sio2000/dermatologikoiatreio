const express = require('express')
const { getAvailability, postBook } = require('../controllers/publicController')

const router = express.Router()

router.get('/availability', getAvailability)
router.post('/book', postBook)

module.exports = router
