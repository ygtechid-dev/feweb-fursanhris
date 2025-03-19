// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import TripListTable from './TripListTable'
import { Trip } from '@/types/tripTypes'

// Component Imports

const TripList = ({ datas }: { datas?: Trip[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TripListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default TripList
