// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Payslip } from '@/types/payslipTypes'

const TableFilters = ({ setData, tableData }: { setData: (data: Payslip[]) => void; tableData?: Payslip[] }) => {
  // States
  // const [role, setRole] = useState<Payslip['role']>('')
  // const [plan, setPlan] = useState<Payslip['currentPlan']>('')
  // const [status, setStatus] = useState<Payslip['status']>('')

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      // if (role && user.role !== role) return false
      // if (plan && user.currentPlan !== plan) return false
      // if (status && user.status !== status) return false

      return true
    })

    setData(filteredData || [])
  }, [tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e => setRole(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='author'>Author</MenuItem>
            <MenuItem value='editor'>Editor</MenuItem>
            <MenuItem value='maintainer'>Maintainer</MenuItem>
            <MenuItem value='subscriber'>Subscriber</MenuItem>
          </CustomTextField>
        </Grid> */}
        {/* <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-plan'
            value={plan}
            onChange={e => setPlan(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Plan</MenuItem>
            <MenuItem value='basic'>Basic</MenuItem>
            <MenuItem value='company'>Company</MenuItem>
            <MenuItem value='enterprise'>Enterprise</MenuItem>
            <MenuItem value='team'>Team</MenuItem>
          </CustomTextField>
        </Grid> */}
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            // onChange={e => setStatus(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Company</MenuItem>
            {/* <MenuItem value='pending'>Pending</MenuItem> */}
            <MenuItem value='active'>ABC</MenuItem>
            <MenuItem value='inactive'>BCA</MenuItem>
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
      </Grid>
    </CardContent>
  )
}

export default TableFilters
