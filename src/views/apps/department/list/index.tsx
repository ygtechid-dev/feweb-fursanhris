// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import DepartmentListTable from './DepartmentListTable'
import { Department } from '@/types/departmentTypes'

// Component Imports

const DepartmentList = ({ datas }: { datas?: Department[]  })=> {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DepartmentListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default DepartmentList
