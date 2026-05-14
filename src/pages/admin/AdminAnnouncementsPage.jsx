import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import './adminPages.css'

const SAMPLE_ANNOUNCEMENTS = [
  { id: 1, title: 'Enrollment period', author: 'Registrar', date: '2026-05-01' },
  { id: 2, title: 'Campus maintenance', author: 'Admin', date: '2026-05-08' },
]

export function AdminAnnouncementsPage() {
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)

  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">Announcements</h2>
        <p className="admin-page__lead">Simple announcement view aligned with backend title, content, created_by, and created_at fields.</p>
      </header>

      <div className="admin-toolbar">
        <button type="button" className="admin-btn admin-btn--primary">
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
            {SAMPLE_ANNOUNCEMENTS.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author}</td>
                <td>{a.date}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setEditingAnnouncement(a)}
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
        isOpen={Boolean(editingAnnouncement)}
        title={editingAnnouncement ? `Edit ${editingAnnouncement.title}` : 'Edit announcement'}
        onClose={() => setEditingAnnouncement(null)}
        onSubmit={() => setEditingAnnouncement(null)}
      >
        {editingAnnouncement ? (
          <>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" defaultValue={editingAnnouncement.title} />
            </label>
            <label className="static-modal__label">
              Created by
              <input className="static-modal__input" defaultValue={editingAnnouncement.author} />
            </label>
            <label className="static-modal__label">
              Content
              <textarea
                className="static-modal__textarea"
                defaultValue={`Announcement preview for ${editingAnnouncement.title}.`}
              />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
