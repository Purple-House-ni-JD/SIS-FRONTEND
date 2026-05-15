import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as coursesService from '../../services/coursesService'
import * as usersService from '../../services/usersService'
import './adminPages.css'

export function AdminGradesPage() {
  const [rows, setRows] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCourse, setEditingCourse] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [courseData, userData] = await Promise.all([coursesService.listCourses(), usersService.listUsers()])
      const users = unwrapList(userData)
      setRows(unwrapList(courseData))
      setInstructors(users.filter((u) => u.role === 'instructor'))
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
        <h2 className="admin-page__title">Courses</h2>
        <p className="admin-page__lead">Courses from the API. Assign an instructor by account.</p>
      </header>

      {error ? <p className="admin-page__error">{error}</p> : null}
      {loading ? <p className="admin-page__lead">Loading…</p> : null}

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setCreating(true)}>
          Add course
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Enrollment</th>
              <th>Student</th>
              <th>Course</th>
              <th>Score</th>
              <th>Remarks</th>
              <th>Updated at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.instructor_name}</td>
                <td>{formatDate(course.created_at)}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setEditingGrade(grade)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={async () => {
                        if (!window.confirm(`Delete ${course.code}?`)) return
                        try {
                          await coursesService.deleteCourse(course.id)
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

      <EditModal
        isOpen={creating}
        title="New course"
        onClose={() => setCreating(false)}
        onSubmit={async (e) => {
          const fd = new FormData(e.currentTarget)
          try {
            await coursesService.createCourse({
              code: String(fd.get('code') || '').trim(),
              title: String(fd.get('title') || '').trim(),
              description: String(fd.get('description') || ''),
              instructor: Number(fd.get('instructor')),
            })
            setCreating(false)
            load()
          } catch (err) {
            setError(err.message || 'Create failed')
          }
        }}
      >
        <label className="static-modal__label">
          Code
          <input className="static-modal__input" name="code" required />
        </label>
        <label className="static-modal__label">
          Title
          <input className="static-modal__input" name="title" required />
        </label>
        <label className="static-modal__label">
          Description
          <textarea className="static-modal__textarea" name="description" rows={3} />
        </label>
        <label className="static-modal__label">
          Instructor
          <select className="static-modal__select" name="instructor" required defaultValue="">
            <option value="" disabled>
              Select instructor
            </option>
            {instructors.map((u) => (
              <option key={u.id} value={u.id}>
                {userDisplayName(u)}
              </option>
            ))}
          </select>
        </label>
      </EditModal>

      <EditModal
        isOpen={Boolean(editingCourse)}
        title={editingCourse ? `Edit ${editingCourse.code}` : 'Edit course'}
        onClose={() => setEditingCourse(null)}
        onSubmit={async (e) => {
          if (!editingCourse) return
          const fd = new FormData(e.currentTarget)
          try {
            await coursesService.updateCourse(editingCourse.id, {
              code: String(fd.get('code') || '').trim(),
              title: String(fd.get('title') || '').trim(),
              description: String(fd.get('description') || ''),
              instructor: Number(fd.get('instructor')),
            })
            setEditingCourse(null)
            load()
          } catch (err) {
            setError(err.message || 'Save failed')
          }
        }}
      >
        {editingGrade ? (
          <>
            <label className="static-modal__label">
              Code
              <input className="static-modal__input" name="code" defaultValue={editingCourse.code} required />
            </label>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" name="title" defaultValue={editingCourse.title} required />
            </label>
            <label className="static-modal__label">
              Description
              <textarea className="static-modal__textarea" name="description" rows={3} defaultValue={editingCourse.description || ''} />
            </label>
            <label className="static-modal__label">
              Instructor
              <select className="static-modal__select" name="instructor" required defaultValue={editingCourse.instructor}>
                {instructors.map((u) => (
                  <option key={u.id} value={u.id}>
                    {userDisplayName(u)}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
