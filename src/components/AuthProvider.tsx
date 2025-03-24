'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import axiosInstance from '@/libs/axios'
import { Locale } from '@/configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'
import { User } from '@/types/apps/userTypes'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children, lang }: { children: React.ReactNode, lang: Locale }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const login = `/${lang}/login`

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token')
      }
      const response = await axiosInstance.get('/me')
      setUser(response.data?.data?.user)
    } catch (error) {
      console.log('masuk sini auth provider')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace(login)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = login;
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
