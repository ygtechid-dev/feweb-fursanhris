'use client'

import { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

type FormDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  isEdit?: boolean
  onSubmit?: (data: any) => Promise<void>
  isLoading?: boolean
  children: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  submitText?: string
  cancelText?: string
  hideActions?: boolean
  customActions?: ReactNode
  handleSubmit: any
}

const FormDialog = ({
  open,
  setOpen,
  title = 'Add New Data',
  isEdit = false,
  onSubmit,
  isLoading = false,
  children,
  size = 'sm',
  submitText,
  cancelText = 'Cancel',
  hideActions = false,
  customActions,
  handleSubmit
}: FormDialogProps) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      scroll='body'
      maxWidth={size}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="flex justify-between items-center">
          {isEdit ? `Edit ${title}` : title}
          <IconButton onClick={handleClose}>
            <i className="tabler-x text-xl" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div className="space-y-5">
            {children}
          </div>
        </DialogContent>

        {!hideActions && (
          <DialogActions className="py-3">
            {customActions || (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : submitText || (isEdit ? 'Update' : 'Save')}
                </Button>
              </>
            )}
          </DialogActions>
        )}
      </form>
    </Dialog>
  )
}

export default FormDialog
