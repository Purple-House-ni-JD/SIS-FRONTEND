import { useCallback, useState } from "react";
import { EditModal } from "../../components/common/EditModal";
import { unwrapList } from "../../lib/apiClient";
import { userDisplayName } from "../../lib/userDisplay";
import { useMountLoad } from "../../lib/useMountLoad";
import * as usersService from "../../services/usersService";
import "./adminPages.css";

const MODAL_TABS = [
  { key: "student", label: "Student" },
  { key: "instructor", label: "Instructor" },
];

function roleClass(role) {
  if (role === "student") return "admin-tag admin-tag--student";
  if (role === "instructor") return "admin-tag admin-tag--instructor";
  return "admin-tag admin-tag--admin";
}

function ModalTabBar({ active, onChange }) {
  return (
    <div className="admin-modal-tabs" role="tablist">
      {MODAL_TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          className={`admin-modal-tab${active === t.key ? " admin-modal-tab--active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createTab, setCreateTab] = useState("account");
  const [editTab, setEditTab] = useState("account");
  const [createStudentId, setCreateStudentId] = useState("");
  const [createEmpId, setCreateEmpId] = useState("");
  const [editStudentId, setEditStudentId] = useState("");
  const [editEmpId, setEditEmpId] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await usersService.listUsers();
      setRows(unwrapList(data));
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useMountLoad(load);

  return (
    <article className="admin-page">
      <header className="admin-page__header">
        <h2 className="admin-page__title">User management</h2>
        <p className="admin-page__lead">
          Add students or instructors; an activation email is sent
          automatically. Use Generate ID for the next institution number (year +
          7 digits).
        </p>
      </header>

      {error ? <p className="admin-page__error">{error}</p> : null}
      {loading ? <p className="admin-page__lead">Loading…</p> : null}

      <div className="admin-toolbar">
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => {
            setCreateTab("student");
            setCreateStudentId("");
            setCreateEmpId("");
            setCreatingUser(true);
          }}
        >
          Add user
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{userDisplayName(u)}</td>
                <td>{u.email}</td>
                <td>
                  <span className={roleClass(u.role)}>{u.role}</span>
                </td>
                <td>
                  {u.is_verified ? (
                    <span className="admin-tag admin-tag--student">
                      Verified
                    </span>
                  ) : (
                    <span className="admin-tag admin-tag--admin">Pending</span>
                  )}
                </td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => {
                        setEditTab(u.role);
                        setEditStudentId(u.student_profile?.student_id || "");
                        setEditEmpId(u.instructor_profile?.employee_id || "");
                        setEditingUser(u);
                      }}
                    >
                      Edit
                    </button>
                    {!u.is_verified ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={async () => {
                          try {
                            await usersService.resendActivation(u.id);
                            load();
                          } catch (e) {
                            setError(e.message || "Resend failed");
                          }
                        }}
                      >
                        Resend email
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditModal
        isOpen={creatingUser}
        title="Add user"
        onClose={() => setCreatingUser(false)}
        onSubmit={async (e) => {
          const fd = new FormData(e.currentTarget);
          const role = createTab;
          const body = {
            username: String(fd.get("username") || "").trim(),
            email: String(fd.get("email") || "").trim(),
            first_name: String(fd.get("first_name") || "").trim(),
            last_name: String(fd.get("last_name") || "").trim(),
            role,
          };
          if (role === "student") {
            body.student_profile = {
              student_id:
                createStudentId.trim() ||
                String(fd.get("student_id") || "").trim(),
              program: String(fd.get("program") || "").trim(),
              year_level: Number(fd.get("year_level")),
            };
          }
          if (role === "instructor") {
            body.instructor_profile = {
              employee_id:
                createEmpId.trim() ||
                String(fd.get("employee_id") || "").trim(),
              department: String(fd.get("department") || "").trim(),
            };
          }
          try {
            await usersService.createUser(body);
            setCreatingUser(false);
            load();
          } catch (err) {
            setError(err.message || "Create failed");
          }
        }}
      >
        <ModalTabBar active={createTab} onChange={setCreateTab} />

        <div
          className={`admin-modal-panel${createTab === "student" ? " is-active" : ""}`}
        >
          <label className="static-modal__label">
            Username
            <input className="static-modal__input" name="username" required />
          </label>
          <label className="static-modal__label">
            Email
            <input
              className="static-modal__input"
              name="email"
              type="email"
              required
            />
          </label>
          <label className="static-modal__label">
            First name
            <input className="static-modal__input" name="first_name" />
          </label>
          <label className="static-modal__label">
            Last name
            <input className="static-modal__input" name="last_name" />
          </label>
          <label className="static-modal__label">
            Student ID
            <div className="admin-id-row">
              <input
                className="static-modal__input"
                name="student_id"
                value={createStudentId}
                onChange={(ev) => setCreateStudentId(ev.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={async () => {
                  try {
                    const r = await usersService.fetchNextReferenceId();
                    setCreateStudentId(r.id);
                  } catch (err) {
                    setError(err.message || "Could not generate ID");
                  }
                }}
              >
                Generate ID
              </button>
            </div>
          </label>
          <label className="static-modal__label">
            Program
            <input className="static-modal__input" name="program" />
          </label>
          <label className="static-modal__label">
            Year level
            <input
              className="static-modal__input"
              name="year_level"
              type="number"
              min={1}
              max={8}
            />
          </label>
        </div>

        <div
          className={`admin-modal-panel${createTab === "instructor" ? " is-active" : ""}`}
        >
          <label className="static-modal__label">
            Username
            <input className="static-modal__input" name="username" required />
          </label>
          <label className="static-modal__label">
            Email
            <input
              className="static-modal__input"
              name="email"
              type="email"
              required
            />
          </label>
          <label className="static-modal__label">
            First name
            <input className="static-modal__input" name="first_name" />
          </label>
          <label className="static-modal__label">
            Last name
            <input className="static-modal__input" name="last_name" />
          </label>
          <label className="static-modal__label">
            Employee ID
            <div className="admin-id-row">
              <input
                className="static-modal__input"
                name="employee_id"
                value={createEmpId}
                onChange={(ev) => setCreateEmpId(ev.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={async () => {
                  try {
                    const r = await usersService.fetchNextReferenceId();
                    setCreateEmpId(r.id);
                  } catch (err) {
                    setError(err.message || "Could not generate ID");
                  }
                }}
              >
                Generate ID
              </button>
            </div>
          </label>
          <label className="static-modal__label">
            Department
            <input className="static-modal__input" name="department" />
          </label>
        </div>
      </EditModal>

      <EditModal
        isOpen={Boolean(editingUser)}
        title={
          editingUser ? `Edit ${userDisplayName(editingUser)}` : "Edit user"
        }
        onClose={() => setEditingUser(null)}
        onSubmit={async (e) => {
          if (!editingUser) return;
          const fd = new FormData(e.currentTarget);
          const role = editingUser.role;
          const body = {
            username: String(fd.get("username") || "").trim(),
            email: String(fd.get("email") || "").trim(),
            first_name: String(fd.get("first_name") || "").trim(),
            last_name: String(fd.get("last_name") || "").trim(),
            role,
            is_active: fd.get("is_active") === "on",
            is_verified: fd.get("is_verified") === "on",
          };
          if (role === "student") {
            body.student_profile = {
              student_id:
                editStudentId.trim() ||
                String(fd.get("student_id") || "").trim(),
              program: String(fd.get("program") || "").trim(),
              year_level: Number(fd.get("year_level")),
            };
          }
          if (role === "instructor") {
            body.instructor_profile = {
              employee_id:
                editEmpId.trim() || String(fd.get("employee_id") || "").trim(),
              department: String(fd.get("department") || "").trim(),
            };
          }
          try {
            await usersService.updateUser(editingUser.id, body);
            setEditingUser(null);
            load();
          } catch (err) {
            setError(err.message || "Save failed");
          }
        }}
      >
        {editingUser ? (
          <>
            <ModalTabBar active={editTab} onChange={setEditTab} />

            <div
              className={`admin-modal-panel${editTab === "student" ? " is-active" : ""}`}
            >
              <label className="static-modal__label">
                Username
                <input
                  className="static-modal__input"
                  name="username"
                  defaultValue={editingUser.username}
                  required
                />
              </label>
              <label className="static-modal__label">
                Email
                <input
                  className="static-modal__input"
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  required
                />
              </label>
              <label className="static-modal__label">
                First name
                <input
                  className="static-modal__input"
                  name="first_name"
                  defaultValue={editingUser.first_name || ""}
                />
              </label>
              <label className="static-modal__label">
                Last name
                <input
                  className="static-modal__input"
                  name="last_name"
                  defaultValue={editingUser.last_name || ""}
                />
              </label>
              <label
                className="static-modal__label2"
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={editingUser.is_active}
                />
                Active (can sign in when verified)
              </label>
              <label
                className="static-modal__label2"
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  name="is_verified"
                  defaultChecked={editingUser.is_verified}
                />
                Email verified
              </label>
              <label className="static-modal__label">
                Student ID
                <div className="admin-id-row">
                  <input
                    className="static-modal__input"
                    name="student_id"
                    value={editStudentId}
                    onChange={(ev) => setEditStudentId(ev.target.value)}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={async () => {
                      try {
                        const r = await usersService.fetchNextReferenceId();
                        setEditStudentId(r.id);
                      } catch (err) {
                        setError(err.message || "Could not generate ID");
                      }
                    }}
                  >
                    Generate ID
                  </button>
                </div>
              </label>
              <label className="static-modal__label">
                Program
                <input
                  className="static-modal__input"
                  name="program"
                  defaultValue={editingUser.student_profile?.program || ""}
                />
              </label>
              <label className="static-modal__label">
                Year level
                <input
                  className="static-modal__input"
                  name="year_level"
                  type="number"
                  min={1}
                  max={8}
                  defaultValue={editingUser.student_profile?.year_level ?? ""}
                />
              </label>
            </div>

            <div
              className={`admin-modal-panel${editTab === "instructor" ? " is-active" : ""}`}
            >
              <label className="static-modal__label">
                Username
                <input
                  className="static-modal__input"
                  name="username"
                  defaultValue={editingUser.username}
                  required
                />
              </label>
              <label className="static-modal__label">
                Email
                <input
                  className="static-modal__input"
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  required
                />
              </label>
              <label className="static-modal__label">
                First name
                <input
                  className="static-modal__input"
                  name="first_name"
                  defaultValue={editingUser.first_name || ""}
                />
              </label>
              <label className="static-modal__label">
                Last name
                <input
                  className="static-modal__input"
                  name="last_name"
                  defaultValue={editingUser.last_name || ""}
                />
              </label>
              <label
                className="static-modal__label2"
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={editingUser.is_active}
                />
                Active (can sign in when verified)
              </label>
              <label
                className="static-modal__label2"
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  name="is_verified"
                  defaultChecked={editingUser.is_verified}
                />
                Email verified
              </label>
              <label className="static-modal__label">
                Employee ID
                <div className="admin-id-row">
                  <input
                    className="static-modal__input"
                    name="employee_id"
                    value={editEmpId}
                    onChange={(ev) => setEditEmpId(ev.target.value)}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={async () => {
                      try {
                        const r = await usersService.fetchNextReferenceId();
                        setEditEmpId(r.id);
                      } catch (err) {
                        setError(err.message || "Could not generate ID");
                      }
                    }}
                  >
                    Generate ID
                  </button>
                </div>
              </label>
              <label className="static-modal__label">
                Department
                <input
                  className="static-modal__input"
                  name="department"
                  defaultValue={
                    editingUser.instructor_profile?.department || ""
                  }
                />
              </label>
            </div>
          </>
        ) : null}
      </EditModal>
    </article>
  );
}
