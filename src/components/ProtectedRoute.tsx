'use client'
import { useAuth } from './AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import { Locale } from '@/configs/i18n'

export const ProtectedRoute = ({ children, lang }: { children: React.ReactNode, lang: Locale }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const login = `/${lang}/login`

  useEffect(() => {
    if (!loading && !user && pathname !== login) {
      console.log("masuk sini protected route")
      router.replace(login)
    }
  }, [user, loading, router, pathname])

  if (loading) return <Loading />

  return <>{children}</>
}
