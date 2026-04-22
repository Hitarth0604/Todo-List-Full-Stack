import React, { useState, useEffect } from 'react'
import styles from './TodoModal.module.css'

const STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']

const defaultForm = {
  title: '',
  description: '',
  status: 'NOT_STARTED',
  startDate: '',
  completionDate: '',
}

export default function TodoModal({ open, onClose, onSubmit, initial, loading }) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        status: initial.status || 'NOT_STARTED',
        startDate: initial.startDate ? initial.startDate.substring(0, 10) : '',
        completionDate: initial.completionDate ? initial.completionDate.substring(0, 10) : '',
      })
    } else {
      setForm(defaultForm)
    }
  }, [initial, open])

  if (!open) return null

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      startDate: form.startDate || null,
      completionDate: form.completionDate || null,
    })
  }

  const isEdit = !!initial

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Title *</label>
            <input name="title" value={form.title} onChange={handle}
              placeholder="What needs to be done?" className="input" required />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description *</label>
            <textarea name="description" value={form.description} onChange={handle}
              placeholder="Add more details..." className={`input ${styles.textarea}`} required rows={3} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <div className={styles.statusGroup}>
              {STATUSES.map(s => (
                <button type="button" key={s}
                  className={`${styles.statusBtn} ${form.status === s ? styles.statusActive : ''}`}
                  style={form.status === s ? getStatusStyle(s) : {}}
                  onClick={() => setForm({ ...form, status: s })}>
                  {getStatusIcon(s)} {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Start Date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handle} className="input" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Due Date</label>
              <input name="completionDate" type="date" value={form.completionDate} onChange={handle} className="input" />
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function getStatusIcon(s) {
  if (s === 'NOT_STARTED') return '○'
  if (s === 'IN_PROGRESS') return '◑'
  return '●'
}

function getStatusStyle(s) {
  if (s === 'NOT_STARTED') return { background: 'var(--bg4)', color: 'var(--text2)', borderColor: 'var(--border2)' }
  if (s === 'IN_PROGRESS') return { background: 'var(--yellow-dim)', color: 'var(--yellow)', borderColor: 'rgba(245,213,71,0.3)' }
  return { background: 'var(--green-dim)', color: 'var(--green)', borderColor: 'rgba(61,219,168,0.3)' }
}
