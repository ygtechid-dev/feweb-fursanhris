// hooks/useCompanies.ts
import { useState, useEffect } from 'react'
import { fetchCompanies } from '@/services/userService'
import { Company } from '@/types/companyTypes'

const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true)
      try {
        const companiesData = await fetchCompanies()
        setCompanies(companiesData)
        setError(null)
      } catch (error) {
        console.error('Error loading companies:', error)
        setError(error instanceof Error ? error : new Error('Failed to load companies'))
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanies()
  }, [])

  return { companies, isLoading, error }
}

export default useCompanies
