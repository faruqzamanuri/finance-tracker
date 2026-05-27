import { useState } from 'react'
import MonthPicker from './MonthPicker'
import styles from './MonthNavigator.module.css'

export default function MonthNavigator({ monthLabel, onMonthChange, onMonthSelect, selectedMonth }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <div className={styles.wrap} aria-label="Month navigation">
      <button className={styles.arrow} onClick={() => onMonthChange(-1)} type="button" aria-label="Previous month">‹</button>
      <span className={styles.label} aria-live="polite">{monthLabel}</span>
      <button className={styles.calendar} onClick={() => setIsPickerOpen(true)} type="button" aria-label="Choose month">▦</button>
      <button className={styles.arrow} onClick={() => onMonthChange(1)} type="button" aria-label="Next month">›</button>

      <MonthPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectMonth={onMonthSelect}
        selectedMonth={selectedMonth}
      />
    </div>
  )
}
