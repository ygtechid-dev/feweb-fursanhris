'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
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

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Fuzzy filter function
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

interface ReusableTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  showCheckboxes?: boolean
  pageSize?: number
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  onRowSelectionChange?: (value: {}) => void
}

function ReusableTable<T>({
  data,
  columns,
  showCheckboxes = false,
  pageSize = 10,
  globalFilter = '',
  onGlobalFilterChange,
  onRowSelectionChange
}: ReusableTableProps<T>) {
  // States
  const [rowSelection, setRowSelection] = useState({})

  // Prepare columns with checkbox if needed
  const tableColumns = useMemo(() => {
    if (!showCheckboxes) return columns
    
    return [
      {
        id: 'select',
        header: ({ table }: { table: Table<T> }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }: any) => (
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
      ...columns
    ]
  }, [columns, showCheckboxes])

  // Handle row selection change
  const handleRowSelectionChange = (newRowSelection: {}) => {
    setRowSelection(newRowSelection)
    if (onRowSelectionChange) {
      onRowSelectionChange(newRowSelection)
    }
  }

  // Handle global filter change
  const handleGlobalFilterChange = (value: string) => {
    if (onGlobalFilterChange) {
      onGlobalFilterChange(value)
    }
  }

  const table = useReactTable({
    data,
    columns: tableColumns as ColumnDef<T, any>[],
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize
      }
    },
    enableRowSelection: showCheckboxes,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: handleGlobalFilterChange,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
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
          <tbody className='border-be'>
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
  )
}

export default ReusableTable
