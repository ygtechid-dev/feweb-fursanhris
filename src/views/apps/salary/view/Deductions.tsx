'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { Allowance, Deduction, defaultFormValuesDeduction } from '@/types/payslipTypes'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button, MenuItem, Typography } from '@mui/material'
import ReusableTable from '@/components/tables/ReusableTable'
import { useParams } from 'next/navigation'
import axiosInstance from '@/libs/axios'
import { formatPrice } from '@/utils/formatPrice'
import OptionMenu from '@/@core/components/option-menu'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { deleteDeduction, postDeduction, updateDeduction } from '@/services/deductionService'
import { toast } from 'react-toastify'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'

type TableWithAction = Deduction & {
  action?: string
}
type DialogMode = 'add' | 'edit' | 'delete' | null

const Deductions = () => {
  const {dictionary} = useDictionary();
  const params = useParams()

   // States
   const [rowSelection, setRowSelection] = useState({})
   const [globalFilter, setGlobalFilter] = useState('')
   const [deduction, setDeduction] = useState<Deduction[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selectedDeduction, setSelectedDeduction] = useState<Deduction | null>(null)
  
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

  const methods = useForm<Deduction>({
    defaultValues: defaultFormValuesDeduction
  })

  const fetchDeduction = async () => {
    if (!employeeId) return
    
    try {
      const response = await axiosInstance.get(`/web/employees/${employeeId}/deductions`)
      setDeduction(response.data?.data)
    } catch (err) {
      console.error('Failed to fetch deductions:', err)
    } finally {
    }
  }
  
  useEffect(() => {
    fetchDeduction()
  }, [employeeId])

  useEffect(() => {
    if(!methods.getValues('month')) methods.setValue('month', defaultFormValuesDeduction.month)
  }, [methods.watch('type')])
   
   // Dialog handlers
    const handleOpenDialog =  (mode: DialogMode, deduction?: Deduction) => {
      setDialogMode(mode)
      if(deduction) setSelectedDeduction(deduction)
    
  
  
      if (mode == 'edit') {
        const formattedData = {
          ...deduction,
          month: moment(`${deduction?.year}-${deduction?.month}-1`).toString()
         }
         // Reset form 
         methods.reset(formattedData)
       
      }else{
        methods.reset(defaultFormValuesDeduction)
      }
  
      setDialogOpen(true)
    }

     const handleCloseDialog = () => {
        setDialogOpen(false)
        setDialogMode(null)
        setSelectedDeduction(null)
      }
      
      const handleDialogSuccess = async () => {
        await fetchDeduction()
        handleCloseDialog()
      }
    
      const handleDeleteCancel = () => {
        setDialogOpen(false)
        setSelectedDeduction(null)
      }
    
      const handleDeleteConfirm = async () => {
          if (!setSelectedDeduction) return
          
          try {
            setIsDeleting(true)
            
            const response = await deleteDeduction(parseInt(employeeId), selectedDeduction!.id)
            
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
       columnHelper.accessor('title', {
         header: 'Title',
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.title}
               </Typography>
               
             </div>
           </div>
         )
       }),
       columnHelper.accessor('type', {
         header: 'Type',
         cell: ({ row }) => (
           <div className='flex items-center'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original.type}
               </Typography>
               {row.original.type === 'monthly' && row.original.month && row.original.year && (
              <Typography color='text.secondary' variant='caption' sx={{ ml: 1 }}>
                ({row.original.month} {row.original.year})
              </Typography>
            )}
           </div>
         )
       }),
       columnHelper.accessor('amount', {
         header: 'Amount',
         cell: ({ row }) => (
           <div className='flex items-center gap-3'>
             <div className='flex flex-col items-start'>
               <Typography color='text.primary' className='font-medium'>
                 {formatPrice(row.original.amount)}
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
                  menuItemProps: { 
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => handleOpenDialog('edit', row.original)
                  }
                },
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
  <>
  <Card>
    <CardHeader 
      title='Deduction' 
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
        data={deduction}
        columns={columns}
        showCheckboxes={false}
        pageSize={10}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowSelectionChange={setRowSelection}
      />
    {/* </CardContent> */}
    

  </Card>

   {/* Deduction Dialog */}
   {dialogOpen && dialogMode == 'add' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        // title={dictionary['content'].addNewBranch}
        title={`Add New Deduction`}
        onSubmit={async (data:any) => {
          try {
            const res = await postDeduction(parseInt(employeeId), {
              ...data,
              month: moment(data.month).format('MM'),
              year: parseInt(moment(data.month).format('Y')),
            });

            if (res.status) {
              handleDialogSuccess();
              toast.success(res.message)
            }
          } catch (error) {
            console.log('Error post deduction', error)
          } finally{
            methods.reset();
            // setDialogOpen(false)
          }
         
        }}
        handleSubmit={methods.handleSubmit}
      >
       <>
       <QTextField
          name='title'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} Title ${dictionary['content'].name}`}
          // label={dictionary['content'].name}
          label={`Title`}
        />
        <QTextField
            name='type'
            control={methods.control}
            fullWidth
            required
            select
            label={`Type`}
            // disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} Type</MenuItem>
            <MenuItem value="permanent">Permanent</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </QTextField>
          {
            methods.watch('type') == 'monthly' &&
            <QReactDatepicker
              name='month'
              control={methods.control}
              // label={dictionary['content'].companyDateofJoining}
              label={`Month / Year`}
              required
              placeholderText="MM/yyyy"
              dateFormat="MM/yyyy"
              showMonthYearPicker={true}
              // onChangeCustom={(date) => {
              //   methods.setValue('month', moment(date).format('MM'))
              //   methods.setValue('year', parseInt(moment(date).format('Y')))
              // }}
            />
          }
          <QTextField
            name='amount'
            control={methods.control}
            fullWidth
            required
            type='number'
            placeholder={`${dictionary['content'].enter} Amount`}
            // label={dictionary['content'].name}
            label={`Amount`}
          />
          
       </>
       
      </FormDialog>
    )}

   {dialogOpen && dialogMode == 'edit' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        // title={dictionary['content'].addNewBranch}
        title={`Edit Deduction`}
        onSubmit={async (data:any) => {
                try {
                  if (!selectedDeduction) return
                  
                  const res = await updateDeduction(parseInt(employeeId), selectedDeduction.id, {
                    ...data,
                    month: moment(data.month).format('MM'),
                    year: parseInt(moment(data.month).format('Y')),
                  });
                  
                  if (res.status) {
                    
                    // Refresh data with SWR
                    handleDialogSuccess()
                    toast.success(res.message || dictionary['content'].leaveUpdatedSuccessfully)
                  }
                } catch (error) {
                  console.log('Error updating deduction', error)
                  toast.error(dictionary['content'].errorUpdatingLeave)
                } finally {
                  methods.reset()
                  // setEditDialogOpen(false)
                  // setObjectToEdit(null)
                }
              }}
        handleSubmit={methods.handleSubmit}
      >
       <>
       <QTextField
          name='title'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} Title ${dictionary['content'].name}`}
          // label={dictionary['content'].name}
          label={`Title`}
        />
        <QTextField
            name='type'
            control={methods.control}
            fullWidth
            required
            select
            label={`Type`}
            // disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} Type</MenuItem>
            <MenuItem value="permanent">Permanent</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </QTextField>
          {
            methods.watch('type') == 'monthly' &&
            <QReactDatepicker
              name='month'
              control={methods.control}
              // label={dictionary['content'].companyDateofJoining}
              label={`Month / Year`}
              required
              placeholderText="MM/yyyy"
              dateFormat="MM/yyyy"
              showMonthYearPicker={true}
              // onChangeCustom={(date) => {
              //   methods.setValue('month', moment(date).format('MM'))
              //   methods.setValue('year', parseInt(moment(date).format('Y')))
              // }}
            />
          }
          <QTextField
            name='amount'
            control={methods.control}
            fullWidth
            required
            type='number'
            placeholder={`${dictionary['content'].enter} Amount`}
            // label={dictionary['content'].name}
            label={`Amount`}
          />
          
       </>
       
      </FormDialog>
    )}

  {dialogOpen && dialogMode == 'delete' && (
       <ConfirmationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        type='delete-deduction'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    )}
  </>
)
}

export default Deductions
