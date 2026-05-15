import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as coursesService from '../../services/coursesService'
import * as enrollmentsService from '../../services/enrollmentsService'
import * as usersService from '../../services/usersService'
import './adminPages.css'

function EnrollmentFormModal({ isOpen, title, students, courses, initial, onClose, onSubmit, onError }) {
  return (
    <EditModal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onSubmit={async (e) => {
        const fd = new FormData(e.currentTarget)
        try {
          await onSubmit({
            student: Number(fd.get('student')),
            course: Number(fd.get('course')),
          })
        } catch (err) {
          onError(err.message || 'Save failed')
        }
      }}
    >
      <label className="static-modal__label">
        Student
        <select className="static-modal__select" name="student" required defaultValue={initial?.student ?? ''}>
          <option value="" disabled>
            Select student
          </option>
          {students.map((u) => (
            <option key={u.id} value={u.id}>
              {userDisplayName(u)}
            </option>
          ))}
        </select>
      </label>
      <label className="static-modal__label">
        Course
        <select className="static-modal__select" name="course" required defaultValue={initial?.course ?? ''}>
          <option value="" disabled>
            Select course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      </label>
    </EditModal>
  )
}

export function AdminEnrollmentsPage() {
  const [rows, setRows] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [enrollmentData, userData, courseData] = await Promise.all([
        enrollmentsService.listEnrollments(),
        usersService.listUsers(),
        coursesService.listCourses(),
      ])
      const users = unwrapList(userData)
      setRows(unwrapList(enrollmentData))
      setStudents(users.filter((u) => u.role === 'student'))
      setCourses(unwrapList(courseData))
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Enrollments</h2>
        <p className="admin-page__lead">Link students to courses.</p>
      </header>

      {error ? <p className="admin-page__error">{error}</p> : null}
      {loading ? <p className="admin-page__lead">Loading…</p> : null}

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setCreating(true)}>
          New enrollment
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.student_name}</td>
                <td>{row.course_title}</td>
                <td>{formatDate(row.enrolled_at)}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditing(row)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={async () => {
                        if (!window.confirm(`Remove enrollment for ${row.student_name}?`)) return
                        try {
                          await enrollmentsService.deleteEnrollment(row.id)
                          load()
                        } catch (e) {
                          setError(e.message || 'Delete failed')
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EnrollmentFormModal
        isOpen={creating}
        title="New enrollment"
        students={students}
        courses={courses}
        onClose={() => setCreating(false)}
        onSubmit={async (body) => {
          await enrollmentsService.createEnrollment(body)
          setCreating(false)
          load()
        }}
        onError={(msg) => setError(msg)}
      />

      <EnrollmentFormModal
        isOpen={Boolean(editing)}
        title="Edit enrollment"
        students={students}
        courses={courses}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={async (body) => {
          if (!editing) return
          await enrollmentsService.updateEnrollment(editing.id, body)
          setEditing(null)
          load()
        }}
        onError={(msg) => setError(msg)}
      />
    </article>
  )
}
