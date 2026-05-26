import { getCategoryEmoji, groupTransactionsByDate } from '../../utils/analytics'
import { TRANSACTION_TYPES } from '../../data/categories'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import EmptyState from '../ui/EmptyState'
import styles from './TransactionTable.module.css'

export default function TransactionTable({ transactions, onDelete }) {
  if (!transactions.length) {
    return <EmptyState title="No transactions yet" message="Add income or expenses to start building your money timeline." />
  }

  const groupedTransactions = groupTransactionsByDate(transactions)

  return (
    <div className={styles.feed}>
      {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
        <section className={styles.group} key={date}>
          <div className={styles.groupHeader}>
            <h3>{formatDate(date)}</h3>
            <span>{dateTransactions.length} item{dateTransactions.length > 1 ? 's' : ''}</span>
          </div>

          <div className={styles.list}>
            {dateTransactions.map((transaction) => {
              const isIncome = transaction.type === TRANSACTION_TYPES.INCOME
              return (
                <article className={styles.item} key={transaction.id}>
                  <div className={`${styles.icon} ${isIncome ? styles.incomeIcon : styles.expenseIcon}`}>
                    {getCategoryEmoji(transaction.category, transaction.type)}
                  </div>

                  <div className={styles.details}>
                    <div className={styles.titleRow}>
                      <div>
                        <h4>{transaction.title}</h4>
                        <p>{transaction.category}</p>
                      </div>
                      <strong className={isIncome ? styles.incomeText : styles.expenseText}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </strong>
                    </div>

                    <div className={styles.metaRow}>
                      <span className={`${styles.pill} ${isIncome ? styles.income : styles.expense}`}>{transaction.type}</span>
                      <span className={styles.note}>{transaction.note || 'Ready for swipe/edit later'}</span>
                      <button className={styles.deleteButton} onClick={() => onDelete(transaction.id)} type="button">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
