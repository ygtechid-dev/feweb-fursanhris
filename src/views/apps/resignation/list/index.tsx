// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import ResignationListTable from './ResignationListTable'

// Component Imports

const ResignationList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ResignationListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default ResignationList
