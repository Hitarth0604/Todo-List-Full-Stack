import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useToast } from '../context/ToastContext'
import styles from './Auth.module.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImg = (e) => {
    const f = e.target.files[0]
    if (f) {
      setImage(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!image) { toast('Please upload a profile picture', 'error'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('password', form.password)
      fd.append('image', image)
      await api.post('/signup', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast('Account created! Please sign in.', 'success')
      navigate('/login')
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error')
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
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Join TaskFlow and start managing your tasks.</p>
        <form onSubmit={submit} className={styles.form}>
          {/* Avatar upload */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.5rem' }}>
            <label style={{ cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
              <div style={{
                width:72, height:72, borderRadius:'50%',
                border: preview ? '2px solid var(--accent)' : '2px dashed var(--border2)',
                overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center',
                background:'var(--bg3)', transition:'border-color var(--transition)',
              }}>
                {preview
                  ? <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span style={{ fontSize:'1.5rem', color:'var(--text3)' }}>+</span>
                }
              </div>
              <span style={{ fontSize:'0.75rem', color:'var(--text3)' }}>Upload photo</span>
              <input type="file" accept="image/*" onChange={handleImg} style={{ display:'none' }} />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input name="name" value={form.name} onChange={handle}
              placeholder="Your name" className="input" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com" className="input" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="Min. 6 characters" className="input" required minLength={6} />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create account →'}
          </button>
        </form>
        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
