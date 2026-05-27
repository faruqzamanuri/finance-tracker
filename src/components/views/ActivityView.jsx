import { useMemo, useState } from 'react'
import { TRANSACTION_TYPES } from '../../data/categories'
import TransactionTable from '../transactions/TransactionTable'
import ViewContainer from './ViewContainer'
import styles from './ActivityView.module.css'

const filters = [
  { id: 'all', label: 'All' },
  { id: TRANSACTION_TYPES.INCOME, label: 'Income' },
  { id: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
]

export default function ActivityView({ monthLabel, monthTransactions, onDelete, transactions }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [dateScope, setDateScope] = useState('all')
  const [query, setQuery] = useState('')

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const sourceTransactions = dateScope === 'month' ? monthTransactions : transactions

    return sourceTransactions.filter((transaction) => {
      const matchesType = activeFilter === 'all' || transaction.type === activeFilter
      const matchesQuery = !normalizedQuery || [transaction.title, transaction.category, transaction.note]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))

      return matchesType && matchesQuery
    })
  }, [activeFilter, dateScope, monthTransactions, query, transactions])

  return (
    <ViewContainer eyebrow="Activity" title="Transaction feed" subtitle="Search, filter, and manage every money movement.">
      <section className={styles.toolbar}>
        <div className={styles.chipStack}>
          <div className={styles.chips} aria-label="Date scope filters">
            <button className={dateScope === 'all' ? styles.active : ''} onClick={() => setDateScope('all')} type="button">All time</button>
            <button className={dateScope === 'month' ? styles.active : ''} onClick={() => setDateScope('month')} type="button">{monthLabel}</button>
          </div>

          <div className={styles.chips} aria-label="Transaction filters">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter.id ? styles.active : ''}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
          </div>
        </div>

        <label className={styles.search}>
          <span>⌕</span>
          <input
            aria-label="Search transactions"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, category, note"
            value={query}
          />
        </label>
      </section>

      <section className={styles.feedCard}>
        <div className={styles.feedHeader}>
          <div>
            <span className="eyebrow">Feed</span>
            <h2>{filteredTransactions.length} transaction{filteredTransactions.length === 1 ? '' : 's'}</h2>
          </div>
          <span>{dateScope === 'month' ? monthLabel : 'All time'} · {activeFilter === 'all' ? 'All types' : activeFilter}</span>
        </div>
        <TransactionTable transactions={filteredTransactions} onDelete={onDelete} />
      </section>
    </ViewContainer>
  )
}
