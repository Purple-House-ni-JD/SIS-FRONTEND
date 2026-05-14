import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { PublicHome } from './pages/PublicHome'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminGradesPage } from './pages/admin/AdminGradesPage'
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage'

const studentNav = [
  { to: '/student', end: true, label: 'Dashboard' },
  { to: '/student/grades', label: 'My grades' },
  { to: '/student/announcements', label: 'Announcements' },
  { to: '/student/profile', label: 'Profile' },
]

const staffNav = [
  { to: '/staff', end: true, label: 'Dashboard' },
  { to: '/staff/grading', label: 'Grading' },
  { to: '/staff/announcements', label: 'Announcements' },
  { to: '/staff/profile', label: 'Profile' },
]

const adminNav = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/users', label: 'User management' },
  { to: '/admin/grades', label: 'Student grades' },
  { to: '/admin/announcements', label: 'Announcements' },
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />

      <Route path="/student" element={<AppShell portal="student" title="Student" nav={studentNav} />}>
        <Route index element={<PlaceholderPage title="Student dashboard" hint="Overview of grades and quick links will load here once the API is wired." />} />
        <Route path="grades" element={<PlaceholderPage title="My grades" hint="Course list and scores (read-only for students)." />} />
        <Route path="announcements" element={<PlaceholderPage title="Announcements" hint="School-wide posts and updates." />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" hint="Edit student information and contact details." />} />
      </Route>

      <Route path="/staff" element={<AppShell portal="staff" title="Staff" nav={staffNav} />}>
        <Route index element={<PlaceholderPage title="Staff dashboard" hint="Summary of classes and pending grading tasks." />} />
        <Route path="grading" element={<PlaceholderPage title="Grading" hint="CRUD for student grades per class." />} />
        <Route path="announcements" element={<PlaceholderPage title="Announcements" hint="Create and manage announcements." />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" hint="Staff information and preferences." />} />
      </Route>

      <Route path="/admin" element={<AppShell portal="admin" title="Admin" nav={adminNav} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="grades" element={<AdminGradesPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
