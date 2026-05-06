const serverless = require('serverless-http')
const { connectLambda } = require('@netlify/blobs')

/**
 * Οπωσδήποτε σταθερό `require("../../backend/…")` ώστε το Netlify esbuild να τραβήξει μέσα στο bundle
 * express/cors και το backend.
 *
 * Με Lambda compatibility (`serverless-http`) τα Netlify Blobs ΔΕ ρυθμίζονται αυτόματα —
 * πρέπει να κληθεί `connectLambda(event)` ΠΡΙΝ οποιαδήποτε `getStore()`.
 *
 * Δες: https://github.com/netlify/blobs#Lambda compatibility mode (README στο @netlify/blobs).
 */
const createApp = require('../../backend/createApp.js')

const app = createApp()
const expressHandler = serverless(app)

exports.handler = async (event, context) => {
  if (event && typeof event.blobs === 'string' && event.blobs.length > 0) {
    connectLambda(event)
  }
  return expressHandler(event, context)
}
