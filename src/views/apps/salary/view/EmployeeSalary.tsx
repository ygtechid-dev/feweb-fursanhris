'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

import { Typography } from '@mui/material'

import { Employee } from '@/types/apps/userTypes'
import { formatPrice } from '@/utils/formatPrice'

const EmployeeSalary = ({employee} : {employee?:Employee}) => {
  const {dictionary} = useDictionary();

   // States
   const [rowSelection, setRowSelection] = useState({})
   const [globalFilter, setGlobalFilter] = useState('')
  
  
return (
  <Card className=''>
    <CardHeader title='Employee Salary' />
    <CardContent>
      <Grid container spacing={6} className=''>
        <Grid item sm={6}>
         <div className="flex flex-col">
            <Typography color='text.primary' className='font-medium'>
                Payslip Type
            </Typography>
            {employee?.salary_type}
          </div> 
        </Grid>
        <Grid item sm={6} className='text-end'>
          <div className="flex flex-col">
            <Typography color='text.primary' className='font-medium'>
              Salary
            </Typography>
            {formatPrice(employee?.salary || '')}
          </div> 
        </Grid>
        <Grid item sm={6} className=''>
          <div className="flex flex-col">
            <Typography color='text.primary' className='font-medium'>
              Account Holder Name
            </Typography>
            {employee?.account_holder_name }
          </div> 
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)
}

export default EmployeeSalary
