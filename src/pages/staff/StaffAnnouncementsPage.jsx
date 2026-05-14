import { useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'

const posts = [
  {
    id: 1,
    title: 'Project consultation schedule',
    audience: 'IT204 students',
    date: 'May 14, 2026',
    body: 'Consultation slots are available this Friday afternoon.',
  },
  {
    id: 2,
    title: 'Laboratory room transfer',
    audience: 'CS201 students',
    date: 'May 13, 2026',
    body: "Tomorrow's class moves to another laboratory room.",
  },
  {
    id: 3,
    title: 'Department meeting memo',
    audience: 'Instructors',
    date: 'May 12, 2026',
    body: "Please confirm attendance for next week's department meeting.",
  },
]

export function StaffAnnouncementsPage() {
  const [editingPost, setEditingPost] = useState(null)

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Announcements"
        description="Simple announcement list based on the backend title, content, created_by, and created_at fields."
      />

      <PortalSection title="Recent posts" description="Static frontend for now.">
        <PortalList
          items={posts}
          renderItem={(item) => (
            <>
              <div className="portal-item__title-row">
                <h4 className="portal-item__title">{item.title}</h4>
                <div className="portal-item__controls">
                  <span className="portal-chip portal-chip--rose">{item.audience}</span>
                  <button
                    type="button"
                    className="portal-link portal-link--button"
                    onClick={() => setEditingPost(item)}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <p className="portal-item__submeta">{item.date}</p>
              <p className="portal-item__body">{item.body}</p>
            </>
          )}
        />
      </PortalSection>

      <EditModal
        isOpen={Boolean(editingPost)}
        title={editingPost ? `Edit ${editingPost.title}` : 'Edit announcement'}
        onClose={() => setEditingPost(null)}
        onSubmit={() => setEditingPost(null)}
      >
        {editingPost ? (
          <>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" defaultValue={editingPost.title} />
            </label>
            <label className="static-modal__label">
              Audience
              <input className="static-modal__input" defaultValue={editingPost.audience} />
            </label>
            <label className="static-modal__label">
              Content
              <textarea className="static-modal__textarea" defaultValue={editingPost.body} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
