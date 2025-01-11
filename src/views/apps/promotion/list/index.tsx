// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import PromotionListTable from './PromotionListTable'

// Component Imports

const PromotionList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PromotionListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default PromotionList
