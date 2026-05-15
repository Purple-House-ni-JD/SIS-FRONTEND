import { Link } from 'react-router-dom'
import './adminPages.css'

export function AdminDashboard() {
  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Admin dashboard</h2>
        <p className="admin-page__lead">
          Overview for administrators. Open a section below to manage users, courses, or announcements.
        </p>
      </header>

      <div className="admin-dash-cards">
        <Link to="/admin/users" className="admin-dash-card">
          <p className="admin-dash-card__label">Manage</p>
          <h3 className="admin-dash-card__title">User management</h3>
          <p className="admin-dash-card__text">Students, instructors, and admin accounts.</p>
        </Link>
        <Link to="/admin/grades" className="admin-dash-card">
          <p className="admin-dash-card__label">Manage</p>
          <h3 className="admin-dash-card__title">Grades</h3>
          <p className="admin-dash-card__text">Enrollment-based scores and remarks across all courses.</p>
        </Link>
        <Link to="/admin/announcements" className="admin-dash-card">
          <p className="admin-dash-card__label">Manage</p>
          <h3 className="admin-dash-card__title">Announcements</h3>
          <p className="admin-dash-card__text">School-wide posts created by authorized users.</p>
        </Link>
      </div>
    </article>
  )
}
