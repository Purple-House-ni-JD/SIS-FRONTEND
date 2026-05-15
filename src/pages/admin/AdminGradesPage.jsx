import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import './adminPages.css'

const SAMPLE_GRADES = [
  {
    id: 1,
    enrollment: 'ENR-2026-001',
    student_name: 'Alyssa Mendoza',
    course_title: 'CS201 - Data Structures',
    score: '96',
    remarks: 'Passed',
    updated_at: '2026-05-10',
  },
  {
    id: 2,
    enrollment: 'ENR-2026-004',
    student_name: 'Joshua Tan',
    course_title: 'IT204 - Web Systems',
    score: '88',
    remarks: 'Passed',
    updated_at: '2026-05-11',
  },
  {
    id: 3,
    enrollment: 'ENR-2026-009',
    student_name: 'Mika Rivera',
    course_title: 'ENG210 - Technical Writing',
    score: '82',
    remarks: 'Passed',
    updated_at: '2026-05-12',
  },
]

export function AdminGradesPage() {
  const [editingGrade, setEditingGrade] = useState(null)

  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Grades</h2>
        <p className="admin-page__lead">
          Admin grade view aligned with the backend grade serializer for system-wide records.
        </p>
      </header>

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary">
          Record grade
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
            {SAMPLE_GRADES.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.enrollment}</td>
                <td>{grade.student_name}</td>
                <td>{grade.course_title}</td>
                <td>{grade.score}</td>
                <td>{grade.remarks}</td>
                <td>{grade.updated_at}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setEditingGrade(grade)}
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
        isOpen={Boolean(editingGrade)}
        title={editingGrade ? `Edit grade for ${editingGrade.student_name}` : 'Edit grade'}
        onClose={() => setEditingGrade(null)}
        onSubmit={() => setEditingGrade(null)}
      >
        {editingGrade ? (
          <>
            <label className="static-modal__label">
              Enrollment
              <input className="static-modal__input" defaultValue={editingGrade.enrollment} readOnly />
            </label>
            <label className="static-modal__label">
              Score
              <input className="static-modal__input" defaultValue={editingGrade.score} />
            </label>
            <label className="static-modal__label">
              Remarks
              <input className="static-modal__input" defaultValue={editingGrade.remarks} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
