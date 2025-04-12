'use client'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { Allowance, defaultFormValuesAllowance } from '@/types/payslipTypes'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Button, IconButton, Typography, Tooltip, MenuItem } from '@mui/material'
import ReusableTable from '@/components/tables/ReusableTable'
import { useParams } from 'next/navigation'
import axiosInstance from '@/libs/axios'
import { formatPrice } from '@/utils/formatPrice'
import OptionMenu from '@/@core/components/option-menu'
import { PlusIcon } from 'lucide-react'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import { useForm } from 'react-hook-form'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import moment from 'moment'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import { toast } from 'react-toastify'
import { deleteAllowance, postAllowance, updateAllowance } from '@/services/allowanceService'

type TableWithAction = Allowance & {
  action?: string
}

// Dialog modes
type DialogMode = 'add' | 'edit' | 'delete' | null

const Allowances = () => {
  const { dictionary } = useDictionary()
  const params = useParams()
  
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selectedAllowance, setSelectedAllowance] = useState<Allowance | null>(null)

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

  const methods = useForm<Allowance>({
    defaultValues: defaultFormValuesAllowance
  })


  const fetchAllowances = async () => {
    if (!employeeId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axiosInstance.get(`/web/employees/${employeeId}/allowances`)
      setAllowances(response.data?.data)
    } catch (err) {
      console.error('Failed to fetch allowances:', err)
      setError('Failed to load allowances data')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchAllowances()
  }, [employeeId])

  useEffect(() => {
    if(!methods.getValues('month')) methods.setValue('month', defaultFormValuesAllowance.month)
  }, [methods.watch('type')])

  // Dialog handlers
  const handleOpenDialog =  (mode: DialogMode, allowance?: Allowance) => {
    setDialogMode(mode)
    if(allowance) setSelectedAllowance(allowance)
  
    if (mode == 'edit') {
      const formattedData = {
        ...allowance,
        month: moment(`${allowance?.year}-${allowance?.month}-1`).toString()
       }
       // Reset form 
       methods.reset(formattedData)
     
    }else{
      methods.reset(defaultFormValuesAllowance)
    }

    setDialogOpen(true)
  }
  
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogMode(null)
    setSelectedAllowance(null)
  }
  
  const handleDialogSuccess = async () => {
    await fetchAllowances()
    handleCloseDialog()
  }

  const handleDeleteCancel = () => {
    setDialogOpen(false)
    setSelectedAllowance(null)
  }

  const handleDeleteConfirm = async () => {
      if (!setSelectedAllowance) return
      
      try {
        setIsDeleting(true)
        
        const response = await deleteAllowance(parseInt(employeeId), selectedAllowance!.id)
        
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
          <Typography color='text.primary' className='font-medium'>
            {formatPrice(row.original.amount)}
          </Typography>
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
      <Card>
        <CardHeader 
          title='Allowance' 
          // subheader={isLoading ? 'Loading...' : error ? error : `${allowances.length} allowances found`}
          action={
            <Tooltip title="Add Allowance">
              <Button
                variant='contained'
                color='primary'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
                onClick={() => handleOpenDialog('add' )}
              >
                <PlusIcon fontSize="small" />
              </Button>
            </Tooltip>
          }
        />
        <ReusableTable
          data={allowances}
          columns={columns}
          showCheckboxes={false}
          pageSize={10}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onRowSelectionChange={setRowSelection}
          // loading={isLoading}
          // emptyMessage={error || "No allowances found"}
        />
          {/* Allowance Dialog */}
      {dialogOpen && dialogMode == 'add' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        // title={dictionary['content'].addNewBranch}
        title={`${dictionary['content'].add} ${dictionary['content'].new} ${dictionary['content'].allowance}`}
        onSubmit={async (data:any) => {
          try {
            const res = await postAllowance(parseInt(employeeId), {
              ...data,
              month: moment(data.month).format('MM'),
              year: parseInt(moment(data.month).format('Y')),
            });
            console.log({res})
            if (res.status) {
              handleDialogSuccess();
              toast.success(res.message)
            }
          } catch (error) {
            console.log('Error post allowance', error)
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
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].title} ${dictionary['content'].name}`}
          // label={dictionary['content'].name}
          label={`Title`}
        />
        <QTextField
            name='type'
            control={methods.control}
            fullWidth
            required
            select
            label={`${dictionary['content'].type}`}
            // disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].type}</MenuItem>
            <MenuItem value="permanent">Permanent</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </QTextField>
          {
            methods.watch('type') == 'monthly' &&
            <QReactDatepicker
              name='month'
              control={methods.control}
              // label={dictionary['content'].companyDateofJoining}
              label={`${dictionary['content'].month} / ${dictionary['content'].year} `}
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
            label={`${dictionary['content'].amount} `}
          />
          
       </>
       
      </FormDialog>
      )}

      {dialogOpen && dialogMode == 'edit' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        // title={dictionary['content'].addNewBranch}
        title={`${dictionary['content'].edit} ${dictionary['content'].allowance} `}
        onSubmit={async (data:any) => {
          try {
            if (!selectedAllowance) return
            
            const res = await updateAllowance(parseInt(employeeId), selectedAllowance.id, {
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
            console.log('Error updating allowance', error)
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
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].title}  ${dictionary['content'].name}`}
          // label={dictionary['content'].name}
          label={`${dictionary['content'].title}`}
        />
        <QTextField
            name='type'
            control={methods.control}
            fullWidth
            required
            select
            label={`${dictionary['content'].type} `}
            // disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].type}</MenuItem>
            <MenuItem value="permanent">Permanent</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </QTextField>
            {methods.watch('type') == 'monthly' && (
              <QReactDatepicker
              name='month'
              control={methods.control}
              // label={dictionary['content'].companyDateofJoining}
              label={`${dictionary['content'].month} / ${dictionary['content'].year} `}
              required
              placeholderText="MM/yyyy"
              dateFormat="MM/yyyy"
              showMonthYearPicker={true}
              // onChangeCustom={(date) => {
              //   methods.setValue('month', moment(date).format('MM'))
              //   methods.setValue('year', parseInt(moment(date).format('Y')))
              // }}
              />
            )}
           
       
          <QTextField
            name='amount'
            control={methods.control}
            fullWidth
            required
            type='number'
            placeholder={`${dictionary['content'].enter} Amount`}
            // label={dictionary['content'].name}
            label={`${dictionary['content'].amount}`}
          />
         
       </>
       
      </FormDialog>
      )} 

      {dialogOpen && dialogMode == 'delete' && (
       <ConfirmationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        type='delete-allowance'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
      )}
      </Card>
  )
}

export default Allowances
