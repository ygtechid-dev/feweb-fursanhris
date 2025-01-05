// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import OvertimeListTable from './OvertimeListTable'

// Component Imports

const OvertimeList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OvertimeListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default OvertimeList
