// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import PayslipListTable from './PayslipListTable'
import { Payslip } from '@/types/payslipTypes'

// Component Imports

const PayslipList = ({ datas }: { datas?: Payslip[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PayslipListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default PayslipList
