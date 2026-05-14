import './PlaceholderPage.css'

export function PlaceholderPage({ title, hint }) {
  return (
    <article className="sis-page">
      <header className="sis-page__header">
        <h2 className="sis-page__title">{title}</h2>
        <p className="sis-page__hint">{hint}</p>
      </header>

      <div className="sis-page__mock">
        <div className="sis-page__mock-row sis-page__mock-row--head">
          <span className="sis-page__cell" style={{ flex: 2 }} />
          <span className="sis-page__cell" />
          <span className="sis-page__cell" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="sis-page__mock-row">
            <span className="sis-page__cell" style={{ flex: 2 }} />
            <span className="sis-page__cell" />
            <span className="sis-page__cell" />
          </div>
        ))}
      </div>

      <p className="sis-page__footnote">Placeholder content for layout spacing and typography.</p>
    </article>
  )
}
