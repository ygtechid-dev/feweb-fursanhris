// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import DesignationListTable from './DesignationListTable'

// Component Imports

const DesignationList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DesignationListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default DesignationList
