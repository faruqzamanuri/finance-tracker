import AnalyticsPanel from '../analytics/AnalyticsPanel'
import { getCategoryEmoji, getSavingsRate, getSpendingByCategory } from '../../utils/analytics'
import { formatCurrency } from '../../utils/currency'
import ViewContainer from './ViewContainer'
import styles from './TrendsView.module.css'

const getPercentChange = (current, previous) => {
  if (!previous && !current) return 0
  if (!previous) return 100
  return Math.round(((current - previous) / previous) * 100)
}

const getTrend = (change, inverse = false) => {
  if (Math.abs(change) <= 2) return { icon: '→', label: 'Stable', tone: styles.stable }
  const isUp = change > 0
  const good = inverse ? !isUp : isUp
  return {
    icon: isUp ? '↑' : '↓',
    label: `${Math.abs(change)}%`,
    tone: good ? styles.good : styles.watch,
  }
}

export default function TrendsView({ monthLabel, monthlyTotals, previousMonthTotals, previousTransactions, transactions }) {
  const topCategory = getSpendingByCategory(transactions)[0]
  const previousTopCategories = getSpendingByCategory(previousTransactions)
  const previousTopMatch = previousTopCategories.find((item) => item.category === topCategory?.category)
  const savingsRate = getSavingsRate(monthlyTotals)
  const previousSavingsRate = getSavingsRate(previousMonthTotals)
  const biggestExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .sort((a, b) => Number(b.amount) - Number(a.amount))[0]
  const totalFlow = monthlyTotals.income + monthlyTotals.expense || 1
  const expenseShare = Math.round((monthlyTotals.expense / totalFlow) * 100)
  const spendingTrend = getTrend(getPercentChange(monthlyTotals.expense, previousMonthTotals.expense), true)
  const savingsTrend = getTrend(savingsRate - previousSavingsRate)
  const categoryTrend = topCategory ? getTrend(getPercentChange(topCategory.amount, previousTopMatch?.amount || 0), true) : null

  return (
    <ViewContainer eyebrow="Trends" title="Monthly trends" subtitle={`${monthLabel} movement at a glance.`}>
      <section className={styles.trendStrip}>
        <article className={spendingTrend.tone}>
          <span>{spendingTrend.icon}</span>
          <div><small>Spending</small><strong>{spendingTrend.label}</strong></div>
        </article>
        <article className={savingsTrend.tone}>
          <span>{savingsTrend.icon}</span>
          <div><small>Savings rate</small><strong>{savingsTrend.label}</strong></div>
        </article>
        <article className={categoryTrend?.tone || styles.stable}>
          <span>{categoryTrend?.icon || '→'}</span>
          <div><small>{topCategory?.category || 'Categories'}</small><strong>{categoryTrend?.label || 'Stable'}</strong></div>
        </article>
      </section>

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
