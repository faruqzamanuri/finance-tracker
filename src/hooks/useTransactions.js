import { useEffect, useMemo, useState } from 'react'
import { starterTransactions } from '../data/starterTransactions'
import { storageService } from '../services/storageService'
import { calculateMonthlyTotals, calculateTotals, sortTransactionsByDate } from '../utils/transactionCalculations'

const createTransactionId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadTransactions = async () => {
      try {
        setIsLoading(true)
        const storedTransactions = await storageService.getTransactions(starterTransactions)
        if (isMounted) setTransactions(storedTransactions)
      } catch (loadError) {
        if (isMounted) setError(loadError.message)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadTransactions()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      storageService.saveTransactions(transactions).catch((saveError) => setError(saveError.message))
    }
  }, [transactions, isLoading])

  const addTransaction = (transaction) => {
    setTransactions((currentTransactions) => [
      {
        ...transaction,
        id: createTransactionId(),
        amount: Number(transaction.amount),
      },
      ...currentTransactions,
    ])
  }

  const removeTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
  }

  const sortedTransactions = useMemo(() => sortTransactionsByDate(transactions), [transactions])
  const totals = useMemo(() => calculateTotals(transactions), [transactions])
  const monthlyTotals = useMemo(() => calculateMonthlyTotals(transactions), [transactions])

  return {
    transactions: sortedTransactions,
    totals,
    monthlyTotals,
    isLoading,
    error,
    addTransaction,
    removeTransaction,
  }
}
