import { apiRequest } from '../lib/apiClient'

export function listGrades() {
  return apiRequest('/api/grades/')
}

export function createGrade(body) {
  return apiRequest('/api/grades/', { method: 'POST', body })
}

export function updateGrade(id, body) {
  return apiRequest(`/api/grades/${id}/`, { method: 'PATCH', body })
}
