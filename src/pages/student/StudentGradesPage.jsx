import { useCallback, useState } from 'react'
import { PortalGrid, PortalKeyValueList, PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'
import { unwrapList } from '../../lib/apiClient'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as coursesService from '../../services/coursesService'
import * as authService from '../../services/authService'
import * as gradesService from '../../services/gradesService'
import { formatDate } from '../../lib/formatDate'

const courseColumns = [
  { key: 'code', label: 'Code' },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'instructor_name', label: 'Instructor' },
]

const gradeColumns = [
  { key: 'course_title', label: 'Course' },
  { key: 'score', label: 'Score' },
  { key: 'remarks', label: 'Remarks' },
  {
    key: 'updated_at',
    label: 'Updated',
    render: (row) => formatDate(row.updated_at),
  },
]

export function StudentGradesPage() {
  const [me, setMe] = useState(null)
  const [rows, setRows] = useState([])
  const [grades, setGrades] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [user, courseData, gradeData] = await Promise.all([
        authService.fetchMe(),
        coursesService.listCourses(),
        gradesService.listGrades(),
      ])
      setMe(user)
      setRows(unwrapList(courseData))
      setGrades(unwrapList(gradeData))
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const sp = me?.student_profile
  const summaryItems = me
    ? [
        { label: 'Student ID', value: sp?.student_id ?? '—' },
        { label: 'Program', value: sp?.program ?? '—' },
        { label: 'Year level', value: sp?.year_level != null ? String(sp.year_level) : '—' },
      ]
    : []

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Student"
        title="My courses & grades"
        description="Enrolled courses and posted grades for your account."
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalGrid>
        <PortalSection title="Student profile" description="From your account record.">
          <PortalKeyValueList items={summaryItems} />
        </PortalSection>

        <PortalSection title="Account" description="Signed in as">
          <PortalKeyValueList items={me ? [{ label: 'Name', value: userDisplayName(me) }, { label: 'Email', value: me.email || '—' }] : []} />
        </PortalSection>
      </PortalGrid>

      <PortalSection title="Enrolled courses" description="Read-only course list.">
        <PortalTable columns={courseColumns} rows={rows} />
      </PortalSection>

      <PortalSection title="My grades" description="Scores posted by instructors for your enrollments.">
        <PortalTable columns={gradeColumns} rows={grades} />
      </PortalSection>
    </article>
  )
}
