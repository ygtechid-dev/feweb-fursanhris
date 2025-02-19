// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'
import { useDictionary } from './dictionary-provider/DictionaryContext'

const TablePaginationComponent = ({ table }: { table: ReturnType<typeof useReactTable> }) => {
  const {dictionary} = useDictionary();
  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`${dictionary['content'].showing} ${
          table.getFilteredRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
        }
        ${dictionary['content'].to} ${Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )} ${dictionary['content'].of} ${table.getFilteredRowModel().rows.length} ${dictionary['content'].entries}`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize)}
        page={table.getState().pagination.pageIndex + 1}
        onChange={(_, page) => {
          table.setPageIndex(page - 1)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
