// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import WarningListTable from './WarningListTable'
import { Warning } from '@/types/warningTypes'

// Component Imports

const WarningList = ({ datas }: { datas?: Warning[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <WarningListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default WarningList
