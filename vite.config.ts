import { defineConfig } from 'vite'
import type { ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import type { ServerResponse } from 'node:http'

/**
 * Proxy του /api προς τον τοπικό backend (dev). Αν ο backend δεν τρέχει, αντί να γεμίζει
 * η κονσόλα με ECONNREFUSED stack traces, απαντάμε ήσυχα με 503 JSON.
 * Στο production (Netlify) το /api εξυπηρετείται από τη serverless function — δεν χρησιμοποιείται αυτό.
 */
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:3001'

const apiProxy: ProxyOptions = {
  target: API_TARGET,
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on('error', (_err, _req, res) => {
      const response = res as ServerResponse
      if (response && typeof response.writeHead === 'function' && !response.headersSent) {
        response.writeHead(503, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ error: 'Ο τοπικός backend δεν είναι διαθέσιμος (dev)' }))
      }
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiProxy,
    },
  },
  preview: {
    proxy: {
      '/api': apiProxy,
    },
  },
})
