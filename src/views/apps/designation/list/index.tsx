// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import DesignationListTable from './DesignationListTable'
import { KeyedMutator } from 'swr'
import { Designation } from '@/types/designationTypes'

// Component Imports

const DesignationList =  ({ datas, mutate }: { datas?: Designation[],   mutate: KeyedMutator<any>  }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DesignationListTable tableData={datas} mutate={mutate}/>
      </Grid>
    </Grid>
  )
}

export default DesignationList
