// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import OvertimeListTable from './OvertimeListTable'
import { KeyedMutator } from 'swr'
import { Overtime } from '@/types/overtimeType'

// Component Imports

const OvertimeList = ({ datas, mutate }: { datas?: Overtime[], mutate: KeyedMutator<any> }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OvertimeListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default OvertimeList
