// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import AttendanceListTable from './AttendanceListTable'

// Component Imports

const AttendanceList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AttendanceListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default AttendanceList
