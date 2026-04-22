import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import TodoCard from '../components/TodoCard'
import TodoModal from '../components/TodoModal'
import SkeletonGrid from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'
import styles from './Dashboard.module.css'

const FILTERS = ['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const toast = useToast()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('my')  // 'my' | 'admin'

  // Admin panel state
  const [adminUsers, setAdminUsers] = useState([])
  const [adminTodos, setAdminTodos] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // todoId to delete

  // ─── Fetch user's todos ───────────────────────────────────────────────
  const fetchTodos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/gettodo/${user.userId}`)
      setTodos(res.data.data || [])
    } catch {
      toast('Failed to load tasks', 'error')
    } finally {
      setLoading(false)
    }
  }, [user.userId])

  useEffect(() => { fetchTodos() }, [fetchTodos])

  // ─── Admin: fetch all users ───────────────────────────────────────────
  const fetchAdminUsers = useCallback(async () => {
    if (!isAdmin) return
    setAdminLoading(true)
    try {
      const res = await api.get('/admin/users')
      setAdminUsers(res.data.data || [])
    } catch {
      toast('Could not load users', 'error')
    } finally {
      setAdminLoading(false)
    }
  }, [isAdmin])

  const fetchUserTodos = useCallback(async (uid) => {
    setAdminLoading(true)
    try {
      const res = await api.get(`/gettodo/${uid}`)
      setAdminTodos(res.data.data || [])
    } catch {
      toast('Could not load user todos', 'error')
    } finally {
      setAdminLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'admin' && isAdmin) fetchAdminUsers()
  }, [activeTab, isAdmin, fetchAdminUsers])

  // ─── CRUD ─────────────────────────────────────────────────────────────
  const handleCreate = async (form) => {
    setModalLoading(true)
    try {
      await api.post(`/addtodo/${user.userId}`, form)
      toast('Task created!', 'success')
      setModalOpen(false)
      fetchTodos()
    } catch {
      toast('Failed to create task', 'error')
    } finally {
      setModalLoading(false)
    }
  }

  const handleUpdate = async (form) => {
    setModalLoading(true)
    try {
      await api.put(`/updatetodo/${editing.id}/${user.userId}`, form)
      toast('Task updated!', 'success')
      setEditing(null)
      setModalOpen(false)
      fetchTodos()
      if (selectedUserId) fetchUserTodos(selectedUserId)
    } catch {
      toast('Failed to update task', 'error')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deleteTodo/${id}`)
      toast('Task deleted', 'success')
      setConfirmDelete(null)
      fetchTodos()
      if (selectedUserId) fetchUserTodos(selectedUserId)
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const openEdit = (todo) => {
    setEditing(todo)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  // ─── Filtered todos ───────────────────────────────────────────────────
  const filtered = todos.filter(t => {
    const matchFilter = filter === 'ALL' || t.status === filter
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // ─── Stats ────────────────────────────────────────────────────────────
  const stats = {
    total: todos.length,
    notStarted: todos.filter(t => t.status === 'NOT_STARTED').length,
    inProgress: todos.filter(t => t.status === 'IN_PROGRESS').length,
    completed: todos.filter(t => t.status === 'COMPLETED').length,
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              {isAdmin ? 'Control Panel' : 'My Tasks'}
            </h1>
            <p className={styles.pageSub}>
              {isAdmin
                ? `Logged in as Admin · ${user.email}`
                : `${stats.total} task${stats.total !== 1 ? 's' : ''} · ${stats.completed} completed`}
            </p>
          </div>
          {activeTab === 'my' && (
            <button className="btn btn-primary" onClick={openCreate}>
              + New Task
            </button>
          )}
        </div>

        {/* RBAC Tabs — only shown to admins */}
        {isAdmin && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'my' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('my')}>
              My Tasks
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'admin' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('admin')}>
              ⚡ Admin Panel
            </button>
          </div>
        )}

        {/* ── MY TASKS TAB ──────────────────────────────────────────── */}
        {activeTab === 'my' && (
          <>
            {/* Stats row */}
            <div className={styles.statsRow}>
              {[
                { label: 'Total', val: stats.total, color: 'var(--accent)' },
                { label: 'Not Started', val: stats.notStarted, color: 'var(--text3)' },
                { label: 'In Progress', val: stats.inProgress, color: 'var(--yellow)' },
                { label: 'Completed', val: stats.completed, color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} className={styles.statCard}
                  onClick={() => setFilter(s.label.toUpperCase().replace(' ', '_') === 'TOTAL' ? 'ALL' : s.label.toUpperCase().replace(' ', '_'))}
                  style={{ cursor: 'pointer' }}>
                  <span className={styles.statVal} style={{ color: s.color }}>{s.val}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Search + filter */}
            <div className={styles.controls}>
              <input
                className={`input ${styles.search}`}
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className={styles.filterGroup}>
                {FILTERS.map(f => (
                  <button key={f}
                    className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                    onClick={() => setFilter(f)}>
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Task grid */}
            {loading ? (
              <SkeletonGrid count={6} />
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>◎</span>
                <p>{search || filter !== 'ALL' ? 'No tasks match your filters.' : 'No tasks yet. Create your first!'}</p>
                {!search && filter === 'ALL' && (
                  <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: '1rem' }}>
                    + New Task
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map(t => (
                  <TodoCard key={t.id} todo={t} onEdit={openEdit}
                    onDelete={(id) => setConfirmDelete(id)}
                    isAdmin={isAdmin} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ADMIN PANEL TAB ───────────────────────────────────────── */}
        {activeTab === 'admin' && isAdmin && (
          <div className={styles.adminPanel}>
            <div className={styles.adminSidebar}>
              <div className={styles.sidebarHeader}>
                <span className={styles.sidebarTitle}>All Users</span>
                <span className={styles.userCount}>{adminUsers.length}</span>
              </div>
              {adminLoading && !selectedUserId ? (
                <div style={{ padding: '1rem', color: 'var(--text3)', fontSize: '0.85rem' }}>Loading...</div>
              ) : adminUsers.length === 0 ? (
                <div className={styles.noUsers}>No users found.<br />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                    Make sure <code>/admin/users</code> endpoint is implemented.
                  </span>
                </div>
              ) : (
                adminUsers.map(u => (
                  <button key={u.id}
                    className={`${styles.userItem} ${selectedUserId === u.id ? styles.userActive : ''}`}
                    onClick={() => { setSelectedUserId(u.id); fetchUserTodos(u.id) }}>
                    <div className={styles.userAvatar}>{u.email?.[0]?.toUpperCase()}</div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{u.name || u.email}</span>
                      <span className={styles.userEmail}>{u.email}</span>
                    </div>
                    {u.role === 'ADMIN' && <span className={styles.roleTag}>Admin</span>}
                  </button>
                ))
              )}
            </div>

            <div className={styles.adminContent}>
              {!selectedUserId ? (
                <div className={styles.selectPrompt}>
                  <span style={{ fontSize: '2rem' }}>👈</span>
                  <p>Select a user to view and manage their tasks</p>
                </div>
              ) : adminLoading ? (
                <SkeletonGrid count={4} />
              ) : adminTodos.length === 0 ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>◎</span>
                  <p>This user has no tasks.</p>
                </div>
              ) : (
                <>
                  <div className={styles.adminContentHeader}>
                    <span className={styles.adminContentTitle}>
                      {adminTodos.length} task{adminTodos.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text3)' }}>
                      Admin can edit or delete any task ⚡
                    </span>
                  </div>
                  <div className={styles.grid}>
                    {adminTodos.map(t => (
                      <TodoCard key={t.id} todo={t}
                        onEdit={openEdit}
                        onDelete={(id) => setConfirmDelete(id)}
                        isAdmin={isAdmin} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <TodoModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSubmit={editing ? handleUpdate : handleCreate}
        initial={editing}
        loading={modalLoading}
      />

      {/* Delete Confirm Dialog */}
      {confirmDelete && (
        <div className={styles.confirmOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>Delete this task?</h3>
            <p className={styles.confirmSub}>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
