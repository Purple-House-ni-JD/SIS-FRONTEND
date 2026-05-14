import { Link } from 'react-router-dom'
import {
  PortalGrid,
  PortalList,
  PortalMetricGrid,
  PortalPageHeader,
  PortalSection,
} from '../../components/portal/PortalComponents'

const summary = [
  { label: 'Enrolled courses', value: '3', hint: 'Based on current enrollment records.' },
  { label: 'Posted grades', value: '2', hint: 'Courses with recorded grade entries.' },
  { label: 'Announcements', value: '3', hint: 'Latest school announcements.' },
]

const enrolledCourses = [
  { id: 1, title: 'CS201 - Data Structures', meta: 'Instructor: Marco Santos', room: 'Enrolled' },
  { id: 2, title: 'MATH122 - Discrete Mathematics', meta: 'Instructor: Lea Ramos', room: 'Enrolled' },
  { id: 3, title: 'ENG210 - Technical Writing', meta: 'Instructor: Anne Cruz', room: 'Enrolled' },
]

const reminders = [
  { id: 1, title: 'Check announcements', body: 'Review the latest school updates from the portal.' },
  { id: 2, title: 'Review course list', body: 'Make sure your enrolled subjects match your registration.' },
  { id: 3, title: 'Update profile', body: 'Keep your student profile information complete.' },
]

export function StudentDashboard() {
  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="Student dashboard"
        description="Simple student view based on backend records for enrollments, grades, profile data, and announcements."
        actions={
          <Link to="/student/courses" className="portal-link">
            View my courses
          </Link>
        }
      />

      <PortalMetricGrid items={summary} />

      <PortalGrid>
        <PortalSection title="Enrolled courses" description="Sample course records using backend course fields.">
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

        <PortalSection title="Reminders" description="Simple placeholders for student-side actions.">
          <PortalList
            items={reminders}
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
