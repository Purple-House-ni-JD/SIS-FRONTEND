import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { useMountLoad } from '../../lib/useMountLoad'
import * as announcementsService from '../../services/announcementsService'
import './adminPages.css'

export function AdminAnnouncementsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await announcementsService.listAnnouncements()
      setRows(unwrapList(data))
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
        <h2 className="admin-page__title">Announcements</h2>
        <p className="admin-page__lead">School announcements from the API.</p>
      </header>

      {error ? <p className="admin-page__error">{error}</p> : null}
      {loading ? <p className="admin-page__lead">Loading…</p> : null}

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setCreating(true)}>
          New announcement
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created by</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.created_by_name}</td>
                <td>{formatDate(a.created_at)}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditing(a)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={async () => {
                        if (!window.confirm(`Delete “${a.title}”?`)) return
                        try {
                          await announcementsService.deleteAnnouncement(a.id)
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
        isOpen={Boolean(editing)}
        title={editing ? `Edit ${editing.title}` : 'Edit announcement'}
        onClose={() => setEditing(null)}
        onSubmit={async (e) => {
          if (!editing) return
          const fd = new FormData(e.currentTarget)
          try {
            await announcementsService.updateAnnouncement(editing.id, {
              title: String(fd.get('title') || '').trim(),
              content: String(fd.get('content') || ''),
            })
            setEditing(null)
            load()
          } catch (err) {
            setError(err.message || 'Save failed')
          }
        }}
      >
        {editing ? (
          <>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" name="title" defaultValue={editing.title} required />
            </label>
            <label className="static-modal__label">
              Content
              <textarea className="static-modal__textarea" name="content" rows={4} defaultValue={editing.content} required />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
