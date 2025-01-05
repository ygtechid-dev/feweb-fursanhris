// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import BranchListTable from './BranchListTable'

const BranchList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BranchListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default BranchList
