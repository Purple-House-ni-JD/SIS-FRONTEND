import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { ActivateAccountPage } from './pages/ActivateAccountPage'
import { PublicHome } from './pages/PublicHome'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminCoursePage } from './pages/admin/AdminCoursePage'
import { AdminEnrollmentsPage } from './pages/admin/AdminEnrollmentsPage'
import { AdminGradeRecordsPage } from './pages/admin/AdminGradeRecordsPage'
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { StudentGradesPage } from './pages/student/StudentGradesPage'
import { StudentAnnouncementsPage } from './pages/student/StudentAnnouncementsPage'
import { StudentProfilePage } from './pages/student/StudentProfilePage'
import { StaffDashboard } from './pages/staff/StaffDashboard'
import { StaffCoursePage } from './pages/staff/StaffCoursePage'
import { StaffGradesPage } from './pages/staff/StaffGradesPage'
import { StaffAnnouncementsPage } from './pages/staff/StaffAnnouncementsPage'
import { StaffProfilePage } from './pages/staff/StaffProfilePage'
import { portalNav } from './data/portalConfig'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/activate/:uid/:token" element={<ActivateAccountPage />} />

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
        <Route path="courses" element={<StaffCoursePage />} />
        <Route path="grades" element={<StaffGradesPage />} />
        <Route path="announcements" element={<StaffAnnouncementsPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
      </Route>

      <Route path="/admin" element={<AppShell portal="admin" title="Admin" nav={portalNav.admin} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="courses" element={<AdminCoursePage />} />
        <Route path="enrollments" element={<AdminEnrollmentsPage />} />
        <Route path="grades" element={<AdminGradeRecordsPage />} />
        <Route path="announcements" element={<AdminAnnouncementsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
