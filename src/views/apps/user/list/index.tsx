// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { User } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards from './UserListCards'
import { KeyedMutator } from 'swr'

const UserList = ({ datas, mutate }: { datas?: User[],   mutate: KeyedMutator<any>  }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <UserListCards />
      </Grid> */}
      <Grid item xs={12}>
        <UserListTable tableData={datas} mutate={mutate}/>
      </Grid>
    </Grid>
  )
}

export default UserList
