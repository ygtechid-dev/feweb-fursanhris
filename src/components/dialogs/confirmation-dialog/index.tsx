'use client'

import { Fragment, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import classnames from 'classnames'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

type ConfirmationType = 'delete-account' 
| 'unsubscribe' 
| 'suspend-account' 
| 'delete-order' 
| 'delete-customer' 
| 'delete-user' 
| 'delete-employee'
| 'delete-leave'
| 'delete-branch'
| 'delete-department'
| 'delete-designation'
| 'delete-overtime'
| 'delete-payslip'
| 'delete-allowance'
| 'delete-deduction'
| 'delete-reward'
| 'delete-resignation'
| 'delete-trip'
| 'delete-promotion'
| 'delete-complaint'
| 'delete-warning'
| 'delete-termination'
| 'delete-project'

type ConfirmationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  type: ConfirmationType
  onConfirm?: () => Promise<void> // Add this new prop
  isLoading?: boolean // Add loading state prop
}

const ConfirmationDialog = ({ open, setOpen, type, onConfirm, isLoading }: ConfirmationDialogProps) => {
  const [secondDialog, setSecondDialog] = useState(false)
  const [userInput, setUserInput] = useState(false)
  const {dictionary} = useDictionary()

  const Wrapper = type === 'suspend-account' ? 'div' : Fragment

  const handleSecondDialogClose = () => {
    setSecondDialog(false)
    setOpen(false)
  }

  const handleConfirmation = async (value: boolean) => {
    setUserInput(value)
    
    if (value && onConfirm) {
      await onConfirm()
    }
    
    setSecondDialog(true)
    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth maxWidth='xs' open={open} onClose={() => setOpen(false)}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
          <Wrapper
            {...(type === 'suspend-account' && {
              className: 'flex flex-col items-center gap-2'
            })}
          >
            <Typography variant='h4'>
              {type === 'delete-account' && 'Are you sure you want to deactivate your account?'}
              {type === 'unsubscribe' && 'Are you sure to cancel your subscription?'}
              {type === 'suspend-account' && 'Are you sure?'}
              {type === 'delete-order' && 'Are you sure?'}
              {type === 'delete-customer' && 'Are you sure?'}
              {type === 'delete-user' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].user.toLowerCase()}?`}
              {type === 'delete-employee' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].employee.toLowerCase()}?`}
              {type === 'delete-leave' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].leave.toLowerCase()}?`}
              {type === 'delete-branch' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].branch.toLowerCase()}?`}
              {type === 'delete-department' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].department.toLowerCase()}?`}
              {type === 'delete-designation' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].designation.toLowerCase()}?`}
              {type === 'delete-overtime' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['navigation'].overtimes.toLowerCase()}?`}
              {type === 'delete-payslip' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['navigation'].payslip.toLowerCase()}?`}
              {type === 'delete-allowance' && `${dictionary['content'].areYouSureWantToDelete} Allowance?`}
              {type === 'delete-deduction' && `${dictionary['content'].areYouSureWantToDelete} Deduction?`}
              {type === 'delete-reward' && `${dictionary['content'].areYouSureWantToDelete} Reward?`}
              {type === 'delete-resignation' && `${dictionary['content'].areYouSureWantToDelete} Resignation?`}
              {type === 'delete-trip' && `${dictionary['content'].areYouSureWantToDelete} Trip?`}
              {type === 'delete-promotion' && `${dictionary['content'].areYouSureWantToDelete} Promotion?`}
              {type === 'delete-complaint' && `${dictionary['content'].areYouSureWantToDelete} Complaint?`}
              {type === 'delete-warning' && `${dictionary['content'].areYouSureWantToDelete} Warning?`}
              {type === 'delete-termination' && `${dictionary['content'].areYouSureWantToDelete} Termination?`}
              {type === 'delete-project' && `${dictionary['content'].areYouSureWantToDelete} Project?`}
            </Typography>
            {type === 'suspend-account' && (
              <Typography color='text.primary'>You won&#39;t be able to revert user!</Typography>
            )}
            {type === 'delete-order' && (
              <Typography color='text.primary'>You won&#39;t be able to revert order!</Typography>
            )}
            {type === 'delete-customer' && (
              <Typography color='text.primary'>You won&#39;t be able to revert customer!</Typography>
            )}
          </Wrapper>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button 
            variant='contained' 
            onClick={() => handleConfirmation(true)}
            disabled={isLoading}
          >
            {isLoading ? `${dictionary['content'].deleting}...` : 
              type === 'suspend-account'
                ? 'Yes, Suspend User!'
                : type === 'delete-order'
                  ? 'Yes, Delete Order!'
                  : type === 'delete-customer'
                    ? 'Yes, Delete Customer!'
                    : dictionary['content'].yes}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => {
              handleConfirmation(false)
            }}
            disabled={isLoading}
          >
            {dictionary['content'].cancel}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={secondDialog} onClose={handleSecondDialogClose}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i
            className={classnames('text-[88px] mbe-6', {
              'tabler-circle-check': userInput,
              'text-success': userInput,
              'tabler-circle-x': !userInput,
              'text-error': !userInput
            })}
          />
          <Typography variant='h4' className='mbe-2'>
            {userInput
              ? `${type === 'delete-account' ? 'Deactivated' : type === 'unsubscribe' ? 'Unsubscribed' : type === 'delete-order' || 'delete-customer' || 'delete-user' ? 'Deleted' : 'Suspended!'}`
              : dictionary['content'].cancelled}
          </Typography>
          <Typography color='text.primary'>
            {userInput ? (
              <>
                {type === 'delete-account' && 'Your account has been deactivated successfully.'}
                {type === 'unsubscribe' && 'Your subscription cancelled successfully.'}
                {type === 'suspend-account' && 'User has been suspended.'}
                {type === 'delete-order' && 'Your order deleted successfully.'}
                {type === 'delete-customer' && 'Your customer removed successfully.'}
                {type === 'delete-user' && dictionary['content'].yourUserRemovedSuccessfully}
                {type === 'delete-employee' && dictionary['content'].yourEmployeeRemovedSuccessfully}
                {type === 'delete-leave' && dictionary['content'].leaveRemovedSuccessfully}
                {type === 'delete-branch' && 'Branch removed successfully'}
                {type === 'delete-department' && 'Department removed successfully'}
                {type === 'delete-designation' && 'Position removed successfully'}
                {type === 'delete-overtime' && 'Overtime removed successfully'}
                {type === 'delete-payslip' && 'Payslip removed successfully'}
                {type === 'delete-allowance' && 'Allowance removed successfully'}
                {type === 'delete-deduction' && 'Deduction removed successfully'}
                {type === 'delete-reward' && 'Reward removed successfully'}
                {type === 'delete-resignation' && 'Resignation removed successfully'}
                {type === 'delete-trip' && 'Trip removed successfully'}
                {type === 'delete-promotion' && 'Trip removed successfully'}
                {type === 'delete-complaint' && 'Complaint removed successfully'}
                {type === 'delete-warning' && 'Warning removed successfully'}
                {type === 'delete-termination' && 'Termination removed successfully'}
                {type === 'delete-project' && 'Project removed successfully'}
              </>
            ) : (
              <>
                {type === 'delete-account' && 'Account Deactivation Cancelled!'}
                {type === 'unsubscribe' && 'Unsubscription Cancelled!!'}
                {type === 'suspend-account' && 'Cancelled Suspension :)'}
                {type === 'delete-order' && 'Order Deletion Cancelled'}
                {type === 'delete-customer' && 'Customer Deletion Cancelled'}
                {type === 'delete-user' && dictionary['content'].userDeletionCancelled}
                {type === 'delete-employee' && dictionary['content'].employeeDeletionCancelled}
                {type === 'delete-leave' && dictionary['content'].leaveDeletionCancelled}
                {type === 'delete-branch' && 'Branch Deletion Cancelled'}
                {type === 'delete-department' && 'Department Deletion Cancelled'}
                {type === 'delete-designation' && 'Position Deletion Cancelled'}
                {type === 'delete-overtime' && 'Overtime Deletion Cancelled'}
                {type === 'delete-payslip' && 'Payslip Deletion Cancelled'}
                {type === 'delete-allowance' && 'Allowance Deletion Cancelled'}
                {type === 'delete-deduction' && 'Deduction Deletion Cancelled'}
                {type === 'delete-reward' && 'Reward Deletion Cancelled'}
                {type === 'delete-resignation' && 'Resignation Deletion Cancelled'}
                {type === 'delete-trip' && 'Trip Deletion Cancelled'}
                {type === 'delete-complaint' && 'Complaint Deletion Cancelled'}
                {type === 'delete-project' && 'Project Deletion Cancelled'}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            {dictionary['content'].ok}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmationDialog
