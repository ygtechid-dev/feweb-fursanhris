// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import ResignationListTable from './ResignationListTable'
import { Resignation } from '@/types/resignationTypes'

// Component Imports

const ResignationList = ({ datas }: { datas?: Resignation[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ResignationListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default ResignationList
