import { useCallback, useState } from 'react'
import { PortalList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { useMountLoad } from '../../lib/useMountLoad'
import * as announcementsService from '../../services/announcementsService'

export function StudentAnnouncementsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await announcementsService.listAnnouncements()
      setItems(unwrapList(data))
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="Announcements"
        description="Campus updates from the API (newest first)."
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalSection title="Latest posts" description="Posted by faculty and administrators.">
        <PortalList
          items={items}
          renderItem={(item) => (
            <>
              <div className="portal-item__title-row">
                <h4 className="portal-item__title">{item.title}</h4>
                <span className="portal-chip portal-chip--gold">{item.created_by_name}</span>
              </div>
              <p className="portal-item__submeta">{formatDate(item.created_at)}</p>
              <p className="portal-item__body">{item.content}</p>
            </>
          )}
        />
      </PortalSection>
    </article>
  )
}
