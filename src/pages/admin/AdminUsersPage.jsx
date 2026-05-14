import './adminPages.css'

const SAMPLE_USERS = [
  { id: 1, name: 'Ana Reyes', email: 'ana.reyes@school.edu', role: 'student' },
  { id: 2, name: 'Marco Santos', email: 'marco.santos@school.edu', role: 'staff' },
  { id: 3, name: 'System Admin', email: 'admin@school.edu', role: 'admin' },
]

function roleClass(role) {
  if (role === 'student') return 'admin-tag admin-tag--student'
  if (role === 'staff') return 'admin-tag admin-tag--staff'
  return 'admin-tag admin-tag--admin'
}

export function AdminUsersPage() {
  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">User management</h2>
        <p className="admin-page__lead">
          CRUD for students and staff (and other roles your backend defines). JWT and RBAC apply on the server.
        </p>
      </header>

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary">
          Add user
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_USERS.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={roleClass(u.role)}>{u.role}</span>
                </td>
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
