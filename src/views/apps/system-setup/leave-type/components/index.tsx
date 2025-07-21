// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import { Branches } from '@/types/branchTypes'
import { KeyedMutator } from 'swr'
import { LeaveType } from '@/types/leaveTypes'
import LeaveTypeListTable from './LeaveTypeListTable'

const LeaveTypeList = ({ datas }: { datas?: LeaveType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LeaveTypeListTable tableData={datas}/>
      </Grid>
    </Grid>
  )
}

export default LeaveTypeList
