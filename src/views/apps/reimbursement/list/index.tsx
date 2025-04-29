// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import ReimbursementListTable from './ReimbursementListTable'
import { Reimbursement } from '@/types/reimburseTypes'

// Component Imports

const ReimbursementList = ({ datas }: { datas?: Reimbursement[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReimbursementListTable tableData={datas}/>
      </Grid>
    </Grid>
  )
}

export default ReimbursementList
