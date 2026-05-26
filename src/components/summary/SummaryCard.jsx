import { formatCurrency } from '../../utils/currency'
import styles from './SummaryCard.module.css'

export default function SummaryCard({ title, value, tone = 'neutral', helper, icon, featured = false }) {
  return (
    <article className={`${styles.card} ${styles[tone]} ${featured ? styles.featured : ''}`}>
      <div className={styles.header}>
        <span>{title}</span>
        <span className={styles.icon}>{icon}</span>
      </div>
      <strong>{formatCurrency(value)}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  )
}
