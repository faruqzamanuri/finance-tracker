import SummaryCard from './SummaryCard'
import styles from './SummaryGrid.module.css'

export default function SummaryGrid({ totals, monthlyTotals }) {
  return (
    <section className={styles.grid} aria-label="Financial summary">
      <SummaryCard
        title="Total Balance"
        value={totals.balance}
        helper="Available across all tracked activity"
        icon="◉"
        featured
      />
      <SummaryCard title="Income" value={monthlyTotals.income} helper="This month" tone="income" icon="↗" />
      <SummaryCard title="Spent" value={monthlyTotals.expense} helper="This month" tone="expense" icon="↘" />
      <SummaryCard title="Net" value={monthlyTotals.balance} helper="Monthly cash flow" tone={monthlyTotals.balance >= 0 ? 'income' : 'expense'} icon="◆" />
    </section>
  )
}
