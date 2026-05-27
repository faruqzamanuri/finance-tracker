import { useEffect, useMemo, useState } from 'react'
import { formatMonthLabel, getCurrentMonthKey } from '../../utils/date'
import BottomSheet from './BottomSheet'
import styles from './MonthPicker.module.css'

const MONTHS = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec',
]

const getYearFromMonthKey = (monthKey) => Number(monthKey.split('-')[0])
const toMonthKey = (year, monthIndex) => `${year}-${String(monthIndex + 1).padStart(2, '0')}`

export default function MonthPicker({ isOpen, onClose, onSelectMonth, selectedMonth }) {
  const [visibleYear, setVisibleYear] = useState(() => getYearFromMonthKey(selectedMonth))
  const currentMonth = useMemo(() => getCurrentMonthKey(), [])

  useEffect(() => {
    if (isOpen) setVisibleYear(getYearFromMonthKey(selectedMonth))
  }, [isOpen, selectedMonth])

  const handleSelectMonth = (monthIndex) => {
    onSelectMonth(toMonthKey(visibleYear, monthIndex))
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Choose month">
      <section className={styles.picker} aria-label="Month picker">
        <header className={styles.header}>
          <div>
            <span className="eyebrow">Month</span>
            <h2>Choose period</h2>
          </div>
        </header>

        <div className={styles.yearRow}>
          <button onClick={() => setVisibleYear((year) => year - 1)} type="button" aria-label="Previous year">‹</button>
          <strong>{visibleYear}</strong>
          <button onClick={() => setVisibleYear((year) => year + 1)} type="button" aria-label="Next year">›</button>
        </div>

        <div className={styles.monthGrid}>
          {MONTHS.map((month, index) => {
            const monthKey = toMonthKey(visibleYear, index)
            const isSelected = monthKey === selectedMonth
            const isCurrent = monthKey === currentMonth

            return (
              <button
                className={`${isSelected ? styles.selected : ''} ${isCurrent ? styles.current : ''}`}
                key={month}
                onClick={() => handleSelectMonth(index)}
                type="button"
                aria-pressed={isSelected}
              >
                <span>{month}</span>
                {isCurrent ? <small>Now</small> : null}
              </button>
            )
          })}
        </div>

        <p className={styles.caption}>Wallet and Trends update instantly for the selected month.</p>
      </section>
    </BottomSheet>
  )
}
