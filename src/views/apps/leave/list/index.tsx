// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import LeaveListTable from './LeaveListTable'

// Component Imports

const LeaveList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LeaveListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default LeaveList
