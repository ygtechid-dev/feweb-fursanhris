// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CompanyListTable from './CompanyListTable'
import CompanyListCards from './CompanyListCards'

const CompanyList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CompanyListCards />
      </Grid>
      <Grid item xs={12}>
        <CompanyListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default CompanyList
