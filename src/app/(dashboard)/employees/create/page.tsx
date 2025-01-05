// MUI Imports
import ProductAddHeader from '@/views/apps/employee/add/ProductAddHeader'
import PersonalDetail from '@/views/apps/employee/add/PersonalDetail'
import Grid from '@mui/material/Grid'
import CompanyDetail from '@/views/apps/employee/add/CompanyDetail'
import Document from '@/views/apps/employee/add/Document'
import BankAccount from '@/views/apps/employee/add/BankAccount'

// Component Imports

const eCommerceProductsAdd = () => {
  return (
    <Grid container  spacing={6}>
      <Grid item xs={12}>
        <ProductAddHeader />
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <PersonalDetail />
          </Grid>
        </Grid>
      </Grid>
      <Grid  item xs={12} md={6}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <CompanyDetail />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Document />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <BankAccount />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsAdd
