// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Role } from '@/types/userTypes'
import { User } from '@/types/apps/userTypes'
import { DictionaryType } from '@/@core/types'

const TableFilters = ({ setData, tableData, roles }: { setData: (data: User[]) => void; tableData?: User[], roles: Role[] }) => {
  // States
  const [role, setRole] = useState<Role | string>('')
  // const [plan, setPlan] = useState<User['currentPlan']>('')
  const [status, setStatus] = useState<User['is_active']>(1)

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (role && user.type !== role) return false
      console.log({status, user:user.is_active})
      if (user.is_active != status) return false

      return true
    })

    setData(filteredData || [])
  }, [role, status, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e => setRole(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            {roles.map(role => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
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
            onChange={e => setStatus(parseInt(e.target.value))}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value='1'>Active</MenuItem>
            <MenuItem value='0'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
