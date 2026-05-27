import { useState } from 'react'
import { getCategoryEmoji, getSavingsRate, getSpendingByCategory } from '../../utils/analytics'
import { TRANSACTION_TYPES } from '../../data/categories'
import { formatCurrency } from '../../utils/currency'
import MonthPicker from '../ui/MonthPicker'
import ViewContainer from './ViewContainer'
import styles from './WalletView.module.css'

export default function WalletView({ allTimeTotals, monthLabel, monthlyTotals, onMonthChange, onMonthSelect, onViewChange, selectedMonth, transactions }) {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const recentTransactions = transactions.slice(0, 3)
  const totalFlow = monthlyTotals.income + monthlyTotals.expense || 1
  const incomeShare = Math.round((monthlyTotals.income / totalFlow) * 100)
  const expenseShare = Math.round((monthlyTotals.expense / totalFlow) * 100)
  const savingsRate = getSavingsRate(monthlyTotals)
  const topCategory = getSpendingByCategory(transactions)[0]

  return (
    <ViewContainer eyebrow="Wallet" title="Monthly overview" subtitle="Track this month’s income, spending, and savings pace.">
      <div className={styles.monthSwitcher} aria-label="Select month">
        <button onClick={() => onMonthChange(-1)} type="button" aria-label="Previous month">‹</button>
        <button className={styles.monthLabelButton} onClick={() => setIsMonthPickerOpen(true)} type="button" aria-label="Choose month">
          {monthLabel}
        </button>
        <button onClick={() => onMonthChange(1)} type="button" aria-label="Next month">›</button>
      </div>

      <MonthPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        onSelectMonth={onMonthSelect}
        selectedMonth={selectedMonth}
      />

      <section className={styles.heroGrid}>
        <article className={styles.walletCard}>
          <span className={styles.cardLabel}>{monthLabel} net cash flow</span>
          <strong>{monthlyTotals.balance >= 0 ? '+' : ''}{formatCurrency(monthlyTotals.balance)}</strong>
          <div className={styles.cardFooter}>
            <span>FinWise · MYR</span>
            <span>All-time: {formatCurrency(allTimeTotals.balance)}</span>
          </div>
        </article>

        <article className={styles.cashFlowCard} aria-label="Monthly cash flow snapshot">
          <div className={styles.cardHeader}>
            <span>Monthly cash flow</span>
            <strong>{savingsRate}% saved</strong>
          </div>

          <div className={styles.flowTrack} aria-hidden="true">
            <i className={styles.incomeBar} style={{ width: `${incomeShare}%` }} />
            <i className={styles.expenseBar} style={{ width: `${expenseShare}%` }} />
          </div>

          <div className={styles.flowLegend}>
            <span><b className={styles.incomeDot} />Income <strong>{formatCurrency(monthlyTotals.income)}</strong></span>
            <span><b className={styles.expenseDot} />Expenses <strong>{formatCurrency(monthlyTotals.expense)}</strong></span>
          </div>
        </article>
      </section>

      <section className={styles.metricGrid} aria-label="Monthly summary">
        <article><span>Income</span><strong>{formatCurrency(monthlyTotals.income)}</strong></article>
        <article><span>Expenses</span><strong>{formatCurrency(monthlyTotals.expense)}</strong></article>
        <article><span>Savings rate</span><strong>{savingsRate}%</strong></article>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.previewCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className="eyebrow">Recent</span>
              <h2>{monthLabel} latest</h2>
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
            <p className={styles.empty}>No transactions in {monthLabel} yet.</p>
          )}
        </section>

        <section className={styles.trendCard} aria-label="Mini trend">
          <div className={styles.sectionHeader}>
            <div>
              <span className="eyebrow">Mini trend</span>
              <h2>{topCategory ? 'Top spend' : 'Savings pace'}</h2>
            </div>
            <button onClick={() => onViewChange('trends')} type="button">Trends</button>
          </div>

          {topCategory ? (
            <div className={styles.topSpendVisual}>
              <span>{topCategory.emoji}</span>
              <div>
                <strong>{topCategory.category}</strong>
                <p>{formatCurrency(topCategory.amount)}</p>
                <div className={styles.trendTrack}><i style={{ width: `${Math.min(100, Math.max(12, (topCategory.amount / (monthlyTotals.expense || topCategory.amount)) * 100))}%` }} /></div>
              </div>
            </div>
          ) : (
            <div className={styles.savingsVisual}>
              <div className={styles.ring} style={{ '--progress': `${Math.max(0, Math.min(100, savingsRate)) * 3.6}deg` }}><span>{savingsRate}%</span></div>
              <p>Add expenses to reveal this month’s top category.</p>
            </div>
          )}
        </section>
      </div>
    </ViewContainer>
  )
}
