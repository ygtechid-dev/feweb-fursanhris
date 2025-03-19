'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { formatPrice } from '@/utils/formatPrice'
import { Payslip } from '@/types/payslipTypes'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

interface PaymentConfirmationDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onConfirm: () => Promise<void>
  isLoading: boolean
  type?: 'payment-confirmation' | 'other-type'
  selectedPayslip: Payslip | null
}

const PaymentConfirmationDialog = ({
  open,
  setOpen,
  onConfirm,
  isLoading,
  type = 'payment-confirmation',
  selectedPayslip
}: PaymentConfirmationDialogProps) => {
  const { dictionary } = useDictionary()
  
  const handleClose = () => {
    if (!isLoading) {
      setOpen(false)
    }
  }

  const getDialogContent = () => {
    switch (type) {
      case 'payment-confirmation':
        return (
          <>
            <DialogTitle>
              {/* {dictionary['content']?.confirmPayment || 'Confirm Payment'} */}
              {'Confirm Payment'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {/* {dictionary['content']?.confirmPaymentMessage || 'Are you sure you want to mark this payslip as paid?'} */}
                {'Are you sure you want to mark this payslip as paid?'}
              </DialogContentText>
              
              {selectedPayslip && (
                <div className='mt-4 border-t pt-4'>
                  <Typography variant='subtitle2' className='mb-2'>
                    {/* {dictionary['content']?.payslipDetails || 'Payslip Details'}: */}
                    {'Payslip Details'}:
                  </Typography>
                  
                  <div className='grid grid-cols-2 gap-2'>
                    <Typography variant='body2' color='text.secondary'>
                      {dictionary['content']?.employee || 'Employee'}:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedPayslip.employee?.name}
                    </Typography>
                    
                    <Typography variant='body2' color='text.secondary'>
                      {/* {dictionary['content']?.netSalary || 'Net Salary'}: */}
                      {'Net Salary'}:
                    </Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {formatPrice(selectedPayslip.net_salary || '')}
                    </Typography>
                    
                    <Typography variant='body2' color='text.secondary'>
                      {/* {dictionary['content']?.currentStatus || 'Current Status'}: */}
                      {'Current Status'}:
                    </Typography>
                    <Chip 
                      label={selectedPayslip.payment_status} 
                      size="small"
                      color={selectedPayslip.payment_status === 'paid' ? 'success' : 'secondary'}
                    />
                  </div>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={isLoading}>
                {dictionary['content']?.cancel || 'Cancel'}
              </Button>
              <Button 
                onClick={onConfirm} 
                variant="contained" 
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading 
                //   ? (dictionary['content']?.processing || 'Processing...') 
                //   : (dictionary['content']?.confirmPayment || 'Confirm Payment')}
                  ? ('Processing...') 
                  : ('Confirm Payment')}
              </Button>
            </DialogActions>
          </>
        )
      
      // You can add more cases here for other types of confirmations
      default:
        return (
          <>
            <DialogTitle>
                {/* {dictionary['content']?.confirmation || 'Confirmation'} */}
                {'Confirmation'}
                </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {/* {dictionary['content']?.genericConfirmationMessage || 'Are you sure you want to proceed with this action?'} */}
                {'Are you sure you want to proceed with this action?'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={isLoading}>
                {/* {dictionary['content']?.cancel || 'Cancel'} */}
                {'Cancel'}
              </Button>
              <Button 
                onClick={onConfirm} 
                variant="contained" 
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {/* {isLoading 
                  ? (dictionary['content']?.processing || 'Processing...') 
                  : (dictionary['content']?.confirm || 'Confirm')} */}
                {isLoading 
                  ? ( 'Processing...') 
                  : ( 'Confirm')}
              </Button>
            </DialogActions>
          </>
        )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      {getDialogContent()}
    </Dialog>
  )
}

export default PaymentConfirmationDialog
