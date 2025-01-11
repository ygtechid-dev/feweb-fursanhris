// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import TerminationListTable from './WarningListTable'

// Component Imports

const TerminationList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TerminationListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default TerminationList
