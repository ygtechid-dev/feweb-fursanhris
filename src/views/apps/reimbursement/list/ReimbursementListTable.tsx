'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import TableFilters from './TableFilters'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import {  useSWRConfig } from 'swr'
import { ucfirst } from '@/utils/string'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import { useForm } from 'react-hook-form'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import { getEmployees } from '@/services/employeeService'
import { Employee } from '@/types/apps/userTypes'
import { deleteLeave, getLeaves, getLeaveTypes, postLeave, updateLeave } from '@/services/leaveService'
import { toast } from 'react-toastify'
import moment from 'moment'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import LeaveDetailsDialog from '../view/detail-leave/ReimburseDetail'
import LeaveStatusDialog from '../view/reimburse-update-status/ReimburseUpdateStatusDialog'
import { useAuth } from '@/components/AuthProvider'
import useCompanies from '@/hooks/useCompanies'
import { defaultReimbursementValues, Reimbursement } from '@/types/reimburseTypes'
import { deleteReimbursement, postReimbursement, updateReimbursement } from '@/services/reimbursementService'
import useReimbursementCategory from '@/hooks/useReimbursementCategory'
import { toFormData } from '@/utils/toFormData'
import ReimburseDetail from '../view/detail-leave/ReimburseDetail'
import ReimburseUpdateStatusDialog from '../view/reimburse-update-status/ReimburseUpdateStatusDialog'
import { formatCurrency } from '@/utils/formatCurrency'


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ReimbursementTypeWithAction = Reimbursement & {
  action?: string
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper<ReimbursementTypeWithAction>()

const ReimbursementListTable = ({ tableData }: { tableData?: Reimbursement[] }) => {
  const { user } = useAuth()
  const { companies } = useCompanies()
  const { data: reimburseDatas, isLoading: isLoadingReimburse, refetch:refetchReimburse } = useReimbursementCategory()

  // States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [ReimbursementTypes, setReimbursementTypes] = useState<Reimbursement[]>([])
  const [dialogFetchLoading, setDialogFetchLoading] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [objectToDelete, setObjectToDelete] = useState<Reimbursement | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedReimbursementForStatus, setSelectedReimbursementForStatus] = useState<Reimbursement | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [ReimbursementToEdit, setReimbursementToEdit] = useState<Reimbursement | null>(null)

  // Hooks
  // const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const methods = useForm<Reimbursement>({
      defaultValues: defaultReimbursementValues
  })
  const { cache, mutate: swrMutate } = useSWRConfig();

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  const columns = useMemo<ColumnDef<ReimbursementTypeWithAction, any>[]>(
    () => {
      const visibleColumns:ColumnDef<ReimbursementTypeWithAction, any>[] = [
        {
           id: 'select',
           header: ({ table }: { table: any }) => (
             <Checkbox
               {...{
                 checked: table.getIsAllRowsSelected(),
                 indeterminate: table.getIsSomeRowsSelected(),
                 onChange: table.getToggleAllRowsSelectedHandler()
               }}
             />
           ),
           cell: ({ row }: { row: any }) => (
             <Checkbox
               {...{
                 checked: row.getIsSelected(),
                 disabled: !row.getCanSelect(),
                 indeterminate: row.getIsSomeSelected(),
                 onChange: row.getToggleSelectedHandler()
               }}
             />
           )
         },
       columnHelper.accessor('employee.name', {
         header: dictionary['content'].employee,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
               {row.original.employee.name}
               </Typography>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('category.name', {
         header: dictionary['content'].reimburseCategory,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
                 {row.original?.category?.name}
               </Typography>
               {/* <Typography variant='body2'>{row.original.username}</Typography> */}
             </div>
           </div>
         )
       }),
       columnHelper.accessor('amount', {
         header: dictionary['content'].amount,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
               {row.original.amount ? formatCurrency(row.original.amount) : ''}
               </Typography>
               {/* <Typography variant='body2'>{row.original.username}</Typography> */}
             </div>
           </div>
         )
       }),
       columnHelper.accessor('description', {
        header: dictionary['content'].description,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.description.length > 25 
                  ? row.original.description.substring(0, 25) + '...' 
                  : row.original.description}
              </Typography>
            </div>
          </div>
        )
      }),
       columnHelper.accessor('status', {
         header: dictionary['content'].status,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             <div className='flex flex-col'>
               <Chip label= {ucfirst(row.original.status)}  color={row.original.status == 'approved' ? 'success' : (row.original.status == 'pending' ? 'secondary' : (row.original.status == 'paid' ? 'success' : 'error'))}/>
             </div>
           </div>
         )
       }),
       columnHelper.accessor('action', {
         header: dictionary['content'].action,
         cell: ({ row }) => (
           <div className='flex items-center'>
             {
                (row.original.status == 'pending' || row.original.status == 'approved') &&  (
                  <IconButton onClick={() => handleUpdateStatus(row.original)}>
                    <i className='tabler-copy-check text-textSecondary' />
                  </IconButton>
                )
              }
              <IconButton onClick={() => handleViewDetails(row.original)}>
                <i className='tabler-eye text-textSecondary' />
              </IconButton>
              {
                row.original.status == 'pending' &&  (
                  <IconButton onClick={() => handleEditClick(row.original)}>
                    <i className='tabler-edit text-textSecondary' />
                  </IconButton>
                )
              }
             <IconButton onClick={() => handleDeleteClick(row.original)}>
               <i className='tabler-trash text-textSecondary' />
             </IconButton>
           </div>
         ),
         enableSorting: false
       })
     ];
      
     if (user?.type === 'super admin') {
      visibleColumns.splice(1, 0, columnHelper.accessor('created_by', {
        header: 'Company',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.company?.first_name} {row?.original?.company?.last_name}
              </Typography>
            </div>
          </div>
        )
      }) as ColumnDef<ReimbursementTypeWithAction, any>)
    }
    
    return visibleColumns
  },
  
  [data, filteredData, user, dictionary]
  )

  const table = useReactTable({
    data: filteredData as Reimbursement[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const handleViewDetails = (leave: Reimbursement) => {
    console.log({leave})
    setSelectedReimbursement(leave);
    setDetailsDialogOpen(true);
  };

  const handleDialogOpen = async () => {
    setDialogOpen(true)
    setDialogFetchLoading(true)
    
    try {
      // Load both employees and leaves in parallel
      const [employeesResponse] = await Promise.all([
        getEmployees(),
        // getLeaveTypes()
      ])

      refetchReimburse()
      
      setEmployees(employeesResponse?.data || [])
      // setLeaveTypes(leavesResponse?.data || [])
    } catch (error) {
      console.error('Error loading dialog data:', error)
    } finally {
      setDialogFetchLoading(false)
    }
  }

  // Handle delete dialog
  const handleDeleteClick = (user: Reimbursement) => {
    setObjectToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
        if (!objectToDelete) return
       
        try {
          setIsDeleting(true)
          
          const response = await deleteReimbursement(objectToDelete.id)
          
          if (response.status) {
            // Remove the deleted leave from the table data
            setData(prevData => prevData?.filter(leave => leave.id !== objectToDelete.id))
            setFilteredData(prevData => prevData?.filter(leave => leave.id !== objectToDelete.id))
            
            // Show success message
            toast.success(response.message || dictionary['content'].leaveDeletedSuccessfully)
          }
        } catch (error: any) {
          // Handle error
          toast.error(error?.response?.data?.message || dictionary['content'].errorDeletingLeave)
        } finally {
          setIsDeleting(false)
          handleDeleteCancel()
        }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setObjectToDelete(null)
  }

  // Add this function
  const handleUpdateStatus = (leave: Reimbursement) => {
    console.log({leave})
    setSelectedReimbursementForStatus(leave)
    setStatusDialogOpen(true)
  }

  const handleEditClick = async (leave: Reimbursement) => {
  
    setReimbursementToEdit(leave)
    setDialogFetchLoading(true)
    setEditDialogOpen(true)
    
    try {
      // Load both employees and leaves in parallel
      const [employeesResponse] = await Promise.all([
        getEmployees(),
      ])
      
      setEmployees(employeesResponse?.data || [])
      refetchReimburse();
      
      // Reset form with the leave data
      methods.reset({
        ...leave
      })
    } catch (error) {
      console.error('Error loading dialog data:', error)
    } finally {
      setDialogFetchLoading(false)
    }
  }
  
  return (
    <>
      <Card>
        <CardHeader title={dictionary['content'].reimburseList} className='pbe-4' />
        <TableFilters setData={setFilteredData} tableData={data} />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder={dictionary['content'].searchData}
              className='max-sm:is-full'
            />
            {/* <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
            >
              Export
            </Button> */}
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={handleDialogOpen}
              className='max-sm:is-full'
            >
              {dictionary['content'].addNewReimburse}
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  {dictionary['content'].noDataAvailable}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      <FormDialog
        open={dialogOpen}
        setOpen={(open) => {
          setDialogOpen(open)
          methods.reset(defaultReimbursementValues)
        }}
        title={dictionary['content'].addNewReimburse}
        onSubmit={async (data:any) => {
          try {
            const formattedData = {
              ...data,
              transaction_date: data.transaction_date ? moment(data.transaction_date).format('YYYY-MM-DD') : '',
            }

            const res = await postReimbursement(toFormData(formattedData));
           
            if (res.status) {
              swrMutate('/web/reimbursements')
              toast.success(res.message)
            }
          } catch (error: any) {
            console.log('Error post', error)
            // Tampilkan pesan error dengan toast
            if (error.response && error.response.data) {
              toast.error(error.response.data.message)
            } else {
              toast.error('Terjadi kesalahan pada sistem')
            }
          } finally{
            methods.reset();
            setDialogOpen(false)
          }
         
        }}
        handleSubmit={methods.handleSubmit}
      >
       <>
       {
          user && user?.type == 'super admin' && 
          <QTextField
          name='created_by'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].company}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an company'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].company}</MenuItem>
          {companies.map(company => (
              <MenuItem key={company.id} value={company.id}>
                {company.first_name} {company.last_name}
              </MenuItem>
            ))}
        </QTextField>
        }
        <QTextField
          name='employee_id'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].employee}
          disabled={dialogFetchLoading}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an employee'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].employee}</MenuItem>
          { user && user?.type != 'super admin' && employees.map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}

          { methods.watch('created_by') && employees.filter((emp) => emp.created_by == methods.getValues('created_by')).map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}
        </QTextField>

        <QTextField
          name='category_id'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].reimburseCategory}
          disabled={isLoadingReimburse}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an reimbursement category'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].reimburseCategory}</MenuItem>
          {reimburseDatas?.map((reimburse) => (
            <MenuItem key={reimburse.id} value={reimburse.id}>
              {reimburse.name}
            </MenuItem>
          ))}
        </QTextField>

        <QReactDatepicker
          name="transaction_date"
          control={methods.control}
          label={dictionary['content'].transactionDate}
          required
        />
      
        <QTextField
          name='amount'
          control={methods.control}
          fullWidth
          required
          type='number'
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].amount}`}
          label={dictionary['content'].amount}
        />

        <QTextField
          name='description'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].description}`}
          label={dictionary['content'].description}
        />

        <QTextField
          name='receipt_path'
          control={methods.control}
          fullWidth
          type='file'
          accept="image/*, application/pdf"
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].receipt}`}
          label={dictionary['content'].receipt}
        />
       </>
      </FormDialog>

      <FormDialog
        open={editDialogOpen}
        setOpen={(open) => {
          setEditDialogOpen(open)
          methods.reset(defaultReimbursementValues)
        }}
        title={dictionary['content'].editReimburse}
        onSubmit={async (data:any) => {
          try {
            if (!ReimbursementToEdit) return
            
            const formattedData = {
              ...data,
              transaction_date: data.transaction_date ? moment(data.transaction_date).format('YYYY-MM-DD') : '',
            }
            
            const res = await updateReimbursement(toFormData(formattedData), ReimbursementToEdit.id);
            
            if (res.status) {
              // Refresh data with SWR
              swrMutate('/web/reimbursements')
              toast.success(res.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error: any) {
            console.log('Error updating', error)
            if (error.response && error.response.data) {
              toast.error(error.response.data.message)
            } else {
              toast.error('Terjadi kesalahan pada sistem')
            }
          } finally {
            methods.reset()
            setEditDialogOpen(false)
            setReimbursementToEdit(null)
          }
        }}
        handleSubmit={methods.handleSubmit}
      >
        <>
       {
          user && user?.type == 'super admin' && 
          <QTextField
          name='created_by'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].company}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an company'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].company}</MenuItem>
          {companies.map(company => (
              <MenuItem key={company.id} value={company.id}>
                {company.first_name} {company.last_name}
              </MenuItem>
            ))}
        </QTextField>
        }
        <QTextField
          name='employee_id'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].employee}
          disabled={dialogFetchLoading}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an employee'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].employee}</MenuItem>
          { user && user?.type != 'super admin' && employees.map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}

          { methods.watch('created_by') && employees.filter((emp) => emp.created_by == methods.getValues('created_by')).map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}
        </QTextField>

        <QTextField
          name='category_id'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].reimburseCategory}
          disabled={isLoadingReimburse}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an reimbursement category'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].reimburseCategory}</MenuItem>
          {reimburseDatas?.map((reimburse) => (
            <MenuItem key={reimburse.id} value={reimburse.id}>
              {reimburse.name}
            </MenuItem>
          ))}
        </QTextField>

        <QReactDatepicker
          name="transaction_date"
          control={methods.control}
          label={dictionary['content'].transactionDate}
          required
        />
      
        <QTextField
          name='amount'
          control={methods.control}
          fullWidth
          required
          type='number'
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].amount}`}
          label={dictionary['content'].amount}
        />

        <QTextField
          name='description'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].description}`}
          label={dictionary['content'].description}
        />

        <QTextField
          name='receipt_path'
          control={methods.control}
          fullWidth
          type='file'
          accept="image/*, application/pdf"
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].receipt}`}
          label={dictionary['content'].receipt}
        />
       </>
      </FormDialog>

       {/* Delete Confirmation Dialog */}
       <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-reimbursement'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/** Detail Dialog */}
      <ReimburseDetail
        open={detailsDialogOpen}
        setOpen={setDetailsDialogOpen}
        data={selectedReimbursement}
      />

      <ReimburseUpdateStatusDialog
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
        data={selectedReimbursementForStatus}
        onStatusUpdate={async () => {
          await swrMutate('/web/reimbursements')
        }}
      />
    </>
  )
}

export default ReimbursementListTable
