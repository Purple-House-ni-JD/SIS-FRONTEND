import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'

const courseRows = [
  {
    id: 1,
    code: 'CS201',
    title: 'Data Structures',
    description: 'Core programming structures and algorithms.',
    instructor: 'Marco Santos',
  },
  {
    id: 2,
    code: 'MATH122',
    title: 'Discrete Mathematics',
    description: 'Logic, sets, relations, and proofs.',
    instructor: 'Lea Ramos',
  },
  {
    id: 3,
    code: 'ENG210',
    title: 'Technical Writing',
    description: 'Clear documentation and formal writing.',
    instructor: 'Anne Cruz',
  },
]

const summaryItems = [
  { label: 'Student ID', value: '2026-00124' },
  { label: 'Program', value: 'BS Information Technology' },
  { label: 'Year level', value: '2' },
]

const columns = [
  { key: 'code', label: 'Code' },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'instructor', label: 'Instructor' },
]

export function StudentGradesPage() {
  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="My courses"
        description="Simple course list based on the backend course serializer fields: code, title, description, and instructor."
      />

      <PortalGrid>
        <PortalSection title="Student profile" description="Fields aligned with the student profile model.">
          <PortalKeyValueList items={summaryItems} />
        </PortalSection>

        <PortalSection title="Advisory note" description="Static frontend for now.">
          <p className="portal-note">
            When the API is connected, this page can read directly from the course list returned for the logged-in student.
          </p>
        </PortalSection>
      </PortalGrid>

      <PortalSection title="Enrolled courses" description="Read-only student course view.">
        <PortalTable columns={columns} rows={courseRows} />
      </PortalSection>
    </article>
  )
}
