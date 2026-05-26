import { useState } from 'react'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { useTheme } from '../../hooks/useTheme'
import styles from './AppShell.module.css'

const navItems = [
  { id: 'overview', label: 'Home' },
  { id: 'activity', label: 'Activity' },
  { id: 'insights', label: 'Insights' },
]

const sectionIds = ['overview', 'add-transaction', 'activity', 'insights']

export default function AppShell({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { activeSection, scrollToSection } = useSectionNavigation(sectionIds)

  const closeDrawer = () => setIsDrawerOpen(false)

  const handleNavClick = (event, sectionId) => {
    event.preventDefault()
    scrollToSection(sectionId)
    closeDrawer()
  }

  const handleAddClick = (event) => {
    event.preventDefault()
    scrollToSection('add-transaction')

    window.setTimeout(() => {
      const firstField = document.querySelector('#add-transaction input, #add-transaction select, #add-transaction textarea')
      firstField?.focus({ preventScroll: true })
    }, 450)
  }

  const renderNavItems = (items = navItems) =>
    items.map((item) => (
      <a
        className={activeSection === item.id ? styles.active : ''}
        href={`#${item.id}`}
        key={item.id}
        onClick={(event) => handleNavClick(event, item.id)}
      >
        {item.label}
      </a>
    ))

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

        <button className={styles.mobileTitle} onClick={(event) => handleNavClick(event, 'overview')} type="button">
          <strong>FinWise</strong>
          <small>Money app</small>
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
          <button className={styles.brand} onClick={(event) => handleNavClick(event, 'overview')} type="button">
            <span className={styles.logo}>₿</span>
            <span>
              <strong>FinWise</strong>
              <small>Personal finance</small>
            </span>
          </button>
          <button className={styles.closeButton} onClick={closeDrawer} type="button">×</button>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          {renderNavItems()}
        </nav>

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
          <span>Today</span>
          <strong>Your biggest spending category updates as transactions change.</strong>
          <small>Insights are ready for charts, budgets and search.</small>
        </div>
      </aside>

      {isDrawerOpen ? <button className={styles.scrim} aria-label="Close navigation" onClick={closeDrawer} type="button" /> : null}

      <main className={styles.main}>{children}</main>

      {activeSection !== 'add-transaction' ? (
        <button className={styles.fab} onClick={handleAddClick} aria-label="Add transaction" type="button">
          +
        </button>
      ) : null}

      <nav className={styles.bottomNav} aria-label="Mobile navigation">
        {renderNavItems(navItems)}
      </nav>
    </div>
  )
}
