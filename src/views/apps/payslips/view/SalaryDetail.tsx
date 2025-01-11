// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import SalaryDetailTable from './SalaryDetailTable'

// Component Imports

const SalaryDetail = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SalaryDetailTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default SalaryDetail
