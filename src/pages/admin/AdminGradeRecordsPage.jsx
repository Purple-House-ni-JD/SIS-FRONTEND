import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { useMountLoad } from '../../lib/useMountLoad'
import * as enrollmentsService from '../../services/enrollmentsService'
import * as gradesService from '../../services/gradesService'
import './adminPages.css'

function GradeFormModal({ isOpen, title, enrollments, initial, onClose, onSubmit, onError }) {
  const ungraded = enrollments.filter((e) => !e.hasGrade)
  const enrollmentOptions = initial ? enrollments : ungraded

  return (
    <EditModal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onSubmit={async (e) => {
        const fd = new FormData(e.currentTarget)
        const body = {
          score: Number(fd.get('score')),
          remarks: String(fd.get('remarks') || '').trim(),
        }
        if (!initial) {
          body.enrollment = Number(fd.get('enrollment'))
        }
        try {
          await onSubmit(body)
        } catch (err) {
          onError(err.message || 'Save failed')
        }
      }}
    >
      {!initial ? (
        <label className="static-modal__label">
          Enrollment
          <select className="static-modal__select" name="enrollment" required defaultValue="">
            <option value="" disabled>
              Select enrollment
            </option>
            {enrollmentOptions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.student_name} — {e.course_title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="static-modal__label">
        Score
        <input
          className="static-modal__input"
          name="score"
          type="number"
          step="0.01"
          min="0"
          max="100"
          required
          defaultValue={initial?.score ?? ''}
        />
      </label>
      <label className="static-modal__label">
        Remarks
        <input className="static-modal__input" name="remarks" maxLength={50} required defaultValue={initial?.remarks ?? ''} />
      </label>
    </EditModal>
  )
}

export function AdminGradeRecordsPage() {
  const [rows, setRows] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [gradeData, enrollmentData] = await Promise.all([
        gradesService.listGrades(),
        enrollmentsService.listEnrollments(),
      ])
      const gradeList = unwrapList(gradeData)
      const enrollmentList = unwrapList(enrollmentData)
      const gradedIds = new Set(gradeList.map((g) => g.enrollment))
      setRows(gradeList)
      setEnrollments(enrollmentList.map((e) => ({ ...e, hasGrade: gradedIds.has(e.id) })))
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
        <h2 className="admin-page__title">Grades</h2>
        <p className="admin-page__lead">Scores and remarks per enrollment.</p>
      </header>

      {error ? <p className="admin-page__error">{error}</p> : null}
      {loading ? <p className="admin-page__lead">Loading…</p> : null}

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setCreating(true)}>
          New grade
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
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.student_name}</td>
                <td>{row.course_title}</td>
                <td>{row.score}</td>
                <td>{row.remarks}</td>
                <td>{formatDate(row.updated_at)}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditing(row)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GradeFormModal
        isOpen={creating}
        title="New grade"
        enrollments={enrollments}
        onClose={() => setCreating(false)}
        onSubmit={async (body) => {
          await gradesService.createGrade(body)
          setCreating(false)
          load()
        }}
        onError={(msg) => setError(msg)}
      />

      <GradeFormModal
        isOpen={Boolean(editing)}
        title="Edit grade"
        enrollments={enrollments}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={async (body) => {
          if (!editing) return
          await gradesService.updateGrade(editing.id, body)
          setEditing(null)
          load()
        }}
        onError={(msg) => setError(msg)}
      />
    </article>
  )
}
