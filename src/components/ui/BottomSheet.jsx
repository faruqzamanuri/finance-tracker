import { useEffect, useState } from 'react'
import styles from './BottomSheet.module.css'

export default function BottomSheet({ children, isOpen, onClose, title = 'Add transaction' }) {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      return undefined
    }

    const timer = window.setTimeout(() => setShouldRender(false), 220)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!shouldRender) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shouldRender, onClose])

  if (!shouldRender) return null

  const closingClass = isOpen ? '' : styles.closing

  return (
    <div className={`${styles.portal} ${closingClass}`} role="presentation">
      <button className={styles.backdrop} aria-label="Close add transaction sheet" onClick={onClose} type="button" />
      <section className={styles.sheet} aria-modal="true" role="dialog" aria-label={title}>
        <div className={styles.handle} />
        <button className={styles.closeButton} aria-label="Close" onClick={onClose} type="button">×</button>
        {children}
      </section>
    </div>
  )
}
