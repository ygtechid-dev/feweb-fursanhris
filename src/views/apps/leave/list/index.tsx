// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import LeaveListTable from './LeaveListTable'
import { Leave } from '@/types/leaveTypes'

// Component Imports

const LeaveList = ({ datas }: { datas?: Leave[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LeaveListTable tableData={datas}/>
      </Grid>
    </Grid>
  )
}

export default LeaveList
