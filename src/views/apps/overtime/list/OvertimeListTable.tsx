'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
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

// Type Imports
import type { ThemeColor } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { defaultFormValuesOvertime, Overtime } from '@/types/overtimeType'
import { ucfirst } from '@/utils/string'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { Employee } from '@/types/apps/userTypes'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { deleteOvertime, postOvertime, updateOvertime } from '@/services/overtimeService'
import { toast } from 'react-toastify'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import moment from 'moment'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import { getEmployees } from '@/services/employeeService'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import OvertimeDetailsDialog from '../view/detail-overtime/OvertimeDetail'
import OvertimeStatusDialog from '../view/overtime-update-status/OvertimeStatusDialog'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type OvertimeWithAction = Overtime & {
  action?: string
}

type UserRoleType = {
  [key: string]: { icon: string; color: string }
}

type UserStatusType = {
  [key: string]: ThemeColor
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

// Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler-crown', color: 'error' },
  author: { icon: 'tabler-device-desktop', color: 'warning' },
  editor: { icon: 'tabler-edit', color: 'info' },
  maintainer: { icon: 'tabler-chart-pie', color: 'success' },
  subscriber: { icon: 'tabler-user', color: 'primary' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper<OvertimeWithAction>()

const OvertimeListTable = ({ tableData }: { tableData?: Overtime[] }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [dialogFetchLoading, setDialogFetchLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [objectToDelete, setObjectToDelete] = useState<Overtime | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<Overtime | null>(null);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOvertimeForStatus, setSelectedOvertimeForStatus] = useState<Overtime | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [overtimeToEdit, setOvertimeToEdit] = useState<Overtime | null>(null)

  // Hooks
  // const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const methods = useForm<Overtime>({
      defaultValues: defaultFormValuesOvertime
  })
  const { cache, mutate: swrMutate } = useSWRConfig();

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  const columns = useMemo<ColumnDef<OvertimeWithAction, any>[]>(
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
      columnHelper.accessor('overtime_date', {
        header: dictionary['content'].date,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.overtime_date}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('hours', {
        header: dictionary['content'].overtimeHours,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.hours}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('start_time', {
        header: dictionary['content'].clockIn,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.start_time}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('end_time', {
        header: dictionary['content'].clockOut,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.end_time}
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
              <Chip label= {ucfirst(row.original.status)} color={row.original.status == 'approved' ? 'success' : (row.original.status == 'pending' ? 'secondary' : 'error')}/>
            </div>
          </div>
        )
      }),
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
    data: filteredData as Overtime[],
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

  const handleViewDetails = (obj: Overtime) => {
      setSelectedOvertime(obj);
      setDetailsDialogOpen(true);
    };
  
    const handleDialogOpen = async () => {
      setDialogOpen(true)
      setDialogFetchLoading(true)
      
      try {
        // Load both employees and leaves in parallel
        const [employeesResponse] = await Promise.all([
          getEmployees(),
        ])
        
        setEmployees(employeesResponse?.data || [])
      } catch (error) {
        console.error('Error loading dialog data:', error)
      } finally {
        setDialogFetchLoading(false)
      }
    }
  
    // Handle delete dialog
    const handleDeleteClick = (user: Overtime) => {
      setObjectToDelete(user)
      setDeleteDialogOpen(true)
    }
  
    const handleDeleteConfirm = async () => {
          if (!objectToDelete) return
         
          try {
            setIsDeleting(true)
            
            const response = await deleteOvertime(objectToDelete.id)
            
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
    const handleUpdateStatus = (obj: Overtime) => {
      setSelectedOvertimeForStatus(obj)
      setStatusDialogOpen(true)
    }
  
    const handleEditClick = async (obj: Overtime) => {
      setOvertimeToEdit(obj)
      // setDialogFetchLoading(true)
      setEditDialogOpen(true)
      
      try {
        // Load both employees and leaves in parallel
        const [employeesResponse] = await Promise.all([
          getEmployees(),
        ])
        
        setEmployees(employeesResponse?.data || [])
        
        // Reset form with the leave data
        methods.reset({
          ...obj,
          overtime_date: obj.overtime_date ? moment(obj.overtime_date).format('YYYY-MM-DD') : '',
          start_time: moment(`${obj.overtime_date} ${obj.start_time}`).toString(),
          end_time:  moment(`${obj.overtime_date} ${obj.end_time}`).toString(),
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
        <CardHeader title={dictionary['content'].overtimeList} className='pbe-4' />
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
              {dictionary['content'].addNewOvertime}
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
        title={dictionary['content'].addNewOvertime}
        onSubmit={async (data:any) => {
          try {
            const formattedData = {
              ...data,
              overtime_date: data.overtime_date ? moment(data.overtime_date).format('YYYY-MM-DD') : '',
              start_time: data.start_time ? moment(data.start_time).format('HH:mm') : '',
              end_time: data.end_time ? moment(data.end_time).format('HH:mm') : '',
            }

            const res = await postOvertime(formattedData);
            console.log({res})
            if (res.status) {
              swrMutate('/web/overtimes')
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
{/* 
        <QTextField
          name='title'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} title`}
          label={'Title'}
        /> */}

        <QReactDatepicker
          name="overtime_date"
          control={methods.control}
          label={'Overtime Date'}
          required
        />



        <div className="flex space-x-4">
              <div className="flex-1">
                <QReactDatepicker
                  name="start_time"
                  control={methods.control}
                  label={'Start Time'}
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
                  label={ 'End Time'}
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

      <FormDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        title={`Edit Overtime`}
        onSubmit={async (data:any) => {
          try {
            if (!overtimeToEdit) return
            
            const formattedData = {
              ...data,
              start_date: data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : '',
              end_date: data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : '',
            }
            
            const res = await updateOvertime(formattedData, overtimeToEdit.id);
            
            const response = await res.json()
            
            if (response.status) {
              // Update the local data
              const updatedData = data?.map((overtime: Overtime) => 
                overtime.id === overtimeToEdit.id ? { ...overtime, ...formattedData } : overtime
              )
              
              setData(updatedData)
              setFilteredData(updatedData)
              
              // Refresh data with SWR
              swrMutate('/web/leaves')
              toast.success(response.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error) {
            console.log('Error updating overtime', error)
            toast.error(dictionary['content'].errorUpdatingLeave)
          } finally {
            methods.reset()
            setEditDialogOpen(false)
            setOvertimeToEdit(null)
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

        {/* <QTextField
          name='title'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} title`}
          label={'Title'}
        /> */}

        <QReactDatepicker
          name="overtime_date"
          control={methods.control}
          label={'Overtime Date'}
          required
        />



        <div className="flex space-x-4">
              <div className="flex-1">
                <QReactDatepicker
                  name="start_time"
                  control={methods.control}
                  label={'Start Time'}
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
                  label={ 'End Time'}
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

      <OvertimeDetailsDialog
        open={detailsDialogOpen}
        setOpen={setDetailsDialogOpen}
        overtimeData={selectedOvertime}
      />

       {/* Delete Confirmation Dialog */}
       <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-overtime'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <OvertimeStatusDialog
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
        overtimeData={selectedOvertimeForStatus}
        onStatusUpdate={async () => {
          await swrMutate('/web/overtimes')
        }}
      />
    </>
  )
}

export default OvertimeListTable
