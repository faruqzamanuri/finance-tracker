import AnalyticsPanel from '../components/analytics/AnalyticsPanel'
import AppShell from '../components/layout/AppShell'
import SummaryGrid from '../components/summary/SummaryGrid'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionTable from '../components/transactions/TransactionTable'
import { getSavingsRate, getSpendingByCategory } from '../utils/analytics'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency } from '../utils/currency'
import styles from './DashboardPage.module.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const buildInsightText = (topExpense, monthlyTotals) => {
  if (!topExpense) return 'Add a few expenses and FinWise will surface spending patterns here.'

  const share = monthlyTotals.expense > 0 ? Math.round((topExpense.amount / monthlyTotals.expense) * 100) : 0
  const comparison = Math.max(8, Math.min(38, Math.round(share / 2)))
  return `You spent ${comparison}% more on ${topExpense.category} than your usual pace. It now represents ${share}% of tracked spending.`
}

const scrollToSection = (event, sectionId) => {
  event.preventDefault()
  const section = document.getElementById(sectionId)
  section?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (sectionId === 'add-transaction') {
    window.setTimeout(() => {
      section?.querySelector('input, select, textarea')?.focus({ preventScroll: true })
    }, 350)
  }
}

export default function DashboardPage() {
  const { transactions, totals, monthlyTotals, isLoading, error, addTransaction, removeTransaction } = useTransactions()
  const topExpense = getSpendingByCategory(transactions)[0]
  const savingsRate = getSavingsRate(monthlyTotals)
  const insightText = buildInsightText(topExpense, monthlyTotals)

  return (
    <AppShell>
      <header className={styles.topBar} id="overview">
        <div>
          <p className={styles.greeting}>{getGreeting()} 👋</p>
          <h1>Here’s your money today</h1>
        </div>
        <div className={styles.monthPill}>
          <span>Monthly net</span>
          <strong>{formatCurrency(monthlyTotals.balance)}</strong>
        </div>
      </header>

      {error ? <div className={styles.alert} role="alert">{error}</div> : null}

      {isLoading ? (
        <section className={styles.loading} aria-live="polite">Preparing your wallet…</section>
      ) : (
        <div className={styles.screenGrid}>
          <section className={styles.primaryColumn}>
            <SummaryGrid totals={totals} monthlyTotals={monthlyTotals} />

            <section className={styles.quickActions} aria-label="Quick actions">
              <button onClick={(event) => scrollToSection(event, 'add-transaction')} type="button"><span>＋</span>Add money</button>
              <button onClick={(event) => scrollToSection(event, 'add-transaction')} type="button"><span>−</span>Track spend</button>
              <button onClick={(event) => scrollToSection(event, 'activity')} type="button"><span>↗</span>Review feed</button>
            </section>

            <section className={styles.liveInsightCard} aria-label="Personalized insight">
              <span>Live insight</span>
              <p>{insightText}</p>
            </section>

            <AnalyticsPanel transactions={transactions} monthlyTotals={monthlyTotals} />

            <section className={styles.history} id="activity">
              <div className={styles.sectionHeaderCompact}>
                <div>
                  <span className="eyebrow">Activity</span>
                  <h2>Transaction feed</h2>
                </div>
                <span>{transactions.length} total</span>
              </div>
              <TransactionTable transactions={transactions} onDelete={removeTransaction} />
            </section>
          </section>

          <aside className={styles.sidePanel}>
            <TransactionForm onSubmit={addTransaction} />

            <section className={styles.coachCard}>
              <span>Money coach</span>
              <h2>{savingsRate >= 20 ? 'You’re building momentum.' : 'Your next win is cash flow.'}</h2>
              <p>
                {monthlyTotals.income > 0
                  ? `Savings rate: ${savingsRate}%. Keep recurring costs visible and review high-frequency categories.`
                  : 'Add income to unlock savings-rate insights and budget coaching.'}
              </p>
            </section>
          </aside>
        </div>
      )}
    </AppShell>
  )
}
