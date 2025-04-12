'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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
import type { Employee, UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Grid } from '@mui/material'
import Allowances from './Allowances'
import Deductions from './Deductions'
import Overtimes from './Overtimes'
import EmployeeSalary from './EmployeeSalary'
import axiosInstance from '@/libs/axios'
import { snakeCaseToTitleCase } from '@/utils/snakeCaseToTitleCase'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
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
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const SalaryDetailTable = ({ tableData }: { tableData?: UsersType[] }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [employee, setEmployee] = useState<Employee | null>(null)
  const params = useParams()

  // Hooks
  const { lang: locale } = useParams()
  const { dictionary } = useDictionary()

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
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
      
      // columnHelper.accessor('fullName', {
      //   header: 'Title',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-4'>
      //       {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
      //       <div className='flex flex-col'>
      //         <Typography color='text.primary' className='font-medium'>
      //         Titlessss
      //         </Typography>
      //         {/* <Typography variant='body2'>Company ABC</Typography> */}
      //       </div>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('fullName', {
        header: 'Component',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              Basic Salary
              </Typography>
              {/* <Typography variant='body2'>Company ABC</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('fullName', {
        header: 'Amount',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              640,000
              </Typography>
              {/* <Typography variant='body2'>Company ABC</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('fullName', {
        header: 'Remark',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              Remarkkksss
              </Typography>
              {/* <Typography variant='body2'>Company ABC</Typography> */}
            </div>
          </div>
        )
      }),
    
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
             {/* <IconButton >
              <i className='tabler-copy-check text-textSecondary' />
            </IconButton> */}
            {/* <IconButton >
            <Link href={'/salary/1'} className='flex'>
              <i className='tabler-eye text-textSecondary' />
            </Link>
            </IconButton> */}
            <IconButton >
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
            <IconButton onClick={() => setData(data?.filter(product => product.id !== row.original.id))}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
           
            {/* <IconButton>
              <Link href={getLocalizedUrl('/apps/user/view', locale as Locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton> */}
            {/* <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                // {
                //   text: 'Download',
                //   icon: 'tabler-download',
                //   menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                // },
                {
                  text: 'Edit',
                  icon: 'tabler-edit',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            /> */}
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as UsersType[],
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

  // Extract employee ID from the URL params
  const employeeId = params.id || params.detail

  const fetchEmployee = async () => {
    if (!employeeId) return
    
    try {
      const response = await axiosInstance.get(`/web/employees/${employeeId}`)
      setEmployee(response.data?.data?.employee)
    } catch (err) {
      console.error('Failed to fetch allowances:', err)
    } 
  }
  
  useEffect(() => {
    fetchEmployee()
  }, [employeeId])
  


  const router = useRouter()
  return (
    <>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title='Galen Slixby Salary Components' className='pbe-4'/> */}
          <div className="flex justify-between px-5 py-4">
          <Typography variant='h4' className='pbe-1 '>
          <b>{snakeCaseToTitleCase(employee?.name || '')}</b> {dictionary['content'].salaryComponents}
          </Typography>
          <Button
                variant='contained'
                // startIcon={<i className='tabler-plus' />}
                onClick={() => router.push(`/${locale}/salary`)}
                className='bg-secondary '
              >
                {dictionary['content'].back}
              </Button>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
       <EmployeeSalary employee={employee || undefined} fetchEmployee={fetchEmployee}/>
      </Grid>
      <Grid item xs={12} sm={6}>
       <Allowances/>
      </Grid>
      <Grid item xs={12} sm={6}>
       <Deductions/>
      </Grid>
      <Grid item xs={12} sm={6}>
       <Overtimes/>
      </Grid>
    </Grid>
    </>
  )
}

export default SalaryDetailTable
