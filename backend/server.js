const express = require('express')
const cors = require('cors')
const path = require('path')
const publicRoutes = require('./routes/publicRoutes')
const adminRoutes = require('./routes/adminRoutes')

const PORT = Number(process.env.PORT) || 3001

const app = express()
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(express.json({ limit: '512kb' }))

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

app.listen(PORT, () => {
  console.log(`Booking API listening on http://localhost:${PORT}`)
  console.log(`Data directory: ${path.join(__dirname, 'data')}`)
})
