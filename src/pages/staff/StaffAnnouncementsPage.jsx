import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { useMountLoad } from '../../lib/useMountLoad'
import * as announcementsService from '../../services/announcementsService'
import * as authService from '../../services/authService'
import '../admin/adminPages.css'

export function StaffAnnouncementsPage() {
  const [me, setMe] = useState(null)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [user, data] = await Promise.all([authService.fetchMe(), announcementsService.listAnnouncements()])
      setMe(user)
      setItems(unwrapList(data))
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const isAdmin = me?.role === 'admin'

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Announcements"
        description="Create and edit posts; only administrators can delete."
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalSection title="Recent posts" description="From the announcements API.">
        <div className="admin-toolbar">
          <button type="button" className="admin-btn admin-btn--primary" onClick={() => setCreating(true)}>
            New announcement
          </button>
        </div>
        <PortalList
          items={items}
          renderItem={(item) => (
            <>
              <div className="portal-item__title-row">
                <h4 className="portal-item__title">{item.title}</h4>
                <div className="portal-item__controls">
                  <span className="portal-chip portal-chip--rose">{item.created_by_name}</span>
                  <button type="button" className="portal-link portal-link--button" onClick={() => setEditingPost(item)}>
                    Edit
                  </button>
                  {isAdmin ? (
                    <button
                      type="button"
                      className="portal-link portal-link--button"
                      onClick={async () => {
                        if (!window.confirm(`Delete “${item.title}”?`)) return
                        try {
                          await announcementsService.deleteAnnouncement(item.id)
                          load()
                        } catch (e) {
                          setError(e.message || 'Delete failed')
                        }
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="portal-item__submeta">{formatDate(item.created_at)}</p>
              <p className="portal-item__body">{item.content}</p>
            </>
          )}
        />
      </PortalSection>

      <EditModal
        isOpen={creating}
        title="New announcement"
        onClose={() => setCreating(false)}
        onSubmit={async (e) => {
          const fd = new FormData(e.currentTarget)
          try {
            await announcementsService.createAnnouncement({
              title: String(fd.get('title') || '').trim(),
              content: String(fd.get('content') || ''),
            })
            setCreating(false)
            load()
          } catch (err) {
            setError(err.message || 'Create failed')
          }
        }}
      >
        <label className="static-modal__label">
          Title
          <input className="static-modal__input" name="title" required />
        </label>
        <label className="static-modal__label">
          Content
          <textarea className="static-modal__textarea" name="content" rows={4} required />
        </label>
      </EditModal>

      <EditModal
        isOpen={Boolean(editingPost)}
        title={editingPost ? `Edit ${editingPost.title}` : 'Edit announcement'}
        onClose={() => setEditingPost(null)}
        onSubmit={async (e) => {
          if (!editingPost) return
          const fd = new FormData(e.currentTarget)
          try {
            await announcementsService.updateAnnouncement(editingPost.id, {
              title: String(fd.get('title') || '').trim(),
              content: String(fd.get('content') || ''),
            })
            setEditingPost(null)
            load()
          } catch (err) {
            setError(err.message || 'Save failed')
          }
        }}
      >
        {editingPost ? (
          <>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" name="title" defaultValue={editingPost.title} required />
            </label>
            <label className="static-modal__label">
              Content
              <textarea className="static-modal__textarea" name="content" rows={4} defaultValue={editingPost.content} required />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
