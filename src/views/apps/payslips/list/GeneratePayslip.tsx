// React Imports
import { useState, useEffect } from 'react'
// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Button } from '@mui/material'
import { Payslip } from '@/types/payslipTypes'
import axios from 'axios'
import axiosInstance from '@/libs/axios'
import { toast } from 'react-toastify'
import { useSWRConfig } from 'swr'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

const GeneratePayslip = ({  tableData }: {  tableData?: Payslip[] }) => {
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [alert, setAlert] = useState<{
    open: boolean,
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  }>({
    open: false,
    message: '',
    severity: 'info'
  })

  const { mutate: swrMutate } = useSWRConfig();

  // Get current month and year for default selection
  useEffect(() => {
    const currentDate = new Date()
    setMonth((currentDate.getMonth() + 1).toString())
    setYear(currentDate.getFullYear().toString())
  }, [])

  // Filter payslip data based on selected month and year
  // useEffect(() => {
  //   if (tableData && (month || year)) {
  //     const filteredData = tableData.filter(payslip => {
  //       const monthMatch = month ? payslip.month.toString() === month : true
  //       const yearMatch = year ? payslip.year.toString() === year : true
        
  //       return monthMatch && yearMatch
  //     })
      
  //     // setData(filteredData || [])
  //   } else {
  //     // setData(tableData || [])
  //   }
  // }, [tableData, month, year])

  // Generate payslip function
  const handleGeneratePayslip = async () => {

    if (!month || !year) {
      toast.warning('Please select both month and year')
      return
    }
    
    setLoading(true)
    try {
      const response = await axiosInstance.post('/web/payslips/generate', { 
        month, 
        year 
      })
      
      if (response.data.status) {
        swrMutate('/web/payslips');
        toast.success(response.data?.message || 'Payslips generated successfully')
      }
    } catch (error: any) {
      console.error('Error generating payslip:', error)
      
      // Menampilkan pesan error dari response
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Error generating payslip'
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }))
  }

  // Generate month options
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  // Generate year options (current year and 5 years before and after)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
  const {dictionary} = useDictionary()

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-month'
            label={dictionary['content'].month}
            value={month}
            onChange={e => setMonth(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Month</MenuItem>
            {months.map(monthOption => (
              <MenuItem key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-year'
            label={dictionary['content'].year}
            value={year}
            onChange={e => setYear(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Year</MenuItem>
            {years.map(yearOption => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4} className='items-end'>
          <Button
            color='primary'
            variant='contained'
            startIcon={<i className='tabler-wand' />}
            className='max-sm:is-full'
            onClick={handleGeneratePayslip}
            disabled={loading}
          >
            {loading ? dictionary['content'].generating + '...' : dictionary['content'].generatePayslip}
          </Button>
        </Grid>
      </Grid>

      {/* <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar> */}
    </CardContent>
  )
}

export default GeneratePayslip
