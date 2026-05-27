import { getSpendingByCategory } from '../../utils/analytics'
import { formatCurrency } from '../../utils/currency'
import EmptyState from './EmptyState'
import styles from './CategorySpendingList.module.css'

export default function CategorySpendingList({ limit, transactions }) {
  const categories = getSpendingByCategory(transactions)
  const visibleCategories = limit ? categories.slice(0, limit) : categories
  const largestAmount = visibleCategories[0]?.amount || 1

  if (!visibleCategories.length) {
    return <EmptyState title="No spending yet" message="Expense categories appear here once you track spending." />
  }

  return (
    <div className={styles.list}>
      {visibleCategories.map((item) => (
        <article className={styles.row} key={item.category}>
          <span className={styles.icon}>{item.emoji}</span>
          <div className={styles.content}>
            <div className={styles.meta}>
              <strong>{item.category}</strong>
              <span>{formatCurrency(item.amount)}</span>
            </div>
            <div className={styles.track}>
              <i style={{ width: `${Math.max(8, (item.amount / largestAmount) * 100)}%` }} />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
