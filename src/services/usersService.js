import { apiRequest } from "../lib/apiClient";

export function listUsers() {
  return apiRequest("/api/users/");
}

export function updateUser(id, body) {
  return apiRequest(`/api/users/${id}/`, { method: "PATCH", body });
}

export function createUser(body) {
  return apiRequest("/api/users/", { method: "POST", body });
}

export function resendActivation(id) {
  return apiRequest(`/api/users/${id}/resend_activation/`, { method: "POST" });
}

export function fetchNextReferenceId() {
  return apiRequest("/api/users/next_reference_id/");
}

export function setPasswordForUser(id, body) {
  return apiRequest(`/auth/users/${id}/set_password/`, {
    method: "POST",
    body,
  });
}
