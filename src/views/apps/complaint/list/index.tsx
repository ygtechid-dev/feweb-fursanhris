// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import ComplaintListTable from './ComplaintListTable'

// Component Imports

const ComplaintList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComplaintListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default ComplaintList
