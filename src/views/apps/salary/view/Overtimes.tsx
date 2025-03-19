'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { Allowance, Deduction } from '@/types/payslipTypes'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button, Typography } from '@mui/material'
import ReusableTable from '@/components/tables/ReusableTable'
import { Overtime } from '@/types/overtimeType'
import { useParams } from 'next/navigation'
import axiosInstance from '@/libs/axios'
import OptionMenu from '@/@core/components/option-menu'

type TableWithAction = Overtime & {
  action?: string
}

const Overtimes = () => {
  const {dictionary} = useDictionary();
  const params = useParams()

   // States
   const [rowSelection, setRowSelection] = useState({})
   const [globalFilter, setGlobalFilter] = useState('')
   const [overtimes, setOvertimes] = useState<Overtime[]>([])

     // Extract employee ID from the URL params
  const employeeId = params.id || params.detail

  const fetchDeduction = async () => {
    if (!employeeId) return
    
    try {
      const response = await axiosInstance.get(`/web/employees/${employeeId}/overtimes`)
      setOvertimes(response.data?.data)
    } catch (err) {
      console.error('Failed to fetch overtimes:', err)
    } finally {
    }
  }
  
  useEffect(() => {
    fetchDeduction()
  }, [employeeId])
   
   // Column Helper
   const columnHelper = createColumnHelper<TableWithAction>()
   
   // Definisi kolom
   const columns = useMemo<ColumnDef<TableWithAction, any>[]>(
     () => [
       columnHelper.accessor('overtime_date', {
         header: 'Overtime Date',
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.overtime_date}
               </Typography>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('hours', {
         header: 'Overtime Hours',
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.hours}
               </Typography>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('start_time', {
         header: 'Start Time',
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.start_time}
               </Typography>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('end_time', {
         header: 'End Time',
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.end_time}
               </Typography>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Edit',
                  icon: 'tabler-edit',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Delete',
                  icon: 'tabler-trash',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            />
           
          </div>
        ),
        enableSorting: false
      })
      
     ],
     []
   )
  
return (
  <Card>
    <CardHeader 
      title='Overtime' 
      action={
        <Button
          variant='contained'
          className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
        >
          <i className='tabler-plus' />
        </Button>
      }
    />
    {/* <CardContent> */}
      <ReusableTable
        data={overtimes}
        columns={columns}
        showCheckboxes={false}
        pageSize={10}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowSelectionChange={setRowSelection}
      />
    {/* </CardContent> */}
  </Card>
)
}

export default Overtimes
