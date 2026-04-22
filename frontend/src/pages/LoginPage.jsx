import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './Auth.module.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/login', form)
      const d = res.data.data
      login({ userId: d.userId, email: d.email, role: d.role, token: d.token })
      toast('Welcome back!', 'success')
      navigate('/dashboard')
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>TaskFlow</span>
        </div>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.sub}>Welcome back — let's get things done.</p>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com" className="input" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="••••••••" className="input" required />
          </div>
          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgot}>Forgot password?</Link>
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign in →'}
          </button>
        </form>
        <p className={styles.switchText}>
          Don't have an account? <Link to="/register" className={styles.switchLink}>Register</Link>
        </p>
      </div>
    </div>
  )
}
