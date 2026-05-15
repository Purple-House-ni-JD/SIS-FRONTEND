import { useCallback, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as authService from '../../services/authService'
import * as coursesService from '../../services/coursesService'

export function StaffGradingPage() {
  const [me, setMe] = useState(null)
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [user, courseData] = await Promise.all([authService.fetchMe(), coursesService.listCourses()])
      setMe(user)
      setRows(unwrapList(courseData))
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const ip = me?.instructor_profile
  const profileItems = me
    ? [
        { label: 'Employee ID', value: ip?.employee_id ?? '—' },
        { label: 'Department', value: ip?.department ?? '—' },
        { label: 'Role', value: me.role === 'instructor' ? 'Instructor' : me.role },
      ]
    : []

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'created_at',
      label: 'Created at',
      render: (row) => formatDate(row.created_at),
    },
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
        title="Courses"
        description="Courses assigned to you from the API."
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalGrid>
        <PortalSection title="Instructor profile" description="From your account record.">
          <PortalKeyValueList items={profileItems} />
        </PortalSection>

        <PortalSection title="Account" description="Signed in as">
          <PortalKeyValueList items={me ? [{ label: 'Name', value: userDisplayName(me) }, { label: 'Email', value: me.email || '—' }] : []} />
        </PortalSection>
      </PortalGrid>

      <PortalSection title="Assigned courses" description="You can update code, title, and description for your courses.">
        <PortalTable columns={columns} rows={rows} />
      </PortalSection>

      <EditModal
        isOpen={Boolean(editingCourse)}
        title={editingCourse ? `Edit ${editingCourse.code}` : 'Edit course'}
        onClose={() => setEditingCourse(null)}
        onSubmit={async (e) => {
          if (!editingCourse) return
          const fd = new FormData(e.currentTarget)
          try {
            await coursesService.updateCourse(editingCourse.id, {
              code: String(fd.get('code') || '').trim(),
              title: String(fd.get('title') || '').trim(),
              description: String(fd.get('description') || ''),
            })
            setEditingCourse(null)
            load()
          } catch (err) {
            setError(err.message || 'Save failed')
          }
        }}
      >
        {editingGrade ? (
          <>
            <label className="static-modal__label">
              Code
              <input className="static-modal__input" name="code" defaultValue={editingCourse.code} required />
            </label>
            <label className="static-modal__label">
              Title
              <input className="static-modal__input" name="title" defaultValue={editingCourse.title} required />
            </label>
            <label className="static-modal__label">
              Description
              <textarea className="static-modal__textarea" name="description" rows={3} defaultValue={editingCourse.description || ''} />
            </label>
          </>
        ) : null}
      </EditModal>
    </article>
  )
}
