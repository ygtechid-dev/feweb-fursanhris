// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import TripListTable from './TripListTable'

// Component Imports

const TripList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TripListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default TripList
