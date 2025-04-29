import { useQuery } from '@tanstack/react-query'
import { getReimbursementTypes } from '@/services/reimbursementService'
import { ReimbursementCategory } from '@/types/reimburseTypes'

const useReimbursementCategory = () => {
  return useQuery<ReimbursementCategory[]>({
    queryKey: ['reimbursementTypes'],
    queryFn: async () => {
      const response = await getReimbursementTypes()
      return response.data
    },
    // Don't fetch automatically on mount
    enabled: false,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache data for 10 minutes
    gcTime: 10 * 60 * 1000,
  })
}

export default useReimbursementCategory
