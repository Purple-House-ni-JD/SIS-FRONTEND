import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'

const courseRows = [
  {
    id: 1,
    code: 'CS201',
    title: 'Data Structures',
    description: 'Core programming structures and algorithms.',
    created_at: '2026-05-10',
  },
  {
    id: 2,
    code: 'IT204',
    title: 'Web Systems',
    description: 'Frontend and backend integration.',
    created_at: '2026-05-11',
  },
  {
    id: 3,
    code: 'CS202',
    title: 'Algorithms',
    description: 'Design and analysis of algorithms.',
    created_at: '2026-05-12',
  },
]

const profileItems = [
  { label: 'Employee ID', value: 'EMP-204' },
  { label: 'Department', value: 'School of Computing' },
  { label: 'Role', value: 'Instructor' },
]

export function StaffGradingPage() {
  const [editingCourse, setEditingCourse] = useState(null)

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Created at' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button type="button" className="portal-link portal-link--button" onClick={() => setEditingCourse(row)}>
          Edit
        </button>
      ),
    },
  ]

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Courses"
        description="Simple instructor course list based on the backend course serializer."
      />

      <PortalGrid>
        <PortalSection title="Instructor profile" description="Fields aligned with the instructor profile model.">
          <PortalKeyValueList items={profileItems} />
        </PortalSection>

        <PortalSection title="Advisory note" description="Static frontend for now.">
          <p className="portal-note">
            Once connected, instructors can read the courses filtered by `request.user` from the backend course viewset.
          </p>
        </PortalSection>
      </PortalGrid>

      <PortalSection title="Assigned courses" description="Read-only instructor course view.">
        <PortalTable columns={columns} rows={courseRows} />
      </PortalSection>

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
              Description
              <textarea className="static-modal__textarea" defaultValue={editingCourse.description} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
