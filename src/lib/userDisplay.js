export function userDisplayName(u) {
  if (!u) return ''
  const n = [u.first_name, u.last_name].filter(Boolean).join(' ')
  return n || u.username
}
