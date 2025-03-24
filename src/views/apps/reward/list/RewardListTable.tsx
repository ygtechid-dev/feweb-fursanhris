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
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import AddDrawer from './AddDrawer'
import { defaultFormValuesReward, Reward, RewardType } from '@/types/rewardTypes'
import moment from 'moment'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'
import { deleteReward, getRewardType, postReward, updateReward } from '@/services/rewardService'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import { Employee } from '@/types/apps/userTypes'
import { getEmployees } from '@/services/employeeService'
import { format } from 'path'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RewardWithAction = Reward & {
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

// Column Definitions
const columnHelper = createColumnHelper<RewardWithAction>()

type DialogMode = 'add' | 'edit' | 'delete' | null

const RewardListTable = ({ tableData }: { tableData?: Reward[] }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  const [rewardTypes, setRewardTypes] = useState<RewardType[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Hooks
  const {dictionary} = useDictionary();
  const { lang: locale } = useParams()
  const methods = useForm<Reward>({
    defaultValues: defaultFormValuesReward
  })

  const { cache, mutate: swrMutate } = useSWRConfig();

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

   const handleOpenDialog = async  (mode: DialogMode, obj?: Reward) => {
      setDialogMode(mode)
      if(obj) setSelectedReward(obj)

      try {
          // Load both employees and leaves in parallel
          const [responses1, responses2] = await Promise.all([
            getRewardType(),
            getEmployees(),
          ])
          
          setRewardTypes(responses1?.data?.reward_types || [])
          setEmployees(responses2?.data || [])
        } catch (error) {
          console.error('Error loading dialog data:', error)
        } 
  
      if (mode == 'edit') {
        const formattedData = {
          ...obj,
          }
          // Reset form 
          methods.reset(formattedData)
        
      }else{
        methods.reset(defaultFormValuesReward)
      }
  
      setDialogOpen(true)
    }

    const handleCloseDialog = () => {
      setDialogOpen(false)
      setDialogMode(null)
      setSelectedReward(null)
    }
    
    const handleDialogSuccess = async () => {
      swrMutate('/web/rewards')
      handleCloseDialog()
    }
  
    const handleDeleteCancel = () => {
      setDialogOpen(false)
      setSelectedReward(null)
    }
  
    const handleDeleteConfirm = async () => {
        if (!selectedReward) return
        
        try {
          setIsDeleting(true)
          
          const response = await deleteReward(selectedReward!.id)
          
          if (response.status) {
            // Show success message
            toast.success(response.message )
            handleDialogSuccess()
          }
        } catch (error: any) {
          // Handle error
          toast.error(error?.response?.data?.message )
        } finally {
          setIsDeleting(false)
          handleDeleteCancel()
        }
    }
  

  const columns = useMemo<ColumnDef<RewardWithAction, any>[]>(
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
        header: 'Employee',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original?.employee?.name || ''}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('reward_type.name', {
        header: 'Reward Type',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original?.reward_type?.name || ''}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {moment(row.original?.date).format("MMM D, YYYY") || ''}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('gift', {
        header: 'Gift',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original?.gift || ''}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original?.description || ''}
              </Typography>
            </div>
          </div>
        )
      }),
     
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton title='Edit' onClick={() => handleOpenDialog('edit', row.original)}>
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
            <IconButton title='Delete' onClick={() => handleOpenDialog('delete', row.original)}>
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
    data: filteredData as Reward[],
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
        <CardHeader title='Reward List' className='pbe-4' />
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
              placeholder='Search Here ...'
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
              onClick={() => handleOpenDialog('add' )}
              className='max-sm:is-full'
            >
              Add Reward
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

      {dialogOpen && dialogMode == 'add' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={'Add new Reward'}
        onSubmit={async (data:Reward) => {
          try {
            const res = await postReward({
              ...data,
              date: data.date ? moment(data.date).format('YYYY-MM-DD') : ''
            });
            
            if (res.status) {
              swrMutate('/web/rewards')
              toast.success(res.message)
            }
          } catch (error) {
            console.log('Error post branch', error)
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
            label={`Employee`}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an employee'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} Employee</MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </QTextField>
        <QTextField
            name='reward_type_id'
            control={methods.control}
            fullWidth
            required
            select
            label={`Reward Type`}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an reward type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} Employee</MenuItem>
            {rewardTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </QTextField>
          <QReactDatepicker
            name="date"
            control={methods.control}
            label={'Date'}
            required
          />
          <QTextField
            name='gift'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} Gift`}
            label={`Gift`}
          />
          <QTextField
            name='description'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} Description`}
            label={`Description`}
            multiline={true}
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
              if (!selectedReward) return
              
              const formattedData = {
                ...data,
                date: data.date ? moment(data.date).format('YYYY-MM-DD') : ''
              }
              
              const response = await updateReward(selectedReward.id,formattedData);
              
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
        <QTextField
            name='employee_id'
            control={methods.control}
            fullWidth
            required
            select
            label={`Employee`}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an employee'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} Employee</MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </QTextField>
        <QTextField
            name='reward_type_id'
            control={methods.control}
            fullWidth
            required
            select
            label={`Reward Type`}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an reward type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} Employee</MenuItem>
            {rewardTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </QTextField>
          <QReactDatepicker
            name="date"
            control={methods.control}
            label={'Date'}
            required
          />
          <QTextField
            name='gift'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} Gift`}
            label={`Gift`}
          />
          <QTextField
            name='description'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} Description`}
            label={`Description`}
            multiline={true}
          />
       </>
        </FormDialog>
      )}
      
      {dialogOpen && dialogMode == 'delete' && (
        <ConfirmationDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          type='delete-reward'
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}
    </>
  )
}

export default RewardListTable
