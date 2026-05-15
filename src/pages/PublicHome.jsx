import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchMe,
  loginJwt,
  logout,
  portalPathForRole,
} from "../services/authService";
import "./PublicHome.css";

const SCHOOL_MOTTO = "Learn with purpose. Lead with integrity.";

export function PublicHome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("regular");
  const [authError, setAuthError] = useState("");
  const activated = searchParams.get("activated") === "1";

  const isAdmin = activeTab === "admin";

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

            <div
              className="sis-home__tabs"
              role="tablist"
              aria-label="Sign in type"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "regular"}
                className={`sis-home__tab${activeTab === "regular" ? " sis-home__tab--active" : ""}`}
                onClick={() => {
                  setActiveTab("regular");
                  setAuthError("");
                }}
              >
                Regular users
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "admin"}
                className={`sis-home__tab${activeTab === "admin" ? " sis-home__tab--active" : ""}`}
                onClick={() => {
                  setActiveTab("admin");
                  setAuthError("");
                }}
              >
                Administrator
              </button>
            </div>

            <form
              className="sis-home__form"
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthError("");
                const fd = new FormData(e.currentTarget);
                const email = String(fd.get("email") || "").trim();
                const password = String(fd.get("password") || "");
                if (!email || !password) {
                  setAuthError("Email and password are required.");
                  return;
                }
                try {
                  await loginJwt(email, password);
                  const me = await fetchMe();
                  if (isAdmin && me.role !== "admin") {
                    logout();
                    setAuthError("That account is not an administrator.");
                    return;
                  }
                  navigate(portalPathForRole(me.role));
                } catch (err) {
                  setAuthError(err.message || "Sign-in failed.");
                }
              }}
            >
              {activated ? (
                <p className="sis-home__success" role="status">
                  Your email is verified. You can sign in below.
                </p>
              ) : null}
              {authError ? (
                <p className="sis-home__error">{authError}</p>
              ) : null}

              <label className="sis-home__label">
                Email
                <input
                  className="sis-home__input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="sis-home__label">
                Password
                <input
                  className="sis-home__input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button type="submit" className="sis-home__submit">
                Sign in
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
