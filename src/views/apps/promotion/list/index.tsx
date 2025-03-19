// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import PromotionListTable from './PromotionListTable'
import { Promotion } from '@/types/promotionTypes'

// Component Imports

const PromotionList = ({ datas }: { datas?: Promotion[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PromotionListTable tableData={datas} />
      </Grid>
    </Grid>
  )
}

export default PromotionList
