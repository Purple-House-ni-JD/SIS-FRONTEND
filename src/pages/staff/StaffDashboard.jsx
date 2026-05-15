import { Link } from 'react-router-dom'
import {
  PortalGrid,
  PortalList,
  PortalMetricGrid,
  PortalPageHeader,
  PortalSection,
} from '../../components/portal/PortalComponents'

const summary = [
  { label: 'Assigned courses', value: '3', hint: 'Courses where this instructor is assigned.' },
  { label: 'Announcements', value: '3', hint: 'Recent instructor-created announcements.' },
  { label: 'Department', value: 'Computing', hint: 'From the instructor profile.' },
]

const courseLoad = [
  { id: 1, title: 'CS201 - Data Structures', meta: 'Description: Core programming structures.', status: 'Active' },
  { id: 2, title: 'IT204 - Web Systems', meta: 'Description: Frontend and backend integration.', status: 'Active' },
  { id: 3, title: 'CS202 - Algorithms', meta: 'Description: Design and analysis of algorithms.', status: 'Active' },
]

const tasks = [
  { id: 1, title: 'Review enrollments', body: 'Check which students are enrolled in your assigned courses.' },
  { id: 2, title: 'Update course descriptions', body: 'Keep course information aligned with the backend course records.' },
  { id: 3, title: 'Post announcement', body: 'Create a simple class update for your students.' },
]

export function StaffDashboard() {
  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Instructor dashboard"
        description="Simple instructor view based on backend users, instructor profiles, courses, and announcements."
        actions={
          <Link to="/instructor/grades" className="portal-link">
            Open gradebook
          </Link>
        }
      />

      <PortalMetricGrid items={summary} />

      <PortalGrid>
        <PortalSection title="Assigned courses" description="Sample records using backend course fields.">
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

        <PortalSection title="Tasks" description="Simple instructor-side placeholders.">
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
