import './editModal.css'

export function EditModal({ isOpen, title, onClose, onSubmit, children }) {
  if (!isOpen) return null

  return (
    <div className="static-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="static-modal__backdrop" onClick={onClose} />
      <div className="static-modal__panel">
        <div className="static-modal__header">
          <h3 className="static-modal__title">{title}</h3>
          <button type="button" className="static-modal__close" onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>

        <form
          className="static-modal__form"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit?.(e)
          }}
        >
          {children}
          <div className="static-modal__actions">
            <button type="button" className="static-modal__btn static-modal__btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="static-modal__btn static-modal__btn--primary">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
