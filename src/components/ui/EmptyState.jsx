import styles from './EmptyState.module.css'

export default function EmptyState({ title, message }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>⌁</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}
