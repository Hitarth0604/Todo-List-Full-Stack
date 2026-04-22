import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>TaskFlow</span>
        </Link>

        <div className={styles.right}>
          {isAdmin && (
            <span className={styles.adminBadge}>
              ⚡ Admin
            </span>
          )}
          <Link to="/profile" className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}>
            Profile
          </Link>
          <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={handleLogout}>
            Sign out
          </button>
          <div className={styles.avatar}>
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </nav>
  )
}
