// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import AttendanceListTable from './AttendanceListTable'
import { AttendanceEmployee } from '@/types/attendanceEmployeeTypes'
import { KeyedMutator } from 'swr'

// Component Imports

const AttendanceList = ({ datas, mutate }: { datas?: AttendanceEmployee[], mutate: KeyedMutator<any> }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AttendanceListTable tableData={datas} mutate={mutate}/>
      </Grid>
    </Grid>
  )
}

export default AttendanceList
