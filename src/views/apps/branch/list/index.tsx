// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import BranchListTable from './BranchListTable'
import { Branches } from '@/types/branchTypes'
import { KeyedMutator } from 'swr'

const BranchList = ({ datas, mutate }: { datas?: Branches,   mutate: KeyedMutator<any>  }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BranchListTable tableData={datas} mutate={mutate}/>
      </Grid>
    </Grid>
  )
}

export default BranchList
