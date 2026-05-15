import { useCallback, useMemo, useState } from 'react'
import { EditModal } from '../../components/common/EditModal'
import { PortalPageHeader, PortalSection, PortalTable } from '../../components/portal/PortalComponents'
import { unwrapList } from '../../lib/apiClient'
import { formatDate } from '../../lib/formatDate'
import { userDisplayName } from '../../lib/userDisplay'
import { useMountLoad } from '../../lib/useMountLoad'
import * as coursesService from '../../services/coursesService'
import * as enrollmentsService from '../../services/enrollmentsService'
import * as gradesService from '../../services/gradesService'
import * as usersService from '../../services/usersService'

function EnrollmentModal({ isOpen, students, courses, onClose, onSubmit, onError }) {
  return (
    <EditModal
      isOpen={isOpen}
      title="Enroll student"
      onClose={onClose}
      onSubmit={async (e) => {
        const fd = new FormData(e.currentTarget)
        try {
          await onSubmit({
            student: Number(fd.get('student')),
            course: Number(fd.get('course')),
          })
        } catch (err) {
          onError(err.message || 'Enrollment failed')
        }
      }}
    >
      <label className="static-modal__label">
        Student
        <select className="static-modal__select" name="student" required defaultValue="">
          <option value="" disabled>
            Select student
          </option>
          {students.map((u) => (
            <option key={u.id} value={u.id}>
              {userDisplayName(u)}
            </option>
          ))}
        </select>
      </label>
      <label className="static-modal__label">
        Course
        <select className="static-modal__select" name="course" required defaultValue="">
          <option value="" disabled>
            Select course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      </label>
    </EditModal>
  )
}

function GradeModal({ isOpen, title, enrollment, initial, onClose, onSubmit, onError }) {
  return (
    <EditModal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onSubmit={async (e) => {
        const fd = new FormData(e.currentTarget)
        const body = {
          score: Number(fd.get('score')),
          remarks: String(fd.get('remarks') || '').trim(),
        }
        if (!initial && enrollment) {
          body.enrollment = enrollment.id
        }
        try {
          await onSubmit(body)
        } catch (err) {
          onError(err.message || 'Save failed')
        }
      }}
    >
      {enrollment ? (
        <p className="portal-page__description">
          {enrollment.student_name} — {enrollment.course_title}
        </p>
      ) : null}
      <label className="static-modal__label">
        Score
        <input
          className="static-modal__input"
          name="score"
          type="number"
          step="0.01"
          min="0"
          max="100"
          required
          defaultValue={initial?.score ?? ''}
        />
      </label>
      <label className="static-modal__label">
        Remarks
        <input className="static-modal__input" name="remarks" maxLength={50} required defaultValue={initial?.remarks ?? ''} />
      </label>
    </EditModal>
  )
}

export function StaffGradesPage() {
  const [enrollments, setEnrollments] = useState([])
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [gradingEnrollment, setGradingEnrollment] = useState(null)
  const [editingGrade, setEditingGrade] = useState(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const [enrollmentData, gradeData, userData, courseData] = await Promise.all([
        enrollmentsService.listEnrollments(),
        gradesService.listGrades(),
        usersService.listUsers(),
        coursesService.listCourses(),
      ])
      setEnrollments(unwrapList(enrollmentData))
      setGrades(unwrapList(gradeData))
      setStudents(unwrapList(userData))
      setCourses(unwrapList(courseData))
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useMountLoad(load)

  const gradeByEnrollment = useMemo(() => {
    const map = new Map()
    for (const g of grades) {
      map.set(g.enrollment, g)
    }
    return map
  }, [grades])

  const rows = useMemo(
    () =>
      enrollments.map((e) => ({
        ...e,
        grade: gradeByEnrollment.get(e.id) ?? null,
      })),
    [enrollments, gradeByEnrollment],
  )

  const columns = [
    { key: 'student_name', label: 'Student' },
    { key: 'course_title', label: 'Course' },
    {
      key: 'enrolled_at',
      label: 'Enrolled',
      render: (row) => formatDate(row.enrolled_at),
    },
    {
      key: 'score',
      label: 'Score',
      render: (row) => (row.grade ? row.grade.score : '—'),
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (row) => (row.grade ? row.grade.remarks : '—'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          {row.grade ? (
            <button type="button" className="portal-link portal-link--button" onClick={() => setEditingGrade(row.grade)}>
              Edit grade
            </button>
          ) : (
            <button type="button" className="portal-link portal-link--button" onClick={() => setGradingEnrollment(row)}>
              Add grade
            </button>
          )}
          <button
            type="button"
            className="portal-link portal-link--button"
            onClick={async () => {
              if (!window.confirm(`Remove ${row.student_name} from this course?`)) return
              try {
                await enrollmentsService.deleteEnrollment(row.id)
                load()
              } catch (e) {
                setError(e.message || 'Remove failed')
              }
            }}
          >
            Unenroll
          </button>
        </>
      ),
    },
  ]

  return (
    <article className="portal-page">
      <PortalPageHeader
        eyebrow="Instructor"
        title="Enrollments & grades"
        description="Enroll students in your courses and record grades for your classes."
      />

      {error ? <p className="portal-page__error">{error}</p> : null}
      {loading ? <p className="portal-page__description">Loading…</p> : null}

      <PortalSection
        title="Your enrollments"
        description="Students enrolled in courses you teach."
        action={
          <button type="button" className="portal-link portal-link--button" onClick={() => setEnrolling(true)}>
            Enroll student
          </button>
        }
      >
        <PortalTable columns={columns} rows={rows} />
      </PortalSection>

      <EnrollmentModal
        isOpen={enrolling}
        students={students}
        courses={courses}
        onClose={() => setEnrolling(false)}
        onSubmit={async (body) => {
          await enrollmentsService.createEnrollment(body)
          setEnrolling(false)
          load()
        }}
        onError={(msg) => setError(msg)}
      />

      <GradeModal
        isOpen={Boolean(gradingEnrollment)}
        title="Add grade"
        enrollment={gradingEnrollment}
        onClose={() => setGradingEnrollment(null)}
        onSubmit={async (body) => {
          await gradesService.createGrade(body)
          setGradingEnrollment(null)
          load()
        }}
        onError={(msg) => setError(msg)}
      />

      <GradeModal
        isOpen={Boolean(editingGrade)}
        title="Edit grade"
        initial={editingGrade}
        onClose={() => setEditingGrade(null)}
        onSubmit={async (body) => {
          if (!editingGrade) return
          await gradesService.updateGrade(editingGrade.id, body)
          setEditingGrade(null)
          load()
        }}
        onError={(msg) => setError(msg)}
      />
    </article>
  )
}
