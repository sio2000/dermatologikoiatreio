/** Base URL for API (no trailing slash). Empty = same origin + Vite dev proxy. */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''
  if (!path.startsWith('/')) return `${base}/${path}`
  return base ? `${base}${path}` : path
}
