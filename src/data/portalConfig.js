export const portalNav = {
  admin: [
    { to: '/admin', end: true, label: 'Dashboard' },
    { to: '/admin/users', label: 'User management' },
    { to: '/admin/grades', label: 'Grades' },
    { to: '/admin/announcements', label: 'Announcements' },
  ],
  instructor: [
    { to: '/instructor', end: true, label: 'Dashboard' },
    { to: '/instructor/grades', label: 'Gradebook' },
    { to: '/instructor/announcements', label: 'Announcements' },
    { to: '/instructor/profile', label: 'Profile' },
  ],
  student: [
    { to: '/student', end: true, label: 'Dashboard' },
    { to: '/student/grades', label: 'My grades' },
    { to: '/student/announcements', label: 'Announcements' },
    { to: '/student/profile', label: 'Profile' },
  ],
}

export function getPortalPath(role) {
  if (role === 'student') return '/student'
  if (role === 'instructor') return '/instructor'
  return '/admin'
}
