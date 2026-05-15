import { apiRequest } from '../lib/apiClient'

export function listAnnouncements() {
  return apiRequest('/api/announcements/')
}

export function createAnnouncement(body) {
  return apiRequest('/api/announcements/', { method: 'POST', body })
}

export function updateAnnouncement(id, body) {
  return apiRequest(`/api/announcements/${id}/`, { method: 'PATCH', body })
}

export function deleteAnnouncement(id) {
  return apiRequest(`/api/announcements/${id}/`, { method: 'DELETE' })
}
