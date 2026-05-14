import { PortalList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'

const announcements = [
  {
    id: 1,
    title: 'Midterm examination week',
    date: 'May 20, 2026',
    audience: 'All students',
    body: 'Class schedules remain in effect, but room assignments for exams will be posted two days before the first testing date.',
  },
  {
    id: 2,
    title: 'Library account activation',
    date: 'May 16, 2026',
    audience: 'Freshmen',
    body: 'Bring your school ID to the library help desk to activate borrowing privileges and online journal access.',
  },
  {
    id: 3,
    title: 'Scholarship renewal checklist',
    date: 'May 14, 2026',
    audience: 'Grant recipients',
    body: 'Submit your completed renewal forms to Student Affairs before the deadline to avoid delays in release of benefits.',
  },
]

export function StudentAnnouncementsPage() {
  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="Announcements"
        description="Important campus updates, deadlines, and reminders relevant to student accounts."
      />

      <PortalSection title="Latest posts" description="Announcements can later be filtered by department, year level, or urgency.">
        <PortalList
          items={announcements}
          renderItem={(item) => (
            <>
              <div className="portal-item__title-row">
                <h4 className="portal-item__title">{item.title}</h4>
                <span className="portal-chip portal-chip--gold">{item.audience}</span>
              </div>
              <p className="portal-item__submeta">{item.date}</p>
              <p className="portal-item__body">{item.body}</p>
            </>
          )}
        />
      </PortalSection>
    </article>
  )
}
