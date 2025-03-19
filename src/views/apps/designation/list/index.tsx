// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import DesignationListTable from './DesignationListTable'
import { Designation } from '@/types/designationTypes'

// Component Imports

const DesignationList =  ({ datas }: { datas?: Designation[]}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DesignationListTable tableData={datas}/>
      </Grid>
    </Grid>
  )
}

export default DesignationList
