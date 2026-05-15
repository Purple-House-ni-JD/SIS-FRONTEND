import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'

const gradeRows = [
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
    course_title: 'CS201 - Data Structures',
    score: '88',
    remarks: 'Passed',
    updated_at: '2026-05-11',
  },
  {
    id: 3,
    enrollment: 'ENR-2026-009',
    student_name: 'Mika Rivera',
    course_title: 'IT204 - Web Systems',
    score: '82',
    remarks: 'Passed',
    updated_at: '2026-05-12',
  },
]

const profileItems = [
  { label: 'Employee ID', value: 'EMP-204' },
  { label: 'Department', value: 'School of Computing' },
  { label: 'Role', value: 'Instructor' },
]

export function StaffGradingPage() {
  const [editingGrade, setEditingGrade] = useState(null)

  const columns = [
    { key: 'student_name', label: 'Student' },
    { key: 'course_title', label: 'Course' },
    { key: 'score', label: 'Score' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'updated_at', label: 'Updated at' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button type="button" className="portal-link portal-link--button" onClick={() => setEditingGrade(row)}>
          Edit
        </button>
      ),
    },
  ]

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Gradebook"
        description="Instructor grade view aligned with the backend grade serializer and instructor-only grading rules."
      />

      <PortalGrid>
        <PortalSection title="Instructor profile" description="Fields aligned with the instructor profile model.">
          <PortalKeyValueList items={profileItems} />
        </PortalSection>

        <PortalSection title="Advisory note" description="Frontend aligned to instructor grade permissions.">
          <p className="portal-note">
            The backend grade logic only allows instructors to see and update grades for students in their own courses, so this page
            is organized as a gradebook instead of a general course list.
          </p>
        </PortalSection>
      </PortalGrid>

      <PortalSection title="Managed grades" description="Grade records for instructor-owned courses.">
        <PortalTable columns={columns} rows={gradeRows} />
      </PortalSection>

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
              <textarea className="static-modal__textarea" defaultValue={editingGrade.remarks} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
