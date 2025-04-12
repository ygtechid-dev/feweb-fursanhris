// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAuth } from '@/components/AuthProvider'
import { Designation } from '@/types/designationTypes'
import useCompanies from '@/hooks/useCompanies'

const TableFilters = ({ setData, tableData }: { setData: (data: Designation[]) => void; tableData?: Designation[] }) => {
// States
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const { user } = useAuth()
  const { companies } = useCompanies()

  useEffect(() => {
    const filteredData = tableData?.filter(branch => {
      // Filter by company if a company is selected
      if (selectedCompany && branch?.created_by !== Number(selectedCompany)) return false
      
      return true
    })
    
    setData(filteredData || [])
  }, [tableData, selectedCompany, setData])

 

  return (
    <CardContent>
      <Grid container spacing={6}>
        {user?.type === 'super admin' && (
          <Grid item xs={12} sm={4}>
            <CustomTextField
              select
              fullWidth
              id='select-company'
              label="Company"
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>Select Company</MenuItem>
              {companies.map(company => (
                <MenuItem key={company.id} value={company.id}>
                  {company.first_name} {company.last_name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        )}
      </Grid>
    </CardContent>
  )
}

export default TableFilters
