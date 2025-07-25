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
import type { User } from '@/types/apps/userTypes'
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
import { KeyedMutator } from 'swr'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { toast } from 'react-toastify'
import { deleteUser, fetchRoles } from '@/services/userService'
import EditUserDrawer from './EditUserDrawer'
import { Role } from '@/types/userTypes'
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

type UsersTypeWithAction = User & {
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

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({ tableData, mutate }: { tableData?: User[],  mutate: KeyedMutator<any> }) => {
  const { user } = useAuth()
  
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [roles, setRoles] = useState<Role[]>([])

  // Add new states for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Hooks
  const { lang: locale } = useParams()
  const {dictionary} = useDictionary();

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setEditUserOpen(true)
  }

  // Handle delete dialog
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
      if (!userToDelete) return
     
      try {
        setIsDeleting(true)
        
        const response = await deleteUser(userToDelete.id)
        
        if (response.status) {
          // Remove the deleted user from the table data
          setData(prevData => prevData?.filter(user => user.id !== userToDelete.id))
          setFilteredData(prevData => prevData?.filter(user => user.id !== userToDelete.id))
          
          // Show success message
          toast.success(response.message || 'User deleted successfully')
        }
      } catch (error: any) {
        // Handle error
        toast.error(error?.response?.data?.message || 'Error deleting user')
      } finally {
        setIsDeleting(false)
        handleDeleteCancel()
      }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }


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
      columnHelper.accessor('first_name', {
        header: dictionary['content'].fullName,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original.avatar, first_name:row.original.first_name, last_name: row.original.last_name })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
              {row.original.first_name} {row.original.last_name}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: dictionary['content'].email,
        cell: ({ row }) => (
              <Typography color='text.primary' className='font-medium'>
                {row.original.email}
              </Typography>
        )
      }),
      columnHelper.accessor('type', {
        header: dictionary['content'].role,
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {/* <Icon
              className={userRoleObj[row.original.type].icon}
              sx={{ color: `var(--mui-palette-${userRoleObj[row.original.type].color}-main)` }}
            /> */}
            <Typography className='capitalize' color='text.primary'>
              {row.original.type}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('is_active', {
        header: dictionary['content'].status,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              label={row.original.is_active ? 'Active' : 'Inactive'}
              size='small'
              color={userStatusObj[row.original.is_active ? 'active' : 'inactive']}
              className='capitalize'
            />
          </div>
        )
      }),
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as User[],
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

  const getAvatar = (params: Pick<User, 'avatar' | 'first_name' | 'last_name'>) => {
    const { avatar, first_name, last_name  } = params

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(`${first_name} ${last_name}`)}</CustomAvatar>
    }
  }

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roleData = await fetchRoles()
        setRoles(roleData)
      } catch (error) {
        console.error('Error loading roles:', error)
      } finally {
      }
    }
    loadRoles()
  }, [])

  return (
    <>
      <Card>
        <CardHeader title={user && user?.type == 'super admin' ? `${dictionary['content'].list} ${dictionary['content'].company}` : `${dictionary['content'].list} ${dictionary['content'].users}`} className='pbe-4' />
        <TableFilters setData={setFilteredData} tableData={data} roles={roles} />
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
              onClick={() => setAddUserOpen(!addUserOpen)}
              className='max-sm:is-full'
            >
              {user && user?.type == 'super admin' ? dictionary['content'].addCompany : dictionary['content'].addUser }
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
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
        mutate={mutate}
        roles={roles}
      />

      <EditUserDrawer
        open={editUserOpen}
        handleClose={() => {
          setEditUserOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        mutate={mutate}
      />

       {/* Delete Confirmation Dialog */}
       <ConfirmationDialog 
        open={deleteDialogOpen} 
        setOpen={setDeleteDialogOpen}
        type='delete-user'
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  )
}

export default UserListTable
