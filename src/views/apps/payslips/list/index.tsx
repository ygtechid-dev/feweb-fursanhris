// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import PayslipListTable from './PayslipListTable'

// Component Imports

const PayslipList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PayslipListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default PayslipList
