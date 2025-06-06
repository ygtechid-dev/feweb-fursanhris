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
import type { Employee } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
import TableFilters from './TableFilters'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { deleteEmployee } from '@/services/employeeService'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import { useAuth } from '@/components/AuthProvider'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = Employee & {
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
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const EmployeeListTable = ({ tableData }: { tableData?: Employee[] }) => {
  const { user } = useAuth()

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

   // Add states for delete dialog
   const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
   const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
   const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Hooks
  const { lang: locale } = useParams()
  const router = useRouter()
  const {dictionary} = useDictionary();
 
   // Handle dialog open
   const handleDeleteDialogOpen = (employee: Employee) => {
     setEmployeeToDelete(employee)
     setDeleteDialogOpen(true)
   }
 
   // Handle dialog close
   const handleDeleteDialogClose = () => {
     setDeleteDialogOpen(false)
     setEmployeeToDelete(null)
   }
 
   // Handle delete confirmation
   const handleDeleteConfirm = async () => {
     if (!employeeToDelete) return
 
     try {
       setIsDeleting(true)
       
       const response = await deleteEmployee(employeeToDelete.id)
       
       if (response.status) {
         // Remove the deleted employee from the table data
         setData(prevData => prevData?.filter(employee => employee.id !== employeeToDelete.id))
         setFilteredData(prevData => prevData?.filter(employee => employee.id !== employeeToDelete.id))
         
         // Show success message
         toast.success(response.message || 'Employee deleted successfully')
       }
     } catch (error: any) {
       // Handle error
       toast.error(error?.response?.data?.message || 'Error deleting employee')
     } finally {
       setIsDeleting(false)
       handleDeleteDialogClose()
     }
   }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => {
      const visibleColumns:ColumnDef<UsersTypeWithAction, any>[] = [
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
        columnHelper.accessor('employee_id', {
          header: dictionary['content'].employeeId,
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                 {row.original?.employee_id}
                </Typography>
                {/* <Typography variant='body2'>{row.original.username}</Typography> */}
              </div>
            </div>
          )
        }),
        columnHelper.accessor('name', {
          header: dictionary['content'].name,
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.name}
                </Typography>
              </div>
            </div>
          )
        }),
         columnHelper.accessor('email', {
          header: dictionary['content'].email,
          cell: ({ row }) => (
            <Typography className='' color='text.primary'>
              {row.original.email}
            </Typography>
          )
        }),
         columnHelper.accessor('branch', {
          header: dictionary['content'].branch,
          cell: ({ row }) => (
            <Typography className='capitalize' color='text.primary'>
              {row.original?.branch?.name}
            </Typography>
          )
        }),
         columnHelper.accessor('department', {
          header: dictionary['content'].department,
          cell: ({ row }) => (
            <Typography className='capitalize' color='text.primary'>
              {row.original?.department?.name}
            </Typography>
          )
        }),
         columnHelper.accessor('designation', {
          header: dictionary['content'].designation,
          cell: ({ row }) => (
            <Typography className='capitalize' color='text.primary'>
             {row.original?.designation?.name}
            </Typography>
          )
        }),
         columnHelper.accessor('company_doj', {
          header: dictionary['content'].joiningDate,
          cell: ({ row }) => (
            <Typography className='capitalize' color='text.primary'>
              {row.original?.company_doj}
            </Typography>
          )
        }),
        
        columnHelper.accessor('action', {
          header: dictionary['content'].action,
          cell: ({ row }) => (
            <div className='flex items-center'>
              <IconButton onClick={() => router.push(`/${locale}/employees/${row.original?.id}/edit`)}>
                <i className='tabler-edit text-textSecondary' />
              </IconButton>
              <IconButton 
                onClick={() => handleDeleteDialogOpen(row.original)}
                disabled={isDeleting}
              >
                <i className='tabler-trash text-textSecondary' />
              </IconButton>
             
            </div>
          ),
          enableSorting: false
        })
      ]; if (user?.type === 'super admin') {
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
        }) as ColumnDef<UsersTypeWithAction, any>)
      }
      
      return visibleColumns
    },
    
    [data, filteredData, user, dictionary]
  )

  const table = useReactTable({
    data: filteredData as Employee[],
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


  useEffect(() => {
    setData(...[tableData])
     setFilteredData(tableData)
  }, [tableData])

  return (
    <>
      <Card>
        <CardHeader title={dictionary['content'].employeeList} className='pbe-4' />
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
              component={Link}
              startIcon={<i className='tabler-plus' />}
              // onClick={() => setAddUserOpen(!addUserOpen)}
              // onClick={() => router.push('/employees/create')}
              href={`/${locale}/employees/create`}
              className='max-sm:is-full'
            >
              {dictionary['content'].addEmployee}
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
                    No data available
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
      {/* <AddDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      /> */}

      <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-employee'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  )
}

export default EmployeeListTable
