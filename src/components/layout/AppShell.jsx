import { useState } from 'react'
import AppNavigation from '../navigation/AppNavigation'
import { useTheme } from '../../hooks/useTheme'
import styles from './AppShell.module.css'

export default function AppShell({ activeView, children, onAddTransactionClick, onViewChange }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const closeDrawer = () => setIsDrawerOpen(false)

  const handleViewChange = (viewId) => {
    onViewChange(viewId)
    closeDrawer()
  }

  return (
    <div className={styles.shell}>
      <header className={styles.mobileHeader}>
        <button
          aria-label="Open navigation menu"
          className={styles.menuButton}
          onClick={() => setIsDrawerOpen(true)}
          type="button"
        >
          <span />
          <span />
        </button>

        <button className={styles.mobileTitle} onClick={() => handleViewChange('dashboard')} type="button">
          <strong>FinWise</strong>
          <small>{activeView === 'dashboard' ? 'Dashboard' : activeView === 'budget' ? 'Budget' : activeView === 'trends' ? 'Trends' : 'Activity'}</small>
        </button>

        <button
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className={styles.themeButton}
          onClick={toggleTheme}
          type="button"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <aside className={`${styles.sidebar} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.brandRow}>
          <button className={styles.brand} onClick={() => handleViewChange('dashboard')} type="button">
            <span className={styles.logo}>₿</span>
            <span>
              <strong>FinWise</strong>
              <small>Monthly budgeting</small>
            </span>
          </button>
          <button className={styles.closeButton} onClick={closeDrawer} type="button">×</button>
        </div>

        <div className={styles.navWrap}>
          <AppNavigation activeView={activeView} onViewChange={handleViewChange} />
        </div>

        <button
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className={styles.themeToggle}
          onClick={toggleTheme}
          type="button"
        >
          <span>{theme === 'dark' ? '☀' : '☾'}</span>
          <strong>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</strong>
        </button>

        <div className={styles.insightCard}>
          <span>Trends</span>
          <strong>Safe-to-spend, category mix, and savings pace update live.</strong>
          <small>No routing needed — switch tabs instantly.</small>
        </div>
      </aside>

      {isDrawerOpen ? <button className={styles.scrim} aria-label="Close navigation" onClick={closeDrawer} type="button" /> : null}

      <main className={styles.main}>{children}</main>

      <button className={styles.fab} onClick={onAddTransactionClick} aria-label="Add transaction" type="button">
        +
      </button>

      <div className={styles.bottomNav}>
        <AppNavigation activeView={activeView} onViewChange={handleViewChange} />
      </div>
    </div>
  )
}
