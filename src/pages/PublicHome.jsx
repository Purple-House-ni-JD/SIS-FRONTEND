import { useNavigate } from 'react-router-dom'
import './PublicHome.css'

/** Replace with your institution’s official motto. */
const SCHOOL_MOTTO = 'Learn with purpose. Lead with integrity.'

export function PublicHome() {
  const navigate = useNavigate()

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

            <form
              className="sis-home__form"
              onSubmit={(e) => {
                e.preventDefault()
                navigate('/admin')
              }}
            >
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
