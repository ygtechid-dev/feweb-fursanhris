'use client'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import { Locale } from '@/configs/i18n'

export const PublicRoute = ({ children, lang }: { children: React.ReactNode, lang:Locale }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!loading && user) {
      router.replace(`/`) // go to dashboard
    }
  }, [user, loading, router])

  if (loading) return <Loading />

  return <>{children}</>
}
