// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import TerminationListTable from './TerminationListTable'
import { Termination } from '@/types/terminationTypes'

// Component Imports

const TerminationList = ({ datas }: { datas?: Termination[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TerminationListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default TerminationList
