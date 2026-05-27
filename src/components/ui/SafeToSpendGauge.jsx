import { formatCurrency } from '../../utils/currency'
import styles from './SafeToSpendGauge.module.css'

export default function SafeToSpendGauge({ amount, income, monthLabel }) {
  const safeAmount = Math.max(0, amount)
  const progress = income > 0 ? Math.max(0, Math.min(100, (safeAmount / income) * 100)) : 0

  return (
    <div className={styles.gauge} style={{ '--progress': `${progress * 1.8}deg` }} aria-label="Safe to spend gauge">
      <div className={styles.arc}>
        <div className={styles.valueBox}>
          <span>Safe to spend</span>
          <strong>{formatCurrency(safeAmount)}</strong>
          <small>{monthLabel}</small>
        </div>
      </div>
      <div className={styles.scale}>
        <span>Spent</span>
        <span>{Math.round(progress)}% left</span>
      </div>
    </div>
  )
}
