const STORAGE_KEY = 'personal-finance-tracker:transactions'

export const storageService = {
  async getTransactions(fallbackTransactions = []) {
    try {
      const rawTransactions = localStorage.getItem(STORAGE_KEY)
      if (!rawTransactions) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackTransactions))
        return fallbackTransactions
      }
      return JSON.parse(rawTransactions)
    } catch (error) {
      throw new Error('Unable to load transactions from local storage.')
    }
  },

  async saveTransactions(transactions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
      return transactions
    } catch (error) {
      throw new Error('Unable to save transactions to local storage.')
    }
  },
}
