import { useCallback, useState } from 'react'
import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as authService from '../../services/authService'

export function StudentProfilePage() {
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

  const sp = me?.student_profile
  const profileItems = me
    ? [
        { label: 'Student name', value: userDisplayName(me) },
        { label: 'Student ID', value: sp?.student_id ?? '—' },
        { label: 'Program', value: sp?.program ?? '—' },
        { label: 'Year level', value: sp?.year_level != null ? String(sp.year_level) : '—' },
      ]
    : []

  const contactItems = me ? [{ label: 'Email', value: me.email || '—' }] : []

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="Profile"
        description="Information returned for your account from the API."
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalGrid>
        <PortalSection title="Academic profile" description="School identity from your student profile.">
          <PortalKeyValueList items={profileItems} />
        </PortalSection>

        <PortalSection title="Contact" description="Account email.">
          <PortalKeyValueList items={contactItems} />
        </PortalSection>
      </PortalGrid>
    </article>
  )
}
