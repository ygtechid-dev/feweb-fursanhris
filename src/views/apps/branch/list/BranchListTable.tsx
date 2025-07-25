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
import type { ColumnDef, FilterFn, Table } from '@tanstack/react-table'
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
import { KeyedMutator, useSWRConfig } from 'swr'
import { Branch, Branches, defaultFormValuesBranch } from '@/types/branchTypes'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import QTextField from '@/@core/components/mui/QTextField'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { deleteBranch, postBranch, updateBranch } from '@/services/branchService'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog'
import { useAuth } from '@/components/AuthProvider'
import useCompanies from '@/hooks/useCompanies'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type BranchWithAction = Branch & {
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
const columnHelper = createColumnHelper<BranchWithAction>()

const BranchListTable = ({ tableData }: { tableData?: Branches }) => {
  const { user } = useAuth()
  const { companies } = useCompanies()

  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [objectToDelete, setObjectToDelete] = useState<Branch | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [objectToEdit, setObjectToEdit] = useState<Branch | null>(null)


  // Hooks
  const { lang: locale } = useParams()
  const { dictionary } = useDictionary()
  const methods = useForm<Branch>({
    defaultValues: defaultFormValuesBranch
  })
  const { cache, mutate: swrMutate } = useSWRConfig()

  useEffect(() => {
    setData(tableData)
    setFilteredData(tableData)
  }, [tableData])

  const columns = useMemo<ColumnDef<BranchWithAction, any>[]>(
    () => {
      const visibleColumns: ColumnDef<BranchWithAction, any>[] = [
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
          header: dictionary['content'].branch,
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.name}
                </Typography>
              </div>
            </div>
          )
        }),
        // Action column
        columnHelper.accessor('action', {
          header: dictionary['content'].action,
          cell: ({ row }) => (
            <div className='flex items-center'>
              <IconButton onClick={() => handleEditClick(row.original)}>
                <i className='tabler-edit text-textSecondary' />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(row.original)}>
                <i className='tabler-trash text-textSecondary' />
              </IconButton>
            </div>
          ),
          enableSorting: false
        })
      ]
      
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
        }) as ColumnDef<BranchWithAction, any>)
      }
      
      return visibleColumns
    },
    
    [data, filteredData, user, dictionary]
  )

  const table = useReactTable({
    data: filteredData as Branches,
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
    methods.reset(defaultFormValuesBranch)
    setDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!objectToDelete) return
    
    try {
      setIsDeleting(true)
      
      const response = await deleteBranch(objectToDelete.id)
      
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

  // Handle delete dialog
  const handleDeleteClick = (user: Branch) => {
    setObjectToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = async (object: Branch) => {
    setObjectToEdit(object)
    setEditDialogOpen(true)

    methods.reset({
      ...object
    })
  }

  return (
    <>
      <Card>
        <CardHeader title={dictionary['content'].branchList} className='pbe-4' />
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
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={handleDialogOpen}
              className='max-sm:is-full'
            >
              {dictionary['content'].addNewBranch}
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
          component={() => <TablePaginationComponent table={table as unknown as Table<unknown>} />}
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
        title={dictionary['content'].addNewBranch}
        onSubmit={async (data: any) => {
          try {
            const res = await postBranch(data)
            if (res.status) {
              swrMutate('/branches')
              toast.success(res.message)
            }
          } catch (error) {
            console.log('Error post branch', error)
          } finally {
            methods.reset()
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
            name='name'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} ${dictionary['content'].branch} ${dictionary['content'].name}`}
            label={dictionary['content'].name}
          />
        </>
      </FormDialog>

      <FormDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        title={`${dictionary['content'].edit} ${dictionary['content'].branch}`}
        onSubmit={async (data: any) => {
          try {
            if (!objectToEdit) return
            
            const res = await updateBranch(data, objectToEdit.id)
            if (res.status) {
              // Update the local data
              // const updatedData = data?.map((branch: Branch) => 
              //   branch.id === objectToEdit.id ? { ...branch, ...data } : branch
              // )
              
              
              // Refresh data with SWR
              swrMutate('/branches')
              toast.success(res.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error) {
            console.log('Error updating branch', error)
            toast.error(dictionary['content'].errorUpdatingLeave)
          } finally {
            methods.reset()
            setEditDialogOpen(false)
            setObjectToEdit(null)
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
            name='name'
            control={methods.control}
            fullWidth
            required
            placeholder={`${dictionary['content'].enter} ${dictionary['content'].branch} ${dictionary['content'].name}`}
            label={dictionary['content'].name}
          />
        </>
      </FormDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-branch'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  )
}

export default BranchListTable
