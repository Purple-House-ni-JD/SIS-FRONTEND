import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection } from '../../components/portal/PortalComponents'

const profileItems = [
  { label: 'Student name', value: 'Ana Reyes' },
  { label: 'Student ID', value: '2026-00124' },
  { label: 'Program', value: 'BS Information Technology' },
  { label: 'Year level', value: '2' },
]

const contactItems = [
  { label: 'Email', value: 'ana.reyes@school.edu' },
  { label: 'Mobile', value: '+63 912 345 6789' },
  { label: 'Guardian', value: 'Marissa Reyes' },
  { label: 'Emergency contact', value: '+63 917 111 2233' },
]

export function StudentProfilePage() {
  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="Profile"
        description="Simple profile view aligned with the backend student profile fields."
      />

      <PortalGrid>
        <PortalSection title="Academic profile" description="School identity and enrollment details.">
          <PortalKeyValueList items={profileItems} />
        </PortalSection>

        <PortalSection title="Contact details" description="Useful for notices and coordination.">
          <PortalKeyValueList items={contactItems} />
        </PortalSection>
      </PortalGrid>
    </article>
  )
}
