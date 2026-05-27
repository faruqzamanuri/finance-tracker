import { getCategoryEmoji, getSavingsRate } from '../../utils/analytics'
import { TRANSACTION_TYPES } from '../../data/categories'
import { formatCurrency } from '../../utils/currency'
import MonthNavigator from '../ui/MonthNavigator'
import SafeToSpendGauge from '../ui/SafeToSpendGauge'
import ViewContainer from './ViewContainer'
import styles from './DashboardView.module.css'

export default function DashboardView({ monthLabel, monthlyTotals, onMonthChange, onMonthSelect, onViewChange, selectedMonth, transactions }) {
  const safeToSpend = monthlyTotals.income - monthlyTotals.expense
  const recentTransactions = transactions.slice(0, 3)
  const savingsRate = getSavingsRate(monthlyTotals)
  const statusText = transactions.length
    ? `${transactions.length} transaction${transactions.length === 1 ? '' : 's'} this month`
    : 'Start tracking this month'
  const statusHint = monthlyTotals.income && safeToSpend < monthlyTotals.income * 0.25
    ? 'Review your spending pace'
    : 'Budget pace looks steady'

  return (
    <ViewContainer eyebrow="FinWise" title="Dashboard" subtitle="How much can you safely spend this month?">
      <div className={styles.topRow}>
        <MonthNavigator monthLabel={monthLabel} onMonthChange={onMonthChange} onMonthSelect={onMonthSelect} selectedMonth={selectedMonth} />
      </div>

      <section className={styles.safeCard}>
        <SafeToSpendGauge amount={safeToSpend} income={monthlyTotals.income} monthLabel={monthLabel} />
      </section>

      <section className={styles.metrics} aria-label={`${monthLabel} summary`}>
        <article><span>Income</span><strong>{formatCurrency(monthlyTotals.income)}</strong></article>
        <article><span>Expenses</span><strong>{formatCurrency(monthlyTotals.expense)}</strong></article>
        <article><span>Savings rate</span><strong>{savingsRate}%</strong></article>
      </section>

      <section className={styles.statusCard}>
        <div>
          <strong>{statusText}</strong>
          <small>{statusHint}</small>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <div>
            <span className="eyebrow">Recent</span>
            <h2>Latest activity</h2>
          </div>
          <button onClick={() => onViewChange('activity')} type="button">View all</button>
        </div>

        {recentTransactions.length ? (
          <div className={styles.recentList}>
            {recentTransactions.map((transaction) => {
              const isIncome = transaction.type === TRANSACTION_TYPES.INCOME
              return (
                <article className={styles.recentItem} key={transaction.id}>
                  <span className={isIncome ? styles.incomeIcon : styles.expenseIcon}>{getCategoryEmoji(transaction.category, transaction.type)}</span>
                  <div>
                    <strong>{transaction.title}</strong>
                    <small>{transaction.category}</small>
                  </div>
                  <b className={isIncome ? styles.incomeText : styles.expenseText}>{isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}</b>
                </article>
              )
            })}
          </div>
        ) : (
          <p className={styles.empty}>No activity in {monthLabel} yet.</p>
        )}
      </section>
    </ViewContainer>
  )
}
