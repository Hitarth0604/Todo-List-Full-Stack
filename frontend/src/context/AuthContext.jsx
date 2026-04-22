import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('auth') }
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    // data: { userId, email, role, token }
    setUser(data)
    localStorage.setItem('auth', JSON.stringify(data))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
