import { Navigate } from "react-router-dom";
import { getCachedMe } from "../services/authService";
import { AppShell } from "../layouts/AppShell";

const ROLE_MAP = {
  admin: "admin",
  instructor: "instructor",
  student: "student",
};

export function ProtectedPortal({ portal, title, nav }) {
  const user = getCachedMe();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== ROLE_MAP[portal]) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Access Denied</h1>
          <p>You do not have permission to access the {portal} portal.</p>
        </div>
      </div>
    );
  }

  return <AppShell portal={portal} title={title} nav={nav} />;
}
