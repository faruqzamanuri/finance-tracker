import styles from './ViewContainer.module.css'

export default function ViewContainer({ children, eyebrow, title, subtitle }) {
  return (
    <section className={styles.view} aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>
      <header className={styles.header}>
        <div>
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1 id={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  )
}
