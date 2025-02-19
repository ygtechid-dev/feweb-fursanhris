// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import LeaveListTable from './LeaveListTable'
import { Leave } from '@/types/leaveTypes'
import { KeyedMutator } from 'swr'

// Component Imports

const LeaveList = ({ datas, mutate }: { datas?: Leave[], mutate: KeyedMutator<any> }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LeaveListTable tableData={datas}  mutate={mutate}/>
      </Grid>
    </Grid>
  )
}

export default LeaveList
