import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useToast } from '../context/ToastContext'
import styles from './Auth.module.css'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/forgotpassword/${email}`)
      toast('OTP sent to your email', 'success')
      setStep(2)
    } catch { toast('Email not found', 'error') }
    finally { setLoading(false) }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/verify-otp', { email, otp })
      toast('OTP verified!', 'success')
      setStep(3)
    } catch { toast('Invalid or expired OTP', 'error') }
    finally { setLoading(false) }
  }

  const resetPwd = async (e) => {
    e.preventDefault()
    if (password !== confirm) { toast('Passwords do not match', 'error'); return }
    setLoading(true)
    try {
      await api.post('/reset-password', { email, password })
      toast('Password reset successfully!', 'success')
      navigate('/login')
    } catch { toast('Reset failed, try again', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>TaskFlow</span>
        </div>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.sub}>Follow the steps to recover your account.</p>

        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          {[1,2,3].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`${styles.step} ${step === s ? styles.active : step > s ? styles.done : ''}`}>
                {step > s ? '✓' : s}
              </div>
              {i < 2 && <div className={styles.stepLine} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={sendOtp} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className="input" required />
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send OTP →'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={verifyOtp} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Enter OTP</label>
              <input value={otp} onChange={e => setOtp(e.target.value)}
                placeholder="6-digit code" className="input" required maxLength={6} style={{ letterSpacing:'0.3em', textAlign:'center', fontSize:'1.2rem' }} />
              <span style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:'0.3rem' }}>OTP valid for 5 minutes</span>
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Verify OTP →'}
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={resetPwd} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters" className="input" required minLength={6} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password" className="input" required />
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Reset Password →'}
            </button>
          </form>
        )}

        <p className={styles.switchText}>
          Remembered it? <Link to="/login" className={styles.switchLink}>Back to login</Link>
        </p>
      </div>
    </div>
  )
}
