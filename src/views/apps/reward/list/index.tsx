// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import RewardListTable from './RewardListTable'
import { Reward } from '@/types/rewardTypes'

// Component Imports

const RewardList = ({ datas }: { datas?: Reward[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RewardListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default RewardList
