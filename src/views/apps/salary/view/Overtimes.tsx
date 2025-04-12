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
import { defaultFormValuesOvertime, Overtime } from '@/types/overtimeType'
import { useParams } from 'next/navigation'
import axiosInstance from '@/libs/axios'
import OptionMenu from '@/@core/components/option-menu'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { deleteOvertime, postOvertime, updateOvertime } from '@/services/employeeOvertimeService'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import { formatPrice } from '@/utils/formatPrice'

type TableWithAction = Overtime & {
  action?: string
}
type DialogMode = 'add' | 'edit' | 'delete' | null

const Overtimes = () => {
  const {dictionary} = useDictionary();
  const params = useParams()

   // States
   const [rowSelection, setRowSelection] = useState({})
   const [globalFilter, setGlobalFilter] = useState('')
   const [overtimes, setOvertimes] = useState<Overtime[]>([])

   const [dialogOpen, setDialogOpen] = useState(false)
     const [dialogMode, setDialogMode] = useState<DialogMode>(null)
     const [selectedOvertime, setSelectedOvertime] = useState<Overtime | null>(null)
     
     const [isDeleting, setIsDeleting] = useState<boolean>(false)

   // Extract employee ID from the URL params
   const employeeId = typeof params.id === 'string' 
   ? params.id 
   : typeof params.detail === 'string' 
     ? params.detail 
     : Array.isArray(params.id) 
       ? params.id[0] 
       : Array.isArray(params.detail) 
         ? params.detail[0] 
         : '';

   const methods = useForm<Overtime>({
      defaultValues: defaultFormValuesOvertime
    })

  const fetchOvertime = async () => {
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
    fetchOvertime()
  }, [employeeId])

  // Dialog handlers
      const handleOpenDialog =  (mode: DialogMode, overtime?: Overtime) => {
        setDialogMode(mode)
        if(overtime) setSelectedOvertime(overtime)
    
        if (mode == 'edit') {
          const formattedData = {
            ...overtime,
            overtime_date: overtime!.overtime_date ? moment(overtime!.overtime_date).format('YYYY-MM-DD') : '',
            start_time: moment(`${overtime!.overtime_date} ${overtime!.start_time}`).toString(),
            end_time:  moment(`${overtime!.overtime_date} ${overtime!.end_time}`).toString(),
           }
           // Reset form 
           methods.reset(formattedData)
         
        }else{
          methods.reset(defaultFormValuesOvertime)
        }
    
        setDialogOpen(true)
      }
  
      const handleCloseDialog = () => {
        setDialogOpen(false)
        setDialogMode(null)
        setSelectedOvertime(null)
      }
      
      const handleDialogSuccess = async () => {
        await fetchOvertime()
        handleCloseDialog()
      }
    
      const handleDeleteCancel = () => {
        setDialogOpen(false)
        setSelectedOvertime(null)
      }
    
      const handleDeleteConfirm = async () => {
          if (!setSelectedOvertime) return
          
          try {
            setIsDeleting(true)
            
            const response = await deleteOvertime(parseInt(employeeId), selectedOvertime!.id)
            
            if (response.status) {
              // Show success message
              toast.success(response.message || dictionary['content'].leaveDeletedSuccessfully)
              handleDialogSuccess()
            }
          } catch (error: any) {
            // Handle error
            toast.error(error?.response?.data?.message || dictionary['content'].errorDeletingLeave)
          } finally {
            setIsDeleting(false)
            handleDeleteCancel()
          }
      }
   
   // Column Helper
   const columnHelper = createColumnHelper<TableWithAction>()
   
   // Definisi kolom
   const columns = useMemo<ColumnDef<TableWithAction, any>[]>(
     () => [
       columnHelper.accessor('overtime_date', {
         header: dictionary['content'].overtimeDate,
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
         header: dictionary['content'].overtimeHours,
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
       columnHelper.accessor('rate', {
         header: dictionary['content'].rate,
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.rate ? formatPrice(row.original.rate.toString()) : '-'}
               </Typography>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('start_time', {
         header: dictionary['content'].clockIn,
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
         header: dictionary['content'].clockOut,
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
        header: dictionary['content'].action,
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                // {
                //   text: 'Edit',
                //   icon: 'tabler-edit',
                //   menuItemProps: { 
                //     className: 'flex items-center gap-2 text-textSecondary',
                //     onClick: () => handleOpenDialog('edit', row.original)
                //   }
                // },
                {
                  text: 'Delete',
                  icon: 'tabler-trash',
                  menuItemProps: { 
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => handleOpenDialog('delete', row.original)
                  }
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
      title={dictionary['content'].overtime}
      action={
        <Button
          variant='contained'
          className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          onClick={() => handleOpenDialog('add' )}
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

     {/* Deduction Dialog */}
    {dialogOpen && dialogMode == 'add' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={dictionary['content'].addNewOvertime}
        onSubmit={async (data:any) => {
          try {
            const formattedData = {
              ...data,
              overtime_date: data.overtime_date ? moment(data.overtime_date).format('YYYY-MM-DD') : '',
              start_time: data.start_time ? moment(data.start_time).format('HH:mm') : '',
              end_time: data.end_time ? moment(data.end_time).format('HH:mm') : '',
            }

            const res = await postOvertime(parseInt(employeeId), formattedData);
            console.log({res})
            if (res.status) {
              handleDialogSuccess();
              toast.success(res.message)
            }
          } catch (error) {
            console.log('Error post ovetime', error)
          } finally{
            methods.reset();
            // setDialogOpen(false)
          }
         
        }}
        handleSubmit={methods.handleSubmit}
      >
       <>
        <QReactDatepicker
          name="overtime_date"
          control={methods.control}
          label={dictionary['content'].overtimeDate}
          required
        />
        <div className="flex space-x-4">
              <div className="flex-1">
                <QReactDatepicker
                  name="start_time"
                  control={methods.control}
                  label={dictionary['content'].clockIn}
                  required
                  showTimeSelectOnly={true}
                  showTimeSelect={true}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  timeIntervals={30}
                  placeholderText="HH:MM"
                />
              </div>
              <div className="flex-1">
                <QReactDatepicker
                  name="end_time"
                  control={methods.control}
                  label={dictionary['content'].clockOut}
                  required
                  showTimeSelectOnly={true}
                  showTimeSelect={true}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  timeIntervals={30}
                  placeholderText="HH:MM"
                />
              </div>
        </div>
       <QTextField
          name='rate'
          control={methods.control}
          fullWidth
          type='number'
          required
          placeholder={`${dictionary['content'].enter} Rate`}
          label={dictionary['content'].rate}
        />
       <QTextField
          name='remark'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].remark}`}
          label={dictionary['content'].remark}
        />
       </>
      </FormDialog>
    )}

    {dialogOpen && dialogMode == 'edit' && (
       <FormDialog
       open={dialogOpen}
       setOpen={setDialogOpen}
        title={`Edit Overtime`}
        onSubmit={async (data:any) => {
          try {
            if (!selectedOvertime) return
            
            const formattedData = {
              ...data,
              overtime_date: data.overtime_date ? moment(data.overtime_date).format('YYYY-MM-DD') : '',
              start_time: data.start_time ? moment(data.start_time).format('HH:mm') : '',
              end_time: data.end_time ? moment(data.end_time).format('HH:mm') : '',
            }
            
            const response = await updateOvertime(parseInt(employeeId), selectedOvertime.id, formattedData);
            
            if (response.status) {
              handleDialogSuccess()
              toast.success(response.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error) {
            console.log('Error updating overtime', error)
            toast.error(dictionary['content'].errorUpdatingLeave)
          } finally {
            methods.reset()
            // setEditDialogOpen(false)
            // setOvertimeToEdit(null)
          }
        }}
        handleSubmit={methods.handleSubmit}
      >
          <>
        <QReactDatepicker
          name="overtime_date"
          control={methods.control}
          label={dictionary['content'].overtimeDate}
          required
        />

        <div className="flex space-x-4">
              <div className="flex-1">
                <QReactDatepicker
                  name="start_time"
                  control={methods.control}
                  label={dictionary['content'].clockIn}
                  required
                  showTimeSelectOnly={true}
                  showTimeSelect={true}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  timeIntervals={30}
                  placeholderText="HH:MM"
                />
              </div>
              <div className="flex-1">
                <QReactDatepicker
                  name="end_time"
                  control={methods.control}
                  label={dictionary['content'].clockOut}
                  required
                  showTimeSelectOnly={true}
                  showTimeSelect={true}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  timeIntervals={30}
                  placeholderText="HH:MM"
                />
              </div>
        </div>
        <QTextField
          name='remark'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].remark}`}
          label={dictionary['content'].remark}
        />
        </>
      </FormDialog>
    )}

    {dialogOpen && dialogMode == 'delete' && (
      <ConfirmationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        type='delete-overtime'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    )}
  </Card>
)
}

export default Overtimes
