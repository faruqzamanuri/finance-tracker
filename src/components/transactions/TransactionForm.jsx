import { useMemo, useState } from 'react'
import { CATEGORIES, TRANSACTION_TYPES } from '../../data/categories'
import styles from './TransactionForm.module.css'

const initialFormState = {
  title: '',
  amount: '',
  type: TRANSACTION_TYPES.EXPENSE,
  category: CATEGORIES.expense[0],
  date: new Date().toISOString().slice(0, 10),
  note: '',
}

export default function TransactionForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialFormState)
  const [validationError, setValidationError] = useState('')

  const availableCategories = useMemo(() => CATEGORIES[formData.type], [formData.type])

  const updateField = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
    setValidationError('')
  }

  const handleTypeChange = (type) => {
    setFormData((currentData) => ({
      ...currentData,
      type,
      category: CATEGORIES[type][0],
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setValidationError('Please enter a transaction title.')
      return
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setValidationError('Please enter an amount greater than zero.')
      return
    }

    onSubmit({ ...formData, title: formData.title.trim(), note: formData.note.trim() })
    setFormData(initialFormState)
  }

  return (
    <form className={styles.form} id="add-transaction" onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Quick add</span>
          <h2>Add transaction</h2>
        </div>
      </div>

      {validationError ? <p className={styles.error}>{validationError}</p> : null}

      <div className={styles.typeToggle} aria-label="Transaction type">
        {Object.values(TRANSACTION_TYPES).map((type) => (
          <button
            className={formData.type === type ? styles.selected : ''}
            key={type}
            onClick={() => handleTypeChange(type)}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      <label>
        Title
        <input value={formData.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Grocery run" />
      </label>

      <div className={styles.twoColumns}>
        <label>
          Amount
          <input min="0" step="0.01" type="number" value={formData.amount} onChange={(event) => updateField('amount', event.target.value)} placeholder="0.00" />
        </label>

        <label>
          Date
          <input type="date" value={formData.date} onChange={(event) => updateField('date', event.target.value)} />
        </label>
      </div>

      <label>
        Category
        <select value={formData.category} onChange={(event) => updateField('category', event.target.value)}>
          {availableCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label>
        Note
        <textarea value={formData.note} onChange={(event) => updateField('note', event.target.value)} placeholder="Optional details" rows="3" />
      </label>

      <button className={styles.submitButton} type="submit">Save transaction</button>
    </form>
  )
}
