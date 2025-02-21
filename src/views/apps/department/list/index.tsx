// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import DepartmentListTable from './DepartmentListTable'
import { KeyedMutator } from 'swr'
import { Department } from '@/types/departmentTypes'

// Component Imports

const DepartmentList = ({ datas, mutate }: { datas?: Department[],   mutate: KeyedMutator<any>  })=> {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DepartmentListTable tableData={datas}  mutate={mutate}/>
      </Grid>
    </Grid>
  )
}

export default DepartmentList
