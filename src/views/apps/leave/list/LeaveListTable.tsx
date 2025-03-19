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
import { KeyedMutator, ScopedMutator, useSWRConfig } from 'swr'
import { Leave, LeaveType } from '@/types/leaveTypes'
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
import LeaveDetailsDialog from '../view/detail-leave/LeaveDetail'
import LeaveStatusDialog from '../view/leave-update-status/LeaveUpdateStatusDialog'


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type LeaveTypeWithAction = Leave & {
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
const columnHelper = createColumnHelper<LeaveTypeWithAction>()

const LeaveListTable = ({ tableData }: { tableData?: Leave[] }) => {
  // States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [dialogFetchLoading, setDialogFetchLoading] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [objectToDelete, setObjectToDelete] = useState<Leave | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedLeaveForStatus, setSelectedLeaveForStatus] = useState<Leave | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [leaveToEdit, setLeaveToEdit] = useState<Leave | null>(null)

  // Hooks
  // const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const methods = useForm<Leave>({
      defaultValues: {
      employee_id: 0,
      leave_type_id: 0,
      start_date: '',
      end_date: '',
      total_leave_days: '',
      leave_reason: '',
      emergency_contact: '',
      remark: '',
      status: 'pending',
      }
  })
  const { cache, mutate: swrMutate } = useSWRConfig();

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  const columns = useMemo<ColumnDef<LeaveTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
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
      columnHelper.accessor('leave_type.title', {
        header: dictionary['content'].leaveType,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.leave_type.title}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('applied_on', {
        header: dictionary['content'].appliedOn,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.applied_on}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('start_date', {
        header: dictionary['content'].startDate,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.start_date}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('end_date', {
        header: dictionary['content'].endDate,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.end_date}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('total_leave_days', {
        header: dictionary['content'].totalDays,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.total_leave_days}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('leave_reason', {
        header: dictionary['content'].leaveReason,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.leave_reason} 
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: dictionary['content'].status,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Chip label= {ucfirst(row.original.status)}  color={row.original.status == 'approved' ? 'success' : (row.original.status == 'pending' ? 'secondary' : 'error')}/>
            </div>
          </div>
        )
      }),
      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       <Chip
      //         variant='tonal'
      //         label={row.original.status}
      //         size='small'
      //         color={userStatusObj[row.original.status]}
      //         className='capitalize'
      //       />
      //     </div>
      //   )
      // }),
      columnHelper.accessor('action', {
        header: dictionary['content'].action,
        cell: ({ row }) => (
          <div className='flex items-center'>
            {
              row.original.status == 'pending' &&  (
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as Leave[],
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

  const handleViewDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setDetailsDialogOpen(true);
  };

  const handleDialogOpen = async () => {
    setDialogOpen(true)
    setDialogFetchLoading(true)
    
    try {
      // Load both employees and leaves in parallel
      const [employeesResponse, leavesResponse] = await Promise.all([
        getEmployees(),
        getLeaveTypes()
      ])
      
      setEmployees(employeesResponse?.data || [])
      setLeaveTypes(leavesResponse?.data || [])
    } catch (error) {
      console.error('Error loading dialog data:', error)
    } finally {
      setDialogFetchLoading(false)
    }
  }

  // Handle delete dialog
  const handleDeleteClick = (user: Leave) => {
    setObjectToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
        if (!objectToDelete) return
       
        try {
          setIsDeleting(true)
          
          const response = await deleteLeave(objectToDelete.id)
          
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
  const handleUpdateStatus = (leave: Leave) => {
    setSelectedLeaveForStatus(leave)
    setStatusDialogOpen(true)
  }

  const handleEditClick = async (leave: Leave) => {
    setLeaveToEdit(leave)
    setDialogFetchLoading(true)
    setEditDialogOpen(true)
    
    try {
      // Load both employees and leaves in parallel
      const [employeesResponse, leavesResponse] = await Promise.all([
        getEmployees(),
        getLeaveTypes()
      ])
      
      setEmployees(employeesResponse?.data || [])
      setLeaveTypes(leavesResponse?.data || [])
      
      // Reset form with the leave data
      methods.reset({
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        start_date: leave.start_date,
        end_date: leave.end_date,
        total_leave_days: leave.total_leave_days,
        leave_reason: leave.leave_reason,
        emergency_contact: leave.emergency_contact,
        remark: leave.remark,
        status: leave.status
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
        <CardHeader title={dictionary['content'].leaveList} className='pbe-4' />
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
              {dictionary['content'].addNewLeave}
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
        setOpen={setDialogOpen}
        title={dictionary['content'].addNewLeave}
        onSubmit={async (data:any) => {
          try {
            const formattedData = {
              ...data,
              start_date: data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : '',
              end_date: data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : '',
            }

            const res = await postLeave(formattedData);
            console.log({res})
            if (res.status) {
              swrMutate('/web/leaves')
              toast.success(res.message)
            }
          } catch (error) {
            console.log('Error post leave', error)
          } finally{
            methods.reset();
            setDialogOpen(false)
          }
         
        }}
        handleSubmit={methods.handleSubmit}
      >
       <>
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
          {employees.map((employee) => (
          <MenuItem key={employee.id} value={employee.id}>
            {employee.name}
          </MenuItem>
        ))}
        </QTextField>

        <QTextField
          name='leave_type_id'
          control={methods.control}
          fullWidth
          required
          select
          label={dictionary['content'].leaveType}
          disabled={dialogFetchLoading}
          rules={{
            validate: (value:any) => value !== 0 && value !== "0" || 'Please select an leave type'
          }}
        >
          <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].leaveType}</MenuItem>
          {leaveTypes.map((leaveType) => (
            <MenuItem key={leaveType.id} value={leaveType.id}>
              {leaveType.title}
            </MenuItem>
          ))}
        </QTextField>
          
        <div className="flex space-x-4">
              <div className="flex-1">
                <QReactDatepicker
                  name="start_date"
                  control={methods.control}
                  label={dictionary['content'].startDate}
                  required
                />
              </div>
              <div className="flex-1">
                <QReactDatepicker
                  name="end_date"
                  control={methods.control}
                  label={dictionary['content'].endDate}
                  required
                />
              </div>
        </div>
         
       <QTextField
          name='leave_reason'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].leaveReason}`}
          label={dictionary['content'].leaveReason}
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

      <FormDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        title={dictionary['content'].editLeave}
        onSubmit={async (data:any) => {
          try {
            if (!leaveToEdit) return
            
            const formattedData = {
              ...data,
              start_date: data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : '',
              end_date: data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : '',
            }
            
            const res = await updateLeave(formattedData, leaveToEdit.id);
            
            const response = await res.json()
            
            if (response.status) {
              // Update the local data
              const updatedData = data?.map((leave: Leave) => 
                leave.id === leaveToEdit.id ? { ...leave, ...formattedData } : leave
              )
              
              setData(updatedData)
              setFilteredData(updatedData)
              
              // Refresh data with SWR
              swrMutate('/web/leaves')
              toast.success(response.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error) {
            console.log('Error updating leave', error)
            toast.error(dictionary['content'].errorUpdatingLeave)
          } finally {
            methods.reset()
            setEditDialogOpen(false)
            setLeaveToEdit(null)
          }
        }}
        handleSubmit={methods.handleSubmit}
      >
        <>
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
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </QTextField>

          <QTextField
            name='leave_type_id'
            control={methods.control}
            fullWidth
            required
            select
            label={dictionary['content'].leaveType}
            disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an leave type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].leaveType}</MenuItem>
            {leaveTypes.map((leaveType) => (
              <MenuItem key={leaveType.id} value={leaveType.id}>
                {leaveType.title}
              </MenuItem>
            ))}
          </QTextField>
            
          <div className="flex space-x-4">
            <div className="flex-1">
              <QReactDatepicker
                name="start_date"
                control={methods.control}
                label={dictionary['content'].startDate}
                required
              />
            </div>
            <div className="flex-1">
              <QReactDatepicker
                name="end_date"
                control={methods.control}
                label={dictionary['content'].endDate}
                required
              />
            </div>
          </div>
          
          <QTextField
            name='leave_reason'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} ${dictionary['content'].leaveReason}`}
            label={dictionary['content'].leaveReason}
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

       {/* Delete Confirmation Dialog */}
       <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-leave'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/** Detail Dialog */}
      <LeaveDetailsDialog
        open={detailsDialogOpen}
        setOpen={setDetailsDialogOpen}
        leaveData={selectedLeave}
      />

      <LeaveStatusDialog
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
        leaveData={selectedLeaveForStatus}
        onStatusUpdate={async () => {
          await swrMutate('/web/leaves')
        }}
      />
    </>
  )
}

export default LeaveListTable
