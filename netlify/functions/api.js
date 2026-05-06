const serverless = require('serverless-http')

/**
 * Οπωσδήποτε σταθερό `require("../../backend/…")` ώστε το Netlify esbuild να ακολουθήσει το
 dependency graph και να επισυνάψει **express**, **cors**, κ.λπ. στο bundle της function.
 * Δυναμικό `require(variablePath)` (όπως πριν οδηγούσε σε φόρτωση «γυμνών» `.js` αρχείων
 * μέσω `included_files` χωρίς αντίστοιχα `node_modules` → Cannot find module 'express').
 *
 * Ο φάκελος `included_files backend/data/` παραμένει για τα JSON seed στο δίσκο (filesystem / Blobs seed).
 */
const createApp = require('../../backend/createApp.js')

const app = createApp()

exports.handler = serverless(app)
