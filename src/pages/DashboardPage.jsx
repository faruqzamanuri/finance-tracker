import { useMemo, useState } from 'react'
import AppShell from '../components/layout/AppShell'
import BottomSheet from '../components/ui/BottomSheet'
import ActivityView from '../components/views/ActivityView'
import BudgetView from '../components/views/BudgetView'
import DashboardView from '../components/views/DashboardView'
import TrendsView from '../components/views/TrendsView'
import TransactionForm from '../components/transactions/TransactionForm'
import { TRANSACTION_TYPES } from '../data/categories'
import { useTransactions } from '../hooks/useTransactions'
import { calculateTotals } from '../utils/transactionCalculations'
import { addMonths, formatMonthLabel, getCurrentMonthKey, isSameMonth } from '../utils/date'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('dashboard')
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [addSheetType, setAddSheetType] = useState(TRANSACTION_TYPES.EXPENSE)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey)
  const { transactions, isLoading, error, addTransaction, removeTransaction } = useTransactions()
  const monthLabel = formatMonthLabel(selectedMonth)
  const previousMonth = addMonths(selectedMonth, -1)
  const monthTransactions = useMemo(
    () => transactions.filter((transaction) => isSameMonth(transaction.date, selectedMonth)),
    [transactions, selectedMonth],
  )
  const previousMonthTransactions = useMemo(
    () => transactions.filter((transaction) => isSameMonth(transaction.date, previousMonth)),
    [transactions, previousMonth],
  )
  const selectedMonthTotals = useMemo(() => calculateTotals(monthTransactions), [monthTransactions])
  const previousMonthTotals = useMemo(() => calculateTotals(previousMonthTransactions), [previousMonthTransactions])

  const handleMonthChange = (offset) => {
    setSelectedMonth((currentMonth) => addMonths(currentMonth, offset))
  }

  const monthProps = {
    monthLabel,
    monthlyTotals: selectedMonthTotals,
    onMonthChange: handleMonthChange,
    onMonthSelect: setSelectedMonth,
    selectedMonth,
    transactions: monthTransactions,
  }

  const openAddSheet = (type = TRANSACTION_TYPES.EXPENSE) => {
    setAddSheetType(type)
    setIsAddSheetOpen(true)
  }

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction)
    setIsAddSheetOpen(false)
  }

  const renderView = () => {
    if (activeView === 'budget') return <BudgetView {...monthProps} />

    if (activeView === 'activity') {
      return <ActivityView monthLabel={monthLabel} monthTransactions={monthTransactions} transactions={transactions} onDelete={removeTransaction} />
    }

    if (activeView === 'trends') {
      return (
        <TrendsView
          monthLabel={monthLabel}
          monthlyTotals={selectedMonthTotals}
          previousMonthTotals={previousMonthTotals}
          previousTransactions={previousMonthTransactions}
          transactions={monthTransactions}
        />
      )
    }

    return <DashboardView {...monthProps} onViewChange={setActiveView} />
  }

  return (
    <AppShell activeView={activeView} onAddTransactionClick={() => openAddSheet()} onViewChange={setActiveView}>
      {error ? <div className={styles.alert} role="alert">{error}</div> : null}

      {isLoading ? (
        <section className={styles.loading} aria-live="polite">Preparing your budget…</section>
      ) : (
        <div className={styles.viewFrame} key={activeView}>{renderView()}</div>
      )}

      <BottomSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)}>
        <TransactionForm defaultType={addSheetType} formId="sheet-add-transaction" onSubmit={handleAddTransaction} />
      </BottomSheet>
    </AppShell>
  )
}
