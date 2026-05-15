const ACCESS = 'sis_access'
const REFRESH = 'sis_refresh'

export function getApiBase() {
  return import.meta.env.VITE_API_URL ?? ''
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS)
}

export function setTokens(access, refresh) {
  localStorage.setItem(ACCESS, access)
  if (refresh) localStorage.setItem(REFRESH, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}

function messageFromBody(data) {
  if (!data || typeof data !== 'object') return 'Request failed'
  if (data.detail) return Array.isArray(data.detail) ? data.detail.map((d) => d?.msg || d).join(', ') : String(data.detail)
  for (const key of Object.keys(data)) {
    const v = data[key]
    if (Array.isArray(v) && v.length) return `${key}: ${v[0]}`
    if (typeof v === 'string') return v
  }
  return 'Request failed'
}

export async function apiRequest(path, { method = 'GET', body, json = true } = {}) {
  const base = getApiBase()
  const url = path.startsWith('http') ? path : `${base}${path}`
  const headers = {}
  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const init = { method, headers }
  if (body !== undefined) {
    if (json && typeof body === 'object' && !(body instanceof FormData)) {
      init.body = JSON.stringify(body)
      headers['Content-Type'] = 'application/json'
    } else {
      init.body = body
    }
  }

  const res = await fetch(url, init)
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }
  if (!res.ok) {
    const err = new Error(messageFromBody(data))
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

export function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}
