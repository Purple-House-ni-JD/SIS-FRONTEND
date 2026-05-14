import './adminPages.css'

const SAMPLE_GRADES = [
  { id: 1, student: 'Ana Reyes', course: 'CS101', score: 92, remarks: 'Passed' },
  { id: 2, student: 'Luis Cruz', course: 'MATH200', score: 88, remarks: 'Passed' },
  { id: 3, student: 'Kim Tan', course: 'ENG105', score: 76, remarks: 'Remedial' },
]

export function AdminGradesPage() {
  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Student grades</h2>
        <p className="admin-page__lead">
          Admin-wide view and CRUD for grade records. Staff will use their own grading views; this is the super-admin
          layer.
        </p>
      </header>

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary">
          Add grade record
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Score</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_GRADES.map((g) => (
              <tr key={g.id}>
                <td>{g.student}</td>
                <td>{g.course}</td>
                <td>{g.score}</td>
                <td>{g.remarks}</td>
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
