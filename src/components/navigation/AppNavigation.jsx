import styles from './AppNavigation.module.css'

export const APP_VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'budget', label: 'Budget', icon: '▤' },
  { id: 'activity', label: 'Activity', icon: '↕' },
  { id: 'trends', label: 'Trends', icon: '◒' },
]

export default function AppNavigation({ activeView, className = '', items = APP_VIEWS, onViewChange }) {
  return (
    <nav className={`${styles.nav} ${className}`} aria-label="App views">
      {items.map((item) => (
        <button
          aria-current={activeView === item.id ? 'page' : undefined}
          className={activeView === item.id ? styles.active : ''}
          key={item.id}
          onClick={() => onViewChange(item.id)}
          type="button"
        >
          <span className={styles.icon}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
