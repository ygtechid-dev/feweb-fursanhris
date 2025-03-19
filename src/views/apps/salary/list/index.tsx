// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { Employee, UsersType } from '@/types/apps/userTypes'
import SalaryListTable from './SalaryListTable'

// Component Imports

const SalaryList = ({ datas }: { datas?: Employee[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SalaryListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default SalaryList
