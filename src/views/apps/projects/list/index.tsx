// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import ProjectListTable from './ProjectListTable'

// Component Imports

const ProjectList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProjectListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default ProjectList
