import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'

const courseRows = [
  {
    id: 1,
    enrollment: 'ENR-2026-001',
    course_title: 'CS201 - Data Structures',
    score: '96',
    remarks: 'Passed',
    updated_at: '2026-05-10',
  },
  {
    id: 2,
    enrollment: 'ENR-2026-002',
    course_title: 'MATH122 - Discrete Mathematics',
    score: '91',
    remarks: 'Passed',
    updated_at: '2026-05-11',
  },
  {
    id: 3,
    enrollment: 'ENR-2026-003',
    course_title: 'ENG210 - Technical Writing',
    score: '89',
    remarks: 'Passed',
    updated_at: '2026-05-12',
  },
]

const summaryItems = [
  { label: 'Student ID', value: '2026-00124' },
  { label: 'Program', value: 'BS Information Technology' },
  { label: 'Posted grades', value: '3' },
]

const columns = [
  { key: 'enrollment', label: 'Enrollment' },
  { key: 'course_title', label: 'Course' },
  { key: 'score', label: 'Score' },
  { key: 'remarks', label: 'Remarks' },
  { key: 'updated_at', label: 'Updated at' },
]

export function StudentGradesPage() {
  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="My grades"
        description="Student grade view aligned with the backend grade serializer: enrollment, course_title, score, remarks, and updated_at."
      />

      <PortalGrid>
        <PortalSection title="Student profile" description="Fields aligned with the student profile model.">
          <PortalKeyValueList items={summaryItems} />
        </PortalSection>

        <PortalSection title="Advisory note" description="Frontend aligned to the backend grade implementation.">
          <p className="portal-note">
            The backend grade viewset already filters records by the logged-in student, so this page is structured to show only the
            student&apos;s own grades.
          </p>
        </PortalSection>
      </PortalGrid>

      <PortalSection title="Posted grades" description="Read-only student grade records.">
        <PortalTable columns={columns} rows={courseRows} />
      </PortalSection>
    </article>
  )
}
