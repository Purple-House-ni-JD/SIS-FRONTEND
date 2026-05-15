import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { activateAccount } from '../services/authService'
import './PublicHome.css'

export function ActivateAccountPage() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  return (
    <div className="sis-home">
      <div className="sis-home__split">
        <header className="sis-home__intro">
          <p className="sis-home__eyebrow">Student Information System</p>
          <h1 className="sis-home__title">Activate your account</h1>
          <p className="sis-home__subtitle">
            Confirm your email and set your password. You may also update how your name appears in the portal.
          </p>
        </header>

        <section className="sis-home__auth" aria-labelledby="activate-heading">
          <div className="sis-home__auth-card">
            <h2 id="activate-heading" className="sis-home__auth-title">
              Your details
            </h2>

            <form
              className="sis-home__form"
              onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                const fd = new FormData(e.currentTarget)
                try {
                  await activateAccount({
                    uid: uid || '',
                    token: token || '',
                    password: String(fd.get('password') || ''),
                    re_password: String(fd.get('re_password') || ''),
                    first_name: String(fd.get('first_name') || '').trim(),
                    last_name: String(fd.get('last_name') || '').trim(),
                  })
                  navigate('/?activated=1', { replace: true })
                } catch (err) {
                  setError(err.message || 'Activation failed.')
                }
              }}
            >
              {error ? <p className="sis-home__error">{error}</p> : null}

              <label className="sis-home__label">
                First name
                <input className="sis-home__input" name="first_name" autoComplete="given-name" />
              </label>
              <label className="sis-home__label">
                Last name
                <input className="sis-home__input" name="last_name" autoComplete="family-name" />
              </label>
              <label className="sis-home__label">
                Password
                <input className="sis-home__input" name="password" type="password" autoComplete="new-password" />
              </label>
              <label className="sis-home__label">
                Confirm password
                <input className="sis-home__input" name="re_password" type="password" autoComplete="new-password" />
              </label>
              <p className="sis-home__lead">If you already have a password on this account, leave the password fields blank unless you want to change it.</p>

              <button type="submit" className="sis-home__submit">
                Verify and continue
              </button>
            </form>

            <p className="sis-home__footer-link">
              <Link to="/">Back to sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
