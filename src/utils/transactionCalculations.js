import { TRANSACTION_TYPES } from '../data/categories'
import { isCurrentMonth } from './date'

export const calculateTotals = (transactions) => {
  return transactions.reduce(
    (totals, transaction) => {
      const amount = Number(transaction.amount) || 0
      if (transaction.type === TRANSACTION_TYPES.INCOME) {
        totals.income += amount
      } else {
        totals.expense += amount
      }
      totals.balance = totals.income - totals.expense
      return totals
    },
    { income: 0, expense: 0, balance: 0 },
  )
}

export const calculateMonthlyTotals = (transactions) =>
  calculateTotals(transactions.filter((transaction) => isCurrentMonth(transaction.date)))

export const sortTransactionsByDate = (transactions) =>
  [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
