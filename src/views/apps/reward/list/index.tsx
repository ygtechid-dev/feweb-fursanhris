// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import RewardListTable from './RewardListTable'

// Component Imports

const RewardList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RewardListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default RewardList
