import { useState } from 'react'
import MonthPicker from './MonthPicker'
import styles from './MonthNavigator.module.css'

export default function MonthNavigator({ monthLabel, onMonthChange, onMonthSelect, selectedMonth }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <div className={styles.wrap} aria-label="Month navigation">
      <button onClick={() => onMonthChange(-1)} type="button" aria-label="Previous month">‹</button>
      <button className={styles.label} onClick={() => setIsPickerOpen(true)} type="button" aria-label="Choose month">
        {monthLabel}
      </button>
      <button onClick={() => onMonthChange(1)} type="button" aria-label="Next month">›</button>

      <MonthPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectMonth={onMonthSelect}
        selectedMonth={selectedMonth}
      />
    </div>
  )
}
