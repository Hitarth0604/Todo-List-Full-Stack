import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/profile/${user.email}`)
        setProfile(res.data.data)
        setForm({ name: res.data.data.name, email: res.data.data.email })
      } catch {
        toast('Failed to load profile', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user.email])

  const handleImg = (e) => {
    const f = e.target.files[0]
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)) }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!image && editMode) {
      toast('Please select a new profile image', 'error')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('image', image)
      await api.put(`/profile/${user.userId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      // Update auth context with new email if changed
      login({ ...user, email: form.email })
      toast('Profile updated!', 'success')
      setEditMode(false)
      setImage(null)
      setPreview(null)
      setProfile({ ...profile, ...form })
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = preview ||
    (profile?.img ? `data:image/jpeg;base64,${profile.img}` : null)

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}>
              <span className="spinner" style={{ width:32, height:32, borderWidth:3 }} />
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrap}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt="Profile" className={styles.avatarImg} />
                    : <span className={styles.avatarFallback}>{profile?.name?.[0]?.toUpperCase() || '?'}</span>
                  }
                  {editMode && (
                    <label className={styles.avatarEdit}>
                      ✎
                      <input type="file" accept="image/*" onChange={handleImg} style={{ display:'none' }} />
                    </label>
                  )}
                </div>
                <div className={styles.avatarInfo}>
                  <h2 className={styles.name}>{profile?.name}</h2>
                  <span className={styles.roleChip} style={
                    user.role === 'ADMIN'
                      ? { background:'var(--orange-dim)', color:'var(--orange)', borderColor:'rgba(255,140,66,0.3)' }
                      : { background:'var(--accent-dim)', color:'var(--accent2)', borderColor:'rgba(124,106,255,0.3)' }
                  }>
                    {user.role === 'ADMIN' ? '⚡ Admin' : '◎ User'}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={save} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  {editMode
                    ? <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    : <span className={styles.val}>{profile?.name}</span>
                  }
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  {editMode
                    ? <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    : <span className={styles.val} style={{ fontFamily:'var(--font-mono)', fontSize:'0.875rem' }}>{profile?.email}</span>
                  }
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Role</label>
                  <span className={styles.val}>{user.role}</span>
                </div>

                <div className={styles.actions}>
                  {editMode ? (
                    <>
                      <button type="button" className="btn btn-ghost" onClick={() => { setEditMode(false); setImage(null); setPreview(null) }}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <span className="spinner" /> : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-ghost" onClick={() => setEditMode(true)}>
                      ✎ Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
