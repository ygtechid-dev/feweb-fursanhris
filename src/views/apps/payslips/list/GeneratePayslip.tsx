// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Button } from '@mui/material'

const GeneratePayslip = ({ setData, tableData }: { setData: (data: UsersType[]) => void; tableData?: UsersType[] }) => {
  // States
  const [role, setRole] = useState<UsersType['role']>('')
  const [plan, setPlan] = useState<UsersType['currentPlan']>('')
  const [status, setStatus] = useState<UsersType['status']>('')

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (role && user.role !== role) return false
      if (plan && user.currentPlan !== plan) return false
      if (status && user.status !== status) return false

      return true
    })

    setData(filteredData || [])
  }, [role, plan, status, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
      
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            // onChange={e => setStatus(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Month</MenuItem>
            {/* <MenuItem value='pending'>Pending</MenuItem> */}
            <MenuItem value='active'>Jan</MenuItem>
            <MenuItem value='inactive'>Feb</MenuItem>
            <MenuItem value='inactive'>Mar</MenuItem>
            <MenuItem value='inactive'>Apr</MenuItem>
            <MenuItem value='inactive'>May</MenuItem>
            <MenuItem value='inactive'>Jun</MenuItem>
            <MenuItem value='inactive'>Jul</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            // onChange={e => setStatus(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Year</MenuItem>
            {/* <MenuItem value='pending'>Pending</MenuItem> */}
            <MenuItem value='active'>2020</MenuItem>
            <MenuItem value='inactive'>2021</MenuItem>
            <MenuItem value='inactive'>2022</MenuItem>
            <MenuItem value='inactive'>2023</MenuItem>
            <MenuItem value='inactive'>2024</MenuItem>
            <MenuItem value='inactive'>2025</MenuItem>
            <MenuItem value='inactive'>2026</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
           <Button
              color='primary'
              variant='contained'
              startIcon={<i className='tabler-wand' />}
              className='max-sm:is-full'
            >
              Generate
            </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default GeneratePayslip
