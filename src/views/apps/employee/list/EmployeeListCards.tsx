// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const data: UserDataType[] = [
  {
    title: 'Total Companies',
    stats: '21,459',
    avatarIcon: 'tabler-buildings',
    avatarColor: 'primary',
    trend: '',
    trendNumber: '',
    subtitle: ''
  },
  {
    title: 'Active Companies',
    stats: '4,567',
    avatarIcon: 'tabler-building',
    avatarColor: 'error',
    trend: '',
    trendNumber: '',
    subtitle: ''
  },
  {
    title: 'Inactive Companies',
    stats: '19,860',
    avatarIcon: 'tabler-building',
    avatarColor: 'success',
    trend: '',
    trendNumber: '',
    subtitle: ''
  },
  // {
  //   title: 'Pending Users',
  //   stats: '237',
  //   avatarIcon: 'tabler-user-search',
  //   avatarColor: 'warning',
  //   trend: 'positive',
  //   trendNumber: '42%',
  //   subtitle: ''
  // }
]

const EmployeeListCards = () => {
  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default EmployeeListCards
