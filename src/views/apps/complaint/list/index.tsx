// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import ComplaintListTable from './ComplaintListTable'
import { Complaint } from '@/types/complaintTypes'

// Component Imports

const ComplaintList = ({ datas }: { datas?: Complaint[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComplaintListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default ComplaintList
