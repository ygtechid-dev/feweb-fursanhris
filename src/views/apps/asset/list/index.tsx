// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import AssetListTable from './AssetListTable'
import { Asset } from '@/types/assetType'

// Component Imports

const AssetList = ({ datas }: { datas?: Asset[]}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AssetListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default AssetList
