import { apiRequest, clearTokens, setTokens } from "../lib/apiClient";

let meCache = null;

export function clearMeCache() {
  meCache = null;
}

export function getCachedMe() {
  return meCache;
}

export async function loginJwt(email, password) {
  const data = await apiRequest("/auth/jwt/create/", {
    method: "POST",
    body: { email, password },
  });
  setTokens(data.access, data.refresh);
  return data;
}

export async function fetchMe() {
  const me = await apiRequest("/auth/users/me/");
  meCache = me;
  return me;
}

export function patchMe(body) {
  return apiRequest("/auth/users/me/", { method: "PATCH", body });
}

export function setPassword(currentPassword, newPassword, reNewPassword) {
  return apiRequest("/auth/users/set_password/", {
    method: "POST",
    body: {
      current_password: currentPassword,
      new_password: newPassword,
      re_new_password: reNewPassword,
    },
  });
}

export function logout() {
  clearTokens();
  clearMeCache();
}

export function activateAccount(body) {
  return apiRequest("/auth/users/activation/", { method: "POST", body });
}

export function portalPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "instructor") return "/instructor";
  if (role === "student") return "/student";
  return "/";
}
