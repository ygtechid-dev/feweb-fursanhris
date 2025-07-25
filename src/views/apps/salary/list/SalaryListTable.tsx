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
import AddUserDrawer from './AddUserDrawer'
import ImportSalaryModal from './ImportSalaryModal'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatPrice } from '@/utils/formatPrice'
import { useAuth } from '@/components/AuthProvider'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { postImportSalaryComnponent } from '@/services/employeeService'
import { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type EmployeeWithAction = Employee & {
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
const columnHelper = createColumnHelper<EmployeeWithAction>()

const SalaryListTable = ({ tableData }: { tableData?: Employee[] }) => {
  const { user } = useAuth()

  const { dictionary } = useDictionary()
  const { mutate } = useSWRConfig()

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams()

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  // Handle import salary component
  const handleImportSalary = async (file: File) => {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Make API call to import salary data
      const response = await postImportSalaryComnponent(formData);
      
      if (!response.success) {
        throw new Error('Failed to import salary data')
      }
      
      // const result = await response.json()
      
      // For demo purposes, we'll simulate success
      console.log('Importing file:', file.name)

      toast.success("Data successfully imported");
      mutate('/web/salaries')
      
      // Refresh data after successful import
      // You can call your data fetching function here
      // await refetchData()
      
      // Show success message (you can use your notification system)
      console.log('Import successful!')
      
    } catch (error) {
       toast.error("an error occurred while importing");
      console.error('Import error:', error)
      throw error
    }
  }

  const columns = useMemo<ColumnDef<EmployeeWithAction, any>[]>(
    () => {
      const visibleColumns: ColumnDef<EmployeeWithAction, any>[] = [
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
       columnHelper.accessor('name', {
         header: dictionary['content'].employee,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
               {row.original.name}
               </Typography>
               {/* <Typography variant='body2'>Company ABC</Typography> */}
             </div>
           </div>
         )
       }),
       columnHelper.accessor('salary_type', {
        header: dictionary['content'].payrollType,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
               {row.original.salary_type}
               </Typography>
               {/* <Typography variant='body2'>{row.original.username}</Typography> */}
             </div>
           </div>
         )
       }),
       columnHelper.accessor('salary', {
        header: dictionary['content'].salary,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
               {formatPrice(row.original.salary || '')}
               </Typography>
               {/* <Typography variant='body2'>{row.original.username}</Typography> */}
             </div>
           </div>
         )
       }),
       columnHelper.accessor('net_salary', {
        header: dictionary['content'].netSalary,
         cell: ({ row }) => (
           <div className='flex items-center gap-4'>
             {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
             <div className='flex flex-col'>
               <Typography color='text.primary' className='font-medium'>
               {formatPrice(row.original.net_salary || '')}
               </Typography>
               {/* <Typography variant='body2'>{row.original.username}</Typography> */}
             </div>
           </div>
         )
       }),
      
     
       columnHelper.accessor('action', {
        header: dictionary['content'].action,
         cell: ({ row }) => (
           <div className='flex items-center'>
              {/* <IconButton >
               <i className='tabler-copy-check text-textSecondary' />
             </IconButton> */}
             <IconButton title="View">
             <Link href={`/${locale}/salary/detail/${row.original.id}`} className='flex'>
               <i className='tabler-eye text-textSecondary' />
             </Link>
             </IconButton>
            
           </div>
         ),
         enableSorting: false
       })
     ];
     
           if (user?.type === 'super admin') {
             visibleColumns.splice(1, 0, columnHelper.accessor('created_by', {
              header: dictionary['content'].company,
               cell: ({ row }) => (
                 <div className='flex items-center gap-4'>
                   <div className='flex flex-col'>
                     <Typography color='text.primary' className='font-medium'>
                       {row?.original?.company?.first_name} {row?.original?.company?.last_name}
                     </Typography>
                   </div>
                 </div>
               )
             }) as ColumnDef<EmployeeWithAction, any>)
           }
           
           return visibleColumns
         },
         
         [data, filteredData, user]
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

  return (
    <>
      <Card>
        <CardHeader title={`${dictionary['content'].manage} ${dictionary['content'].employee} ${dictionary['content'].salary}`} className='pbe-4' />
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
              placeholder={`${dictionary['content'].searchData}`}
              className='max-sm:is-full'
            />
            
            <Button
              color='warning'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
              onClick={() => setImportModalOpen(true)}
            >
              Import Salary Component
            </Button>

            {/* <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              // onClick={() => setAddUserOpen(!addUserOpen)}
              className='max-sm:is-full'
            >
              Add Overtime
            </Button> */}
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

      {/* Import Salary Modal */}
      <ImportSalaryModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportSalary}
      />

      {/* <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      /> */}
    </>
  )
}

export default SalaryListTable
