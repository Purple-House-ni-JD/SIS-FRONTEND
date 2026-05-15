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
import * as coursesService from '../../services/coursesService'
import * as gradesService from '../../services/gradesService'
import { useMountLoad } from '../../lib/useMountLoad'

export function StudentDashboard() {
  const [courses, setCourses] = useState([])
  const [grades, setGrades] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [c, g, a] = await Promise.all([
        coursesService.listCourses(),
        gradesService.listGrades(),
        announcementsService.listAnnouncements(),
      ])
      setCourses(unwrapList(c))
      setGrades(unwrapList(g))
      setAnnouncements(unwrapList(a))
    } catch (e) {
      setError(e.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const summary = [
    { label: 'Enrolled courses', value: String(courses.length), hint: 'Courses linked to your enrollments.' },
    { label: 'Posted grades', value: String(grades.length), hint: 'Grade rows visible to you.' },
    { label: 'Announcements', value: String(announcements.length), hint: 'Posts in the feed.' },
  ]

  const enrolledCourses = courses.map((c) => ({
    id: c.id,
    title: `${c.code} — ${c.title}`,
    meta: `Instructor: ${c.instructor_name}`,
    room: 'Enrolled',
  }))

  const gradeItems = grades.map((g) => ({
    id: g.id,
    title: g.course_title,
    meta: `Score: ${g.score} · ${g.remarks}`,
    room: 'Graded',
  }))

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="Student dashboard"
        description="Counts and lists loaded from the API for your account."
        actions={
          <Link to="/student/courses" className="portal-link">
            Courses & grades
          </Link>
        }
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalMetricGrid items={summary} />

      <PortalGrid>
        <PortalSection title="Enrolled courses" description="From the course endpoint.">
          <PortalList
            items={enrolledCourses}
            renderItem={(item) => (
              <>
                <div className="portal-item__title-row">
                  <h4 className="portal-item__title">{item.title}</h4>
                  <span className="portal-chip portal-chip--blue">{item.room}</span>
                </div>
                <p className="portal-item__meta">{item.meta}</p>
              </>
            )}
          />
        </PortalSection>

        <PortalSection title="Posted grades" description="Latest grades visible to you.">
          {gradeItems.length ? (
            <PortalList
              items={gradeItems}
              renderItem={(item) => (
                <>
                  <div className="portal-item__title-row">
                    <h4 className="portal-item__title">{item.title}</h4>
                    <span className="portal-chip portal-chip--green">{item.room}</span>
                  </div>
                  <p className="portal-item__meta">{item.meta}</p>
                </>
              )}
            />
          ) : (
            <p className="portal-page__description">No grades posted yet.</p>
          )}
        </PortalSection>
      </PortalGrid>
    </article>
  )
}
