// React Imports
import { useState, useEffect, useMemo } from 'react'
// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
// Type Imports
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { AttendanceEmployee } from '@/types/attendanceEmployeeTypes'
import { useAuth } from '@/components/AuthProvider'
import useCompanies from '@/hooks/useCompanies'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

const TableFilters = ({ setData, tableData }: { setData: (data: AttendanceEmployee[]) => void; tableData?: AttendanceEmployee[] }) => {
  // States
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  
  const { user } = useAuth()
  const { companies } = useCompanies()
  const { dictionary } = useDictionary();

  // Get unique employees from tableData
  const uniqueEmployees = useMemo(() => {
    if (!tableData) return []
    
    const employees = tableData.map(item => item.employee_name)
    return [...new Set(employees)].sort()
  }, [tableData])

  // Get unique dates from tableData
  const uniqueDates = useMemo(() => {
    if (!tableData) return []
    
    const dates = tableData.map(item => item.date)
    return [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort descending (newest first)
  }, [tableData])

  useEffect(() => {
    const filteredData = tableData?.filter(item => {
      // Filter by company if a company is selected
      if (selectedCompany && item?.created_by !== Number(selectedCompany)) return false
      
      // Filter by date if a date is selected
      if (selectedDate && item?.date !== selectedDate) return false
      
      // Filter by employee if an employee is selected
      if (selectedEmployee && item?.employee_name !== selectedEmployee) return false
      
      return true
    })
    
    setData(filteredData || [])
  }, [tableData, selectedCompany, selectedDate, selectedEmployee, setData])

  const handleClearFilters = () => {
    setSelectedCompany('')
    setSelectedDate('')
    setSelectedEmployee('')
  }

  return (
    <CardContent>
      <Grid container spacing={6}>
        {user?.type === 'super admin' && (
          <Grid item xs={12} sm={4}>
            <CustomTextField
              select
              fullWidth
              id='select-company'
              label={dictionary['content'].company}
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>{dictionary['content'].select} {dictionary['content'].company}</MenuItem>
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
            id='select-date'
            label={dictionary['content']?.date || 'Date'}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>{dictionary['content']?.select || 'Select'} {dictionary['content']?.date || 'Date'}</MenuItem>
            {uniqueDates.map(date => (
              <MenuItem key={date} value={date}>
                {new Date(date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-employee'
            label={dictionary['content']?.employee || 'Employee'}
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>{dictionary['content']?.select || 'Select'} {dictionary['content']?.employee || 'Employee'}</MenuItem>
            {uniqueEmployees.map(employee => (
              <MenuItem key={employee} value={employee}>
                {employee}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Optional: Add Clear Filters Button */}
        {(selectedCompany || selectedDate || selectedEmployee) && (
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              value="Clear All Filters"
              onClick={handleClearFilters}
              style={{ cursor: 'pointer' }}
              InputProps={{
                readOnly: true,
                style: { cursor: 'pointer', backgroundColor: '#f5f5f5' }
              }}
            />
          </Grid>
        )}
      </Grid>
    </CardContent>
  )
}

export default TableFilters
