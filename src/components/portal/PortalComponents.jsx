import './portalComponents.css'

export function PortalPageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="portal-page__header">
      <div>
        {eyebrow ? <p className="portal-page__eyebrow">{eyebrow}</p> : null}
        <h2 className="portal-page__title">{title}</h2>
        {description ? <p className="portal-page__description">{description}</p> : null}
      </div>
      {actions ? <div className="portal-page__actions">{actions}</div> : null}
    </header>
  )
}

export function PortalMetricGrid({ items }) {
  return (
    <section className="portal-metric-grid" aria-label="Portal summary">
      {items.map((item) => (
        <article key={item.label} className="portal-metric">
          <p className="portal-metric__label">{item.label}</p>
          <h3 className="portal-metric__value">{item.value}</h3>
          <p className="portal-metric__hint">{item.hint}</p>
        </article>
      ))}
    </section>
  )
}

export function PortalGrid({ children, columns = 2 }) {
  const className = columns === 3 ? 'portal-grid portal-grid--three' : 'portal-grid portal-grid--two'
  return <div className={className}>{children}</div>
}

export function PortalSection({ title, description, action, children }) {
  return (
    <section className="portal-section">
      <div className="portal-section__head">
        <div>
          <h3 className="portal-section__title">{title}</h3>
          {description ? <p className="portal-section__description">{description}</p> : null}
        </div>
        {action ? <div className="portal-section__action">{action}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  )
}

export function PortalList({ items, renderItem }) {
  return (
    <div className="portal-list">
      {items.map((item, index) => (
        <article key={item.id ?? item.title ?? item.label ?? index} className="portal-list__item">
          {renderItem(item)}
        </article>
      ))}
    </div>
  )
}

export function PortalTable({ columns, rows, getRowKey }) {
  return (
    <div className="portal-table-wrap">
      <table className="portal-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getRowKey ? getRowKey(row) : row.id ?? index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PortalKeyValueList({ items }) {
  return (
    <dl className="portal-kv-list">
      {items.map((item) => (
        <div key={item.label} className="portal-kv-list__row">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
