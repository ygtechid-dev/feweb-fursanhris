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
import GeneratePayslip from './GeneratePayslip'
import { Payslip } from '@/types/payslipTypes'
import { formatPrice } from '@/utils/formatPrice'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import { deletePayslips, updatePayslipPaymentStatus } from '@/services/payslipService'
import { toast } from 'react-toastify'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import PaymentConfirmationDialog from '@/components/dialogs/payment-confirmation-dialog/PaymentConfirmationDialog'
import { useSWRConfig } from 'swr'
import PayslipViewDialog from '../view/PayslipViewDialog'
import { useAuth } from '@/components/AuthProvider'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type PayslipWithAction = Payslip & {
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
const columnHelper = createColumnHelper<PayslipWithAction>()

const PayslipListTable = ({ tableData }: { tableData?: Payslip[] }) => {
  const { user } = useAuth()

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [objectToDelete, setObjectToDelete] = useState<Payslip | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedViewPayslip, setSelectedViewPayslip] = useState<Payslip | null>(null)


  // Hooks
  const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const { mutate: swrMutate } = useSWRConfig();

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  const columns = useMemo<ColumnDef<PayslipWithAction, any>[]>(
    () => {
      const visibleColumns:ColumnDef<PayslipWithAction, any>[] = [
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
              {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                {row.original?.employee?.name}
                </Typography>
              </div>
            </div>
          )
        }),
        columnHelper.accessor('employee.salary_type', {
          header: dictionary['content'].payrollType,
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                {row.original?.employee?.salary_type}
                </Typography>
                {/* <Typography variant='body2'>{row.original.username}</Typography> */}
              </div>
            </div>
          )
        }),
        columnHelper.accessor('employee.salary', {
          header: dictionary['content'].salary,
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                {formatPrice(row.original?.employee?.salary || '')}
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
                {formatPrice(row.original?.net_salary || '')}
                </Typography>
                {/* <Typography variant='body2'>{row.original.username}</Typography> */}
              </div>
            </div>
          )
        }),
        columnHelper.accessor('payment_status', {
          header: dictionary['content'].status,
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
              <div className='flex flex-col'>
                {/* <Typography color='text.primary' className='font-medium'>
                Medicle Leave
                </Typography> */}
                <Chip label={row.original?.payment_status} color={row.original?.payment_status == 'paid' ? 'success' : 'secondary' }/>
                {/* <Typography variant='body2'>{row.original.username}</Typography> */}
              </div>
            </div>
          )
        }),
      
        columnHelper.accessor('action', {
          header: dictionary['content'].action,
          cell: ({ row }) => (
            <div className='flex items-center'>
              <IconButton title='View Payslip' onClick={() => handleViewClick(row.original)}>
                <i className='tabler-script text-textSecondary' />
              </IconButton>
              {
                row.original.payment_status == 'unpaid' && 
                <IconButton title='Click to paid' onClick={() => handlePaymentClick(row.original)}>
                  <i className='tabler-currency-dollar text-textSecondary' />
                </IconButton> 
              } 
              <IconButton title='Delete' onClick={() => handleDeleteClick(row.original)}>
                <i className='tabler-trash text-textSecondary' />
              </IconButton>
            </div>
          ),
          enableSorting: false
        })
      ]
      
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
           }) as ColumnDef<PayslipWithAction, any>)
         }
         
         return visibleColumns
       },
       
       [data, filteredData, user, dictionary]
  )

  const table = useReactTable({
    data: filteredData as Payslip[],
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

  const handleViewClick = (payslip: Payslip) => {
    setSelectedViewPayslip(payslip)
    setViewDialogOpen(true)
  }

  const handlePaymentClick = (payslip: Payslip) => {
    setSelectedPayslip(payslip)
    setPaymentDialogOpen(true)
  }
  
  // Add this function to handle payment confirmation
  const handlePaymentConfirm = async () => {
    if (!selectedPayslip) return
    
    try {
      setIsProcessingPayment(true)
      
      // Call your API service to update the payment status
      const response = await updatePayslipPaymentStatus(selectedPayslip.id, {
        payment_status: 'paid'
      })
      
      if (response.status) {
        swrMutate('/web/payslips');
        // Show success message
        // toast.success(response.message || dictionary['content'].paymentSuccessful)
        toast.success(response.message)
      }
    } catch (error: any) {
      // Handle error
      // toast.error(error?.response?.data?.message || dictionary['content'].errorProcessingPayment)
      toast.error(error?.response?.data?.message)
    } finally {
      setIsProcessingPayment(false)
      setPaymentDialogOpen(false)
      setSelectedPayslip(null)
    }
  }

  // Handle delete dialog
  const handleDeleteClick = (obj: Payslip) => {
    setObjectToDelete(obj)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
        if (!objectToDelete) return
        
        try {
          setIsDeleting(true)
          
          const response = await deletePayslips(objectToDelete.id)
          
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
    
  return (
    <>
    <Card className='mb-6'>
      <CardHeader title={`${dictionary['content'].generate} ${dictionary['content'].payslip}`} className='pbe-4' />
      <GeneratePayslip  />
    </Card>
      <Card>
        <CardHeader title={`${dictionary['content'].findEmployeePayslip}`} className='pbe-4' />
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

      <PaymentConfirmationDialog
        open={paymentDialogOpen}
        setOpen={setPaymentDialogOpen}
        onConfirm={handlePaymentConfirm}
        isLoading={isProcessingPayment}
        type="payment-confirmation"
        selectedPayslip={selectedPayslip}
      />
     
     {/* Delete Confirmation Dialog */}
     <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-payslip'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <PayslipViewDialog
        open={viewDialogOpen} 
        setOpen={setViewDialogOpen} 
        payslip={selectedViewPayslip} 
      />
    </>
  )
}

export default PayslipListTable
