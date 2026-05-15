import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { PublicHome } from './pages/PublicHome'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminGradesPage } from './pages/admin/AdminGradesPage'
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { StudentGradesPage } from './pages/student/StudentGradesPage'
import { StudentAnnouncementsPage } from './pages/student/StudentAnnouncementsPage'
import { StudentProfilePage } from './pages/student/StudentProfilePage'
import { StaffDashboard } from './pages/staff/StaffDashboard'
import { StaffGradingPage } from './pages/staff/StaffGradingPage'
import { StaffAnnouncementsPage } from './pages/staff/StaffAnnouncementsPage'
import { StaffProfilePage } from './pages/staff/StaffProfilePage'
import { portalNav } from './data/portalConfig'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />

      <Route path="/student" element={<AppShell portal="student" title="Student" nav={portalNav.student} />}>
        <Route index element={<StudentDashboard />} />
        <Route path="grades" element={<StudentGradesPage />} />
        <Route path="announcements" element={<StudentAnnouncementsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      <Route
        path="/instructor"
        element={<AppShell portal="instructor" title="Instructor" nav={portalNav.instructor} />}
      >
        <Route index element={<StaffDashboard />} />
        <Route path="grades" element={<StaffGradingPage />} />
        <Route path="announcements" element={<StaffAnnouncementsPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
      </Route>

      <Route path="/admin" element={<AppShell portal="admin" title="Admin" nav={portalNav.admin} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="grades" element={<AdminGradesPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
