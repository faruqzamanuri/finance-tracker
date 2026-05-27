import { formatCurrency } from '../../utils/currency'
import styles from './SafeToSpendGauge.module.css'

export default function SafeToSpendGauge({ amount, income, monthLabel }) {
  const safeAmount = Math.max(0, amount)
  const progress = income > 0 ? Math.max(0, Math.min(100, (safeAmount / income) * 100)) : 0

  return (
    <div
      className={styles.gauge}
      style={{ '--available': `${progress}%` }}
      aria-label="Safe to spend"
    >
      <div className={styles.header}>
        <div>
          <span>Safe to spend</span>
          <strong>{formatCurrency(safeAmount)}</strong>
          <small>{monthLabel}</small>
        </div>
        <b>{Math.round(progress)}%</b>
      </div>

      <div className={styles.track}><i /></div>

      <div className={styles.footer}>
        <span>Available</span>
        <span>{formatCurrency(Math.max(0, income - safeAmount))} spent</span>
      </div>
    </div>
  )
}
