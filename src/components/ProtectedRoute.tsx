// 'use client'
// import { useAuth } from './AuthProvider'
// import { useRouter, usePathname } from 'next/navigation'
// import { useEffect } from 'react'
// import Loading from '@/components/Loading'
// import { Locale } from '@/configs/i18n'

// export const ProtectedRoute = ({ children, lang }: { children: React.ReactNode, lang: Locale }) => {
//   const { user, loading } = useAuth()
//   const router = useRouter()
//   const pathname = usePathname()
//   const login = `/${lang}/login`

//   useEffect(() => {
//     if (!loading && !user && pathname !== login) {
//       console.log("masuk sini protected route")
//       router.replace(login)
//     }
//   }, [user, loading, router, pathname])

//   if (loading) return <Loading />

//   return <>{children}</>
// }

'use client'
import { useAuth } from './AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import { Locale } from '@/configs/i18n'

export const ProtectedRoute = ({ children, lang }: { children: React.ReactNode, lang: Locale }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const login = `/${lang}/login`
  const dashboard = `/${lang}/dashboard`
  
  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== login && !pathname.includes('/login')) {
        console.log("Redirecting to login page")
        router.replace(login)
      } else if (user && (pathname === login || pathname === `/${lang}` || pathname === '/')) {
        // If logged in and on login page, redirect to dashboard
        console.log("Redirecting to dashboard")
        router.replace(dashboard)
      }
    }
  }, [user, loading, router, pathname, login, dashboard, lang])
  
  // Show loading while checking auth
  if (loading) return <Loading />
  
  // For protected routes: only render if user exists or we're on login page
  if (!user && pathname !== login && !pathname.includes('/login')) {
    return <Loading />
  }
  
  // Otherwise render the children
  return <>{children}</>
}
