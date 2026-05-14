import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import './adminPages.css'

const SAMPLE_COURSES = [
  { id: 1, code: 'CS201', title: 'Data Structures', instructor: 'Marco Santos', created_at: '2026-05-10' },
  { id: 2, code: 'IT204', title: 'Web Systems', instructor: 'Lea Ramos', created_at: '2026-05-11' },
  { id: 3, code: 'ENG210', title: 'Technical Writing', instructor: 'Anne Cruz', created_at: '2026-05-12' },
]

export function AdminGradesPage() {
  const [editingCourse, setEditingCourse] = useState(null)

  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Courses</h2>
        <p className="admin-page__lead">
          Static admin course view based on the backend course serializer and instructor assignment.
        </p>
      </header>

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary">
          Add course
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_COURSES.map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.created_at}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setEditingCourse(course)}
                    >
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

      <EditModal
        isOpen={Boolean(editingCourse)}
        title={editingCourse ? `Edit ${editingCourse.code}` : 'Edit course'}
        onClose={() => setEditingCourse(null)}
        onSubmit={() => setEditingCourse(null)}
      >
        {editingCourse ? (
          <>
            <label className="static-modal__label">
              Code
              <input className="static-modal__input" defaultValue={editingCourse.code} />
            </label>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" defaultValue={editingCourse.title} />
            </label>
            <label className="static-modal__label">
              Instructor
              <input className="static-modal__input" defaultValue={editingCourse.instructor} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
