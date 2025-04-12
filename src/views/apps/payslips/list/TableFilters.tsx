// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Payslip } from '@/types/payslipTypes'
import { useAuth } from '@/components/AuthProvider'
import useCompanies from '@/hooks/useCompanies'

const TableFilters = ({ setData, tableData }: { setData: (data: Payslip[]) => void; tableData?: Payslip[] }) => {
  // States
  const { user } = useAuth()
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const { companies } = useCompanies()

  // Dynamically generate years (from 5 years back to 5 years in the future)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 5
    const endYear = currentYear + 5
    const years = []
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString())
    }
    
    return years
  }, [])

  useEffect(() => {
    const filteredData = tableData?.filter(payslip => {
      // Filter by company if a company is selected
      if (selectedCompany && payslip?.created_by !== Number(selectedCompany)) return false
      
      // Filter by month if a month is selected
      if (selectedMonth && payslip.month !== selectedMonth) return false
      
      // Filter by year if a year is selected
      if (selectedYear && payslip.year !== selectedYear) return false
      
      return true
    })
    
    setData(filteredData || [])
  }, [tableData, selectedCompany, selectedMonth, selectedYear, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        {user?.type === 'super admin' && (
          <Grid item xs={12} sm={4}>
            <CustomTextField
              select
              fullWidth
              defaultValue=""
              label="Company"
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">Select Company</MenuItem>
              {companies.map(company => (
                <MenuItem key={company.id} value={company.id}>
                  {company.first_name} {company.last_name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        )}
        
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            defaultValue=""
            label="Month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="">Select Month</MenuItem>
            <MenuItem value="1">Jan</MenuItem>
            <MenuItem value="2">Feb</MenuItem>
            <MenuItem value="3">Mar</MenuItem>
            <MenuItem value="4">Apr</MenuItem>
            <MenuItem value="5">May</MenuItem>
            <MenuItem value="6">Jun</MenuItem>
            <MenuItem value="7">Jul</MenuItem>
            <MenuItem value="8">August</MenuItem>
            <MenuItem value="9">Sept</MenuItem>
            <MenuItem value="10">Okt</MenuItem>
            <MenuItem value="11">Nov</MenuItem>
            <MenuItem value="12">Des</MenuItem>
          </CustomTextField>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            defaultValue=""
            label="Year"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="">Select Year</MenuItem>
            {yearOptions.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
