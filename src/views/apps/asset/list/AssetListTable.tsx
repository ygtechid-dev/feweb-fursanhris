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
import { useAuth } from '@/components/AuthProvider'
import useCompanies from '@/hooks/useCompanies'
import { Asset, defaultFormValuesAsset } from '@/types/assetType'
import { deleteAsset, postAsset, updateAsset } from '@/services/assetService'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type AssetWithAction = Asset & {
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
const columnHelper = createColumnHelper<AssetWithAction>()

const AssetListTable = ({ tableData }: { tableData?: Asset[] }) => {
  const { user } = useAuth()
  const { companies } = useCompanies()
  
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
  const [objectToDelete, setObjectToDelete] = useState<Asset | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedAssetForStatus, setSelectedAssetForStatus] = useState<Asset | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [AssetToEdit, setAssetToEdit] = useState<Asset | null>(null)

  // Hooks
  // const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const methods = useForm<Asset>({
      defaultValues: defaultFormValuesAsset
  })
  const { cache, mutate: swrMutate } = useSWRConfig();

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  const columns = useMemo<ColumnDef<AssetWithAction, any>[]>(
    () => {
      const visibleColumns: ColumnDef<AssetWithAction, any>[] = [
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
         columnHelper.accessor('name', {
           header: dictionary['content'].name,
           cell: ({ row }) => (
             <div className='flex items-center gap-4'>
               {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
               <div className='flex flex-col'>
                 <Typography color='text.primary' className='font-medium'>
                   {row.original.name}
                 </Typography>
                 {/* <Typography variant='body2'>{row.original.username}</Typography> */}
               </div>
             </div>
           )
         }),
         columnHelper.accessor('brand', {
           header: dictionary['content'].brand,
           cell: ({ row }) => (
             <div className='flex items-center gap-4'>
               {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
               <div className='flex flex-col'>
                 <Typography color='text.primary' className='font-medium'>
                 {row.original.brand}
                 </Typography>
                 {/* <Typography variant='body2'>{row.original.username}</Typography> */}
               </div>
             </div>
           )
         }),
         columnHelper.accessor('warranty_status', {
           header: dictionary['content'].warrantyStatus,
           cell: ({ row }) => (
             <div className='flex items-center gap-4'>
               {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
               <div className='flex flex-col'>
                 <Typography color='text.primary' className='font-medium'>
                 {row.original.warranty_status}
                 </Typography>
                 {/* <Typography variant='body2'>{row.original.username}</Typography> */}
               </div>
             </div>
           )
         }),
         columnHelper.accessor('buying_date', {
           header: dictionary['content'].buyingDate,
           cell: ({ row }) => (
             <div className='flex items-center gap-4'>
               {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
               <div className='flex flex-col'>
                 <Typography color='text.primary' className='font-medium'>
                 {row.original.buying_date ? moment(row.original.buying_date).format('YYYY-MM-DD') : ''}
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
               <IconButton  onClick={() => handleEditClick(row.original)}>
                  <i className='tabler-edit text-textSecondary' />
                </IconButton>
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
        }) as ColumnDef<AssetWithAction, any>)
      }
      
      return visibleColumns
    },
    
    [data, filteredData, user, dictionary]
  )

  const table = useReactTable({
    data: filteredData as Asset[],
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

    const handleDialogOpen = async () => {
      setDialogOpen(true)
      setEmployees([]);
      setDialogFetchLoading(true)
      
      try {
        // Load both employees and leaves in parallel
        const [employeesResponse] = await Promise.all([
          getEmployees(),
        ])
        
        setEmployees(employeesResponse?.data || [])
        methods.reset(defaultFormValuesAsset)
      } catch (error) {
        console.error('Error loading dialog data:', error)
      } finally {
        setDialogFetchLoading(false)
      }
    }
  
    // Handle delete dialog
    const handleDeleteClick = (user: Asset) => {
      setObjectToDelete(user)
      setDeleteDialogOpen(true)
    }
  
    const handleDeleteConfirm = async () => {
          if (!objectToDelete) return
         
          try {
            setIsDeleting(true)
            
            const response = await deleteAsset(objectToDelete.id)
            
            if (response.status) {
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
  
    const handleEditClick = async (obj: Asset) => {
      setAssetToEdit(obj)
      // setDialogFetchLoading(true)
      setEmployees([])
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
          buying_date: obj.buying_date ? moment(obj.buying_date).format('YYYY-MM-DD') : '',
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
        <CardHeader title={dictionary['content'].assetList} className='pbe-4' />
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
              {dictionary['content'].addNewAsset}
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
        title={dictionary['content'].addNewAsset}
        onSubmit={async (data:any) => {
          try {
            const formattedData = {
              ...data,
              buying_date: data.buying_date ? moment(data.buying_date).format('YYYY-MM-DD') : '',
            }

            const res = await postAsset(formattedData);
            console.log({res})
            if (res.status) {
              swrMutate('/web/assets')
              toast.success(res.message)
            }
          } catch (error: any) {
            console.log('Error post leave', error)
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
          name='name'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].name}`}
          label={`${dictionary['content'].name}`}
        />
        <QTextField
          name='brand'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].brand}`}
          label={`${dictionary['content'].brand}`}
        />
         <QTextField
            name='warranty_status'
            control={methods.control}
            fullWidth
            required
            select
            label={dictionary['content'].warrantyStatus}
            disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an warranty status'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].warrantyStatus}</MenuItem>
            <MenuItem value="On">{dictionary['content'].on}</MenuItem>
            <MenuItem value="Off">{dictionary['content'].off}</MenuItem>
          </QTextField>

        <QReactDatepicker
          name="buying_date"
          control={methods.control}
          label={`${dictionary['content'].buyingDate}`}
          required
        />

      
       {/* <QTextField
          name='remark'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].remark}`}
          label={dictionary['content'].remark}
        /> */}
       </>
      </FormDialog>

      <FormDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        title={`${dictionary['content'].edit} ${dictionary['content'].designation}`}
        onSubmit={async (data:any) => {
          try {
            if (!selectedAsset) return
            
            const res = await updateAsset(data, selectedAsset.id);
            
            if (res.status) {
              // Refresh data with SWR
              swrMutate('/web/assets')
              toast.success(res.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error: any) {
            console.log('Error post asset', error)
            // Tampilkan pesan error dengan toast
            if (error.response && error.response.data) {
              toast.error(error.response.data.message)
            } else {
              toast.error('Terjadi kesalahan pada sistem')
            }
          }finally {
            methods.reset()
            setEditDialogOpen(false)
            setSelectedAsset(null)
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

          { methods.watch('created_by') && user && user?.type == 'super admin' && employees.filter((emp) => emp.created_by == methods.getValues('created_by')).map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}
        </QTextField>

        <QTextField
          name='name'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].name}`}
          label={`${dictionary['content'].name}`}
        />
        <QTextField
          name='brand'
          control={methods.control}
          fullWidth
          required
          placeholder={`${dictionary['content'].enter} ${dictionary['content'].brand}`}
          label={`${dictionary['content'].brand}`}
        />
         <QTextField
            name='warranty_status'
            control={methods.control}
            fullWidth
            required
            select
            label={dictionary['content'].warrantyStatus}
            disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an warranty status'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} {dictionary['content'].warrantyStatus}</MenuItem>
            <MenuItem value="On">{dictionary['content'].on}</MenuItem>
            <MenuItem value="Off">{dictionary['content'].off}</MenuItem>
          </QTextField>

        <QReactDatepicker
          name="buying_date"
          control={methods.control}
          label={`${dictionary['content'].buyingDate}`}
          required
        />
       </>
      </FormDialog>

       {/* Delete Confirmation Dialog */}
       <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-asset'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  )
}

export default AssetListTable
