import { TRANSACTION_TYPES } from '../data/categories'

export const getCategoryEmoji = (category, type) => {
  const icons = {
    Salary: '💼',
    Freelance: '💻',
    Investments: '📈',
    Gifts: '🎁',
    'Other Income': '✨',
    Housing: '🏠',
    Food: '🥗',
    Transport: '🚇',
    Utilities: '💡',
    Healthcare: '🩺',
    Shopping: '🛍️',
    Entertainment: '🎬',
    Savings: '🏦',
    'Other Expense': '••',
  }

  return icons[category] || (type === TRANSACTION_TYPES.INCOME ? '↗️' : '↘️')
}

export const getSpendingByCategory = (transactions) => {
  const totals = transactions
    .filter((transaction) => transaction.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((categoryTotals, transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + Number(transaction.amount)
      return categoryTotals
    }, {})

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount, emoji: getCategoryEmoji(category, TRANSACTION_TYPES.EXPENSE) }))
    .sort((a, b) => b.amount - a.amount)
}

export const getSavingsRate = ({ income, balance }) => {
  if (!income) return 0
  return Math.max(-100, Math.min(100, Math.round((balance / income) * 100)))
}

export const groupTransactionsByDate = (transactions) =>
  transactions.reduce((groups, transaction) => {
    const date = transaction.date
    if (!groups[date]) groups[date] = []
    groups[date].push(transaction)
    return groups
  }, {})
