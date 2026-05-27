import { getSavingsRate } from '../../utils/analytics'
import { formatCurrency } from '../../utils/currency'
import CategorySpendingList from '../ui/CategorySpendingList'
import MonthNavigator from '../ui/MonthNavigator'
import SafeToSpendGauge from '../ui/SafeToSpendGauge'
import ViewContainer from './ViewContainer'
import styles from './BudgetView.module.css'

export default function BudgetView({ monthLabel, monthlyTotals, onMonthChange, onMonthSelect, selectedMonth, transactions }) {
  const safeToSpend = monthlyTotals.income - monthlyTotals.expense
  const savingsRate = getSavingsRate(monthlyTotals)

  return (
    <ViewContainer eyebrow="Budget" title="Monthly budget" subtitle="Control category spending and savings pace.">
      <MonthNavigator monthLabel={monthLabel} onMonthChange={onMonthChange} onMonthSelect={onMonthSelect} selectedMonth={selectedMonth} />

      <section className={styles.summaryGrid}>
        <article className={styles.safeMini}>
          <SafeToSpendGauge amount={safeToSpend} income={monthlyTotals.income} monthLabel={monthLabel} />
        </article>
        <div className={styles.metrics}>
          <article><span>Income</span><strong>{formatCurrency(monthlyTotals.income)}</strong></article>
          <article><span>Expenses</span><strong>{formatCurrency(monthlyTotals.expense)}</strong></article>
          <article><span>Savings rate</span><strong>{savingsRate}%</strong></article>
          <article><span>Safe-to-spend</span><strong>{formatCurrency(Math.max(0, safeToSpend))}</strong></article>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.header}>
          <div>
            <span className="eyebrow">Category control</span>
            <h2>{monthLabel} spending</h2>
          </div>
          <span>{transactions.length} items</span>
        </div>
        <CategorySpendingList transactions={transactions} />
      </section>
    </ViewContainer>
  )
}
