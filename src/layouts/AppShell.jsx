import { Link, NavLink, Outlet } from 'react-router-dom'
import './AppShell.css'

export function AppShell({ portal, title, nav }) {
  return (
    <div className={`sis-shell sis-shell--${portal}`}>
      <aside className="sis-shell__aside" aria-label="Main navigation">
        <div className="sis-shell__brand">
          <span className="sis-shell__mark" aria-hidden="true" />
          <div>
            <p className="sis-shell__product">SIS</p>
            <p className="sis-shell__portal">{title}</p>
          </div>
        </div>
        <nav className="sis-shell__nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sis-shell__link${isActive ? ' sis-shell__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="sis-shell__logout">
          Logout
        </Link>
      </aside>

      <div className="sis-shell__main">
        <header className="sis-shell__topbar">
          <h1 className="sis-shell__page-title">{title} portal</h1>
        </header>
        <main className="sis-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
