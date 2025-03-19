// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import ProjectListTable from './ProjectListTable'
import { Project } from '@/types/projectTypes'

// Component Imports

const ProjectList = ({ datas }: { datas?: Project[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProjectListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default ProjectList
