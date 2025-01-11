// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import WarningListTable from './WarningListTable'

// Component Imports

const WarningList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <WarningListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default WarningList
