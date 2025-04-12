
'use client'
import CustomAvatar from "@/@core/components/mui/Avatar"
import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"
import { getCardStats } from "@/services/dashboardService"
import { CardStatsHorizontalWithBorderProps } from "@/types/pages/widgetTypes"
import { Card, CardContent, Grid, Typography } from "@mui/material"
import classNames from "classnames"
import { useEffect, useState } from "react"



const Page = () => {
  const{dictionary} = useDictionary()
  let statsHorizontalWithBorderObj: CardStatsHorizontalWithBorderProps[] = [
    {
      title: dictionary['content'].totalEmployee,
      stats: 0,
      trendNumber: 18.2,
      avatarIcon: 'tabler-users',
      color: 'primary'
    },
    {
      title: dictionary['content'].totalBranches,
      stats: 0,
      trendNumber: -8.7,
      avatarIcon: 'tabler-map-2',
      color: 'warning'
    },
    {
      title: dictionary['content'].todaysAttendance,
      stats: 0,
      trendNumber: 4.3,
      avatarIcon: 'tabler-user-down',
      color: 'error'
    },
    {
      title: dictionary['content'].todaysLeave,
      stats: 0,
      trendNumber: 2.5,
      avatarIcon: 'tabler-user-up',
      color: 'info'
    },
    {
      title: dictionary['content'].notPresentToday,
      stats: 0,
      trendNumber: 2.5,
      avatarIcon: 'tabler-clock-x',
      color: 'success'
    },
    {
      title: dictionary['content'].overtimeToday,
      stats: 0,
      trendNumber: 2.5,
      avatarIcon: 'tabler-clock-check',
      color: 'primary'
    },
  ]
  const [statsHorizontalWithBorder, setStatsHorizontalWithBorder] = useState<CardStatsHorizontalWithBorderProps[]>(statsHorizontalWithBorderObj);

  const fetchCardStats = async () => {
    try {
      const res = await getCardStats();
      
      if (res.status && res.data) {
        // Create a new array with updated stats
        const updatedStats = statsHorizontalWithBorder.map(stat => {
          let newStat = { ...stat };
          
          // Match the card title with the corresponding data from API
          if (stat.title === 'Total Employee') {
            newStat.stats = res.data.countEmployee;
          } else if (stat.title === 'Total Branches') {
            newStat.stats = res.data.countBranch;
          } else if (stat.title === 'Today\'s Attendance') {
            newStat.stats = res.data.countTodayAttendance;
          } else if (stat.title === 'Today\'s Leave') {
            newStat.stats = res.data.countTodayLeave;
          } else if (stat.title === 'Not Present Today') {
            newStat.stats = res.data.notPresentTodays?.length || 0;
          } else if (stat.title === 'Overtime Today') {
            newStat.stats = res.data.countTodayOvertime;
          }
          
          return newStat;
        });
        
        // Update the state with new data
        setStatsHorizontalWithBorder(updatedStats);
      }
    } catch (error) {
      console.error('Error fetching card stats:', error);
    }
  }

  useEffect(() => {
    fetchCardStats();
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {statsHorizontalWithBorder.map((value,idx) => (
            <Grid item xs={12} sm={6} md={3}>
                <Card color={value.color || 'primary'}>
                <CardContent className='flex flex-col gap-1'>
                  <div className='flex items-center gap-4'>
                    <CustomAvatar color={value.color} skin='light' variant='rounded'>
                      <i className={classNames(value.avatarIcon, 'text-[28px]')} />
                    </CustomAvatar>
                    <Typography variant='h4'>{value.stats}</Typography>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Typography>{value.title}</Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Page
