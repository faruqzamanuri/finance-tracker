import AnalyticsPanel from '../analytics/AnalyticsPanel'
import { getCategoryEmoji, getSavingsRate, getSpendingByCategory } from '../../utils/analytics'
import { formatCurrency } from '../../utils/currency'
import ViewContainer from './ViewContainer'
import styles from './TrendsView.module.css'

export default function TrendsView({ monthLabel, monthlyTotals, transactions }) {
  const topCategory = getSpendingByCategory(transactions)[0]
  const savingsRate = getSavingsRate(monthlyTotals)
  const biggestExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .sort((a, b) => Number(b.amount) - Number(a.amount))[0]
  const totalFlow = monthlyTotals.income + monthlyTotals.expense || 1
  const expenseShare = Math.round((monthlyTotals.expense / totalFlow) * 100)

  return (
    <ViewContainer eyebrow="Trends" title="Monthly trends" subtitle={`${monthLabel} category mix, cash flow, and savings pace.`}>
      <section className={styles.highlightGrid}>
        <article className={styles.highlightCard}>
          <span className={styles.icon}>{topCategory ? topCategory.emoji : '◌'}</span>
          <div>
            <small>Top spend</small>
            <strong>{topCategory?.category || 'No expenses yet'}</strong>
            <p>{topCategory ? formatCurrency(topCategory.amount) : 'Track spending to reveal your biggest category.'}</p>
          </div>
        </article>

        <article className={styles.highlightCard}>
          <span className={styles.icon}>{biggestExpense ? getCategoryEmoji(biggestExpense.category, biggestExpense.type) : '↘'}</span>
          <div>
            <small>Biggest expense</small>
            <strong>{biggestExpense?.title || 'Nothing this month'}</strong>
            <p>{biggestExpense ? formatCurrency(biggestExpense.amount) : 'Monthly expense highlights appear here.'}</p>
          </div>
        </article>

        <article className={styles.highlightCard}>
          <span className={styles.icon}>◒</span>
          <div>
            <small>Savings pace</small>
            <strong>{savingsRate}%</strong>
            <p>{monthlyTotals.income ? `${expenseShare}% of flow is spending` : 'Add income to calculate pace.'}</p>
          </div>
        </article>
      </section>

      <AnalyticsPanel transactions={transactions} monthlyTotals={monthlyTotals} />
    </ViewContainer>
  )
}
