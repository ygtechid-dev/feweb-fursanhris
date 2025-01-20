// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import DocumentListTable from './WarningListTable'

// Component Imports

const DocumentList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DocumentListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default DocumentList
