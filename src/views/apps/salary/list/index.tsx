// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import SalaryListTable from './SalaryListTable'

// Component Imports

const SalaryList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SalaryListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default SalaryList
