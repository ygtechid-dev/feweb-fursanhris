// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import DepartmentListTable from './DepartmentListTable'

// Component Imports

const DepartmentList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DepartmentListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default DepartmentList
