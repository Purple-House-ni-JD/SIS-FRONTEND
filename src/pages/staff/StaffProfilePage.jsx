import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalGrid, PortalKeyValueList, PortalSection } from '../../components/portal/PortalComponents'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as authService from '../../services/authService'

export function StaffProfilePage() {
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const user = await authService.fetchMe()
      setMe(user)
    } catch (e) {
      setError(e.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const ip = me?.instructor_profile
  const identityItems = me
    ? [
        { label: 'Instructor name', value: userDisplayName(me) },
        { label: 'Employee ID', value: ip?.employee_id ?? '—' },
        { label: 'Department', value: ip?.department ?? '—' },
        { label: 'Role', value: me.role === 'instructor' ? 'Instructor' : me.role },
      ]
    : []

  const coordinationItems = me ? [{ label: 'School email', value: me.email || '—' }] : []

  return (
    <article className="portal-page">
      {/* <PortalPageHeader
        eyebrow="Instructor"
        title="Profile"
        description="Information from your account. Name and email can be updated here; profile IDs are managed in the database."
        actions={
          <button type="button" className="portal-link portal-link--button" onClick={() => setIsEditing(true)}>
            Edit profile
          </button>
        }
      /> */}

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalGrid>
        <PortalSection title="Identity details" description="Instructor account fields.">
          <PortalKeyValueList items={identityItems} />
        </PortalSection>

        <PortalSection title="Contact" description="Account email.">
          <PortalKeyValueList items={coordinationItems} />
        </PortalSection>
      </PortalGrid>

      <EditModal
        isOpen={isEditing}
        title="Edit instructor profile"
        onClose={() => setIsEditing(false)}
        onSubmit={async (e) => {
          const fd = new FormData(e.currentTarget)
          try {
            await authService.patchMe({
              first_name: String(fd.get('first_name') || ''),
              last_name: String(fd.get('last_name') || ''),
              email: String(fd.get('email') || ''),
            })
            await load()
            setIsEditing(false)
          } catch (err) {
            setError(err.message || 'Save failed')
          }
        }}
      >
        {me ? (
          <>
            <label className="static-modal__label">
              First name
              <input className="static-modal__input" name="first_name" defaultValue={me.first_name || ''} />
            </label>
            <label className="static-modal__label">
              Last name
              <input className="static-modal__input" name="last_name" defaultValue={me.last_name || ''} />
            </label>
            <label className="static-modal__label">
              School email
              <input className="static-modal__input" name="email" type="email" defaultValue={me.email || ''} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
