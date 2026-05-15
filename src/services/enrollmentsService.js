import { apiRequest } from '../lib/apiClient'

export function listEnrollments() {
  return apiRequest('/api/enrollments/')
}

export function createEnrollment(body) {
  return apiRequest('/api/enrollments/', { method: 'POST', body })
}

export function updateEnrollment(id, body) {
  return apiRequest(`/api/enrollments/${id}/`, { method: 'PATCH', body })
}

export function deleteEnrollment(id) {
  return apiRequest(`/api/enrollments/${id}/`, { method: 'DELETE' })
}
