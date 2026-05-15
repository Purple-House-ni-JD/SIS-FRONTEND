import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PortalGrid,
  PortalList,
  PortalMetricGrid,
  PortalPageHeader,
  PortalSection,
} from '../../components/portal/PortalComponents'
import { unwrapList } from '../../lib/apiClient'
import * as announcementsService from '../../services/announcementsService'
import * as authService from '../../services/authService'
import * as coursesService from '../../services/coursesService'
import { useMountLoad } from '../../lib/useMountLoad'

export function StaffDashboard() {
  const [me, setMe] = useState(null)
  const [courses, setCourses] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [user, c, a] = await Promise.all([
        authService.fetchMe(),
        coursesService.listCourses(),
        announcementsService.listAnnouncements(),
      ])
      setMe(user)
      setCourses(unwrapList(c))
      setAnnouncements(unwrapList(a))
    } catch (e) {
      setError(e.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const dept = me?.instructor_profile?.department ?? '—'
  const summary = [
    { label: 'Assigned courses', value: String(courses.length), hint: 'Courses where you are the instructor of record.' },
    { label: 'Announcements', value: String(announcements.length), hint: 'Posts visible to you.' },
    { label: 'Department', value: dept, hint: 'From your instructor profile.' },
  ]

  const courseLoad = courses.map((c) => ({
    id: c.id,
    title: `${c.code} — ${c.title}`,
    meta: c.description ? `Description: ${c.description}` : 'No description',
    status: 'Active',
  }))

  const tasks = [
    { id: 1, title: 'Review enrollments', body: 'Check which students are enrolled in your assigned courses.' },
    { id: 2, title: 'Update course descriptions', body: 'Keep course information aligned with the backend course records.' },
    { id: 3, title: 'Post announcement', body: 'Create a class update for your students.' },
  ]

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Instructor dashboard"
        description="Overview loaded from your account, courses, and announcements."
        actions={
          <Link to="/instructor/grades" className="portal-link">
            Open gradebook
          </Link>
        }
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalMetricGrid items={summary} />

      <PortalGrid>
        <PortalSection title="Assigned courses" description="From the course endpoint.">
          <PortalList
            items={courseLoad}
            renderItem={(item) => (
              <>
                <div className="portal-item__title-row">
                  <h4 className="portal-item__title">{item.title}</h4>
                  <span className="portal-chip portal-chip--blue">{item.status}</span>
                </div>
                <p className="portal-item__meta">{item.meta}</p>
              </>
            )}
          />
        </PortalSection>

        <PortalSection title="Tasks" description="Quick prompts.">
          <PortalList
            items={tasks}
            renderItem={(item) => (
              <>
                <h4 className="portal-item__title">{item.title}</h4>
                <p className="portal-item__body">{item.body}</p>
              </>
            )}
          />
        </PortalSection>
      </PortalGrid>
    </article>
  )
}
