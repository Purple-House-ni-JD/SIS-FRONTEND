import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPortalPath } from '../data/portalConfig'
import './PublicHome.css'

const SCHOOL_MOTTO = 'Learn with purpose. Lead with integrity.'

export function PublicHome() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('regular')
  const [selectedRole, setSelectedRole] = useState('instructor')

  const isAdmin = activeTab === 'admin'

  return (
    <div className="sis-home">
      <div className="sis-home__split">
        <header className="sis-home__intro">
          <p className="sis-home__eyebrow">Student Information System</p>
          <h1 className="sis-home__title">{SCHOOL_MOTTO}</h1>
        </header>

        <section className="sis-home__auth" aria-labelledby="sign-in-heading">
          <div className="sis-home__auth-card">
            <h2 id="sign-in-heading" className="sis-home__auth-title">
              Sign in
            </h2>

            <div className="sis-home__tabs" role="tablist" aria-label="Sign in type">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'regular'}
                className={`sis-home__tab${activeTab === 'regular' ? ' sis-home__tab--active' : ''}`}
                onClick={() => setActiveTab('regular')}
              >
                Regular users
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'admin'}
                className={`sis-home__tab${activeTab === 'admin' ? ' sis-home__tab--active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                Administrator
              </button>
            </div>

            <form
              className="sis-home__form"
              onSubmit={(e) => {
                e.preventDefault()
                navigate(isAdmin ? '/admin' : getPortalPath(selectedRole))
              }}
            >
              {!isAdmin ? (
                <label className="sis-home__label">
                  Role
                  <select
                    className="sis-home__input"
                    name="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                  </select>
                </label>
              ) : null}

              <label className="sis-home__label">
                Username
                <input className="sis-home__input" name="username" type="text" autoComplete="username" />
              </label>

              <label className="sis-home__label">
                Password
                <input className="sis-home__input" name="password" type="password" autoComplete="current-password" />
              </label>

              <button type="submit" className="sis-home__submit">
                Sign in
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
