import './adminPages.css'

const SAMPLE_ANNOUNCEMENTS = [
  { id: 1, title: 'Enrollment period', author: 'Registrar', date: '2026-05-01' },
  { id: 2, title: 'Campus maintenance', author: 'Admin', date: '2026-05-08' },
]

export function AdminAnnouncementsPage() {
  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Announcements</h2>
        <p className="admin-page__lead">Full CRUD for all school announcements. Staff can create their own posts from the staff portal later.</p>
      </header>

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary">
          New announcement
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created by</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ANNOUNCEMENTS.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.date}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm">
                      Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn--danger admin-btn--sm">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
