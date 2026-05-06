/**
 * Serializes all mutations/reads on JSON store to avoid race conditions (single-process queue).
 */
let tail = Promise.resolve()

function withStoreLock(fn) {
  const next = tail.then(() => fn())
  tail = next.catch(() => {})
  return next
}

module.exports = { withStoreLock }
