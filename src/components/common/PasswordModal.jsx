import { EditModal } from "./EditModal";

export function PasswordModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  error,
  requireCurrent = true,
}) {
  return (
    <EditModal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {error ? <p style={{ color: "#b00020", margin: 0 }}>{error}</p> : null}
      {requireCurrent ? (
        <label className="static-modal__label">
          Current password
          <input
            className="static-modal__input"
            name="current_password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
      ) : null}
      <label className="static-modal__label">
        New password
        <input
          className="static-modal__input"
          name="new_password"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>
      <label className="static-modal__label">
        Confirm new password
        <input
          className="static-modal__input"
          name="re_new_password"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>
    </EditModal>
  );
}
