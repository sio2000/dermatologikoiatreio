const crypto = require('crypto')

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'advanced12!34derma'
const validTokens = new Set()

function login(password) {
  if (password !== ADMIN_PASSWORD) return null
  const token = crypto.randomBytes(32).toString('hex')
  validTokens.add(token)
  return token
}

function isValidToken(token) {
  return typeof token === 'string' && validTokens.has(token)
}

module.exports = { login, isValidToken }
