// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CompanyListTable from './EmployeeListTable'
import CompanyListCards from './EmployeeListCards'
import EmployeeListTable from './EmployeeListTable'

const EmployeeList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <CompanyListCards />
      </Grid> */}
      <Grid item xs={12}>
        <EmployeeListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default EmployeeList
