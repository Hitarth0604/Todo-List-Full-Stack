import React from 'react'
import styles from './TodoCard.module.css'

const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', color: 'var(--text3)', bg: 'var(--bg4)', icon: '○' },
  IN_PROGRESS:  { label: 'In Progress', color: 'var(--yellow)', bg: 'var(--yellow-dim)', icon: '◑' },
  COMPLETED:    { label: 'Completed',   color: 'var(--green)',  bg: 'var(--green-dim)',  icon: '●' },
}

export default function TodoCard({ todo, onEdit, onDelete, isAdmin }) {
  const st = STATUS_CONFIG[todo.status] || STATUS_CONFIG.NOT_STARTED

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
  }

  const isOverdue = () => {
    if (todo.status === 'COMPLETED' || !todo.completionDate) return false
    return new Date(todo.completionDate) < new Date()
  }

  return (
    <div className={`${styles.card} ${isOverdue() ? styles.overdue : ''}`}>
      <div className={styles.header}>
        <span className={styles.status} style={{ color: st.color, background: st.bg }}>
          {st.icon} {st.label}
        </span>
        {isOverdue() && <span className={styles.overdueTag}>Overdue</span>}
      </div>

      <h3 className={styles.title}>{todo.title}</h3>
      <p className={styles.desc}>{todo.description}</p>

      <div className={styles.dates}>
        <div className={styles.dateItem}>
          <span className={styles.dateLabel}>Start</span>
          <span className={styles.dateVal}>{formatDate(todo.startDate)}</span>
        </div>
        <div className={styles.dateDivider} />
        <div className={styles.dateItem}>
          <span className={styles.dateLabel}>Due</span>
          <span className={styles.dateVal}>{formatDate(todo.completionDate)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={`btn btn-ghost ${styles.editBtn}`} onClick={() => onEdit(todo)}>
          ✎ Edit
        </button>
        {/* Admin can delete any todo — RBAC in action */}
        {isAdmin && (
          <button className={`btn btn-danger ${styles.deleteBtn}`} onClick={() => onDelete(todo.id)}>
            ✕ Delete
          </button>
        )}
      </div>
    </div>
  )
}
