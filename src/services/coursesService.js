import { apiRequest } from '../lib/apiClient'

export function listCourses() {
  return apiRequest('/api/courses/')
}

export function createCourse(body) {
  return apiRequest('/api/courses/', { method: 'POST', body })
}

export function updateCourse(id, body) {
  return apiRequest(`/api/courses/${id}/`, { method: 'PATCH', body })
}

export function deleteCourse(id) {
  return apiRequest(`/api/courses/${id}/`, { method: 'DELETE' })
}
