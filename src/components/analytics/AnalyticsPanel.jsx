import { getSavingsRate, getSpendingByCategory } from '../../utils/analytics'
import { formatCurrency } from '../../utils/currency'
import styles from './AnalyticsPanel.module.css'

export default function AnalyticsPanel({ compact = false, transactions, monthlyTotals }) {
  const spendingByCategory = getSpendingByCategory(transactions).slice(0, 5)
  const largestCategory = spendingByCategory[0]?.amount || 1
  const totalFlow = monthlyTotals.income + monthlyTotals.expense || 1
  const incomeShare = (monthlyTotals.income / totalFlow) * 100
  const expenseShare = (monthlyTotals.expense / totalFlow) * 100
  const savingsRate = getSavingsRate(monthlyTotals)
  const savingsProgress = Math.max(0, Math.min(100, savingsRate))

  return (
    <section className={`${styles.panel} ${compact ? styles.compact : ''}`} aria-label="Financial trends">
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Trends</span>
          <h2>{compact ? 'Mini trend' : 'Visual dashboard'}</h2>
        </div>
        <strong>{savingsRate}% saved</strong>
      </div>

      <div className={styles.flowCard}>
        <div className={styles.flowHeader}>
          <span>Cash flow</span>
          <small>This month</small>
        </div>
        <div className={styles.flowBars}>
          <span className={styles.incomeBar} style={{ width: `${incomeShare}%` }} />
          <span className={styles.expenseBar} style={{ width: `${expenseShare}%` }} />
        </div>
        <div className={styles.flowLegend}>
          <span><i className={styles.incomeDot} /> {formatCurrency(monthlyTotals.income)}</span>
          <span><i className={styles.expenseDot} /> {formatCurrency(monthlyTotals.expense)}</span>
        </div>
      </div>

      <div className={styles.savingsCard}>
        <div>
          <span>Savings rate</span>
          <strong>{savingsRate}%</strong>
        </div>
        <div className={styles.ring} style={{ '--progress': `${savingsProgress * 3.6}deg` }}>
          <span>{savingsProgress}%</span>
        </div>
      </div>

      <div className={styles.categories}>
        <div className={styles.subHeader}>
          <h3>Category mix</h3>
          <span>{spendingByCategory.length} categories</span>
        </div>

        {spendingByCategory.length ? (
          spendingByCategory.map((item) => (
            <div className={styles.categoryRow} key={item.category}>
              <span className={styles.emoji}>{item.emoji}</span>
              <div>
                <div className={styles.categoryMeta}>
                  <strong>{item.category}</strong>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
                <div className={styles.track}>
                  <i style={{ width: `${Math.max(10, (item.amount / largestCategory) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>Add expenses to unlock category analytics.</p>
        )}
      </div>
    </section>
  )
}
