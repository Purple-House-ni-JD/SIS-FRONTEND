import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'

const identityItems = [
  { label: 'Instructor name', value: 'Marco Santos' },
  { label: 'Employee ID', value: 'EMP-204' },
  { label: 'Department', value: 'School of Computing' },
  { label: 'Role', value: 'Instructor' },
]

const coordinationItems = [
  { label: 'School email', value: 'marco.santos@school.edu' },
  { label: 'Office', value: 'Faculty Room B' },
  { label: 'Consultation hours', value: 'Tue and Thu, 2:30 PM to 4:00 PM' },
  { label: 'Advisory section', value: 'BSIT 2B' },
]

export function StaffProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Profile"
        description="Simple profile view aligned with the backend instructor profile fields."
        actions={
          <button type="button" className="portal-link portal-link--button" onClick={() => setIsEditing(true)}>
            Edit profile
          </button>
        }
      />

      <PortalGrid>
        <PortalSection title="Identity details" description="Basic information attached to the instructor account.">
          <PortalKeyValueList items={identityItems} />
        </PortalSection>

        <PortalSection title="Coordination details" description="Useful for student concerns and internal communication.">
          <PortalKeyValueList items={coordinationItems} />
        </PortalSection>
      </PortalGrid>

      <EditModal
        isOpen={isEditing}
        title="Edit instructor profile"
        onClose={() => setIsEditing(false)}
        onSubmit={() => setIsEditing(false)}
      >
        <label className="static-modal__label">
          Instructor name
          <input className="static-modal__input" defaultValue="Marco Santos" />
        </label>
        <label className="static-modal__label">
          Employee ID
          <input className="static-modal__input" defaultValue="EMP-204" />
        </label>
        <label className="static-modal__label">
          Department
          <input className="static-modal__input" defaultValue="School of Computing" />
        </label>
        <label className="static-modal__label">
          School email
          <input className="static-modal__input" defaultValue="marco.santos@school.edu" />
        </label>
      </EditModal>
    </article>
  )
}
