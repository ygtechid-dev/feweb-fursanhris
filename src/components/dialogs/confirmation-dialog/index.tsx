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
| 'delete-asset'
| 'delete-reimbursement'
| 'delete-leave-type'

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
              {type === 'delete-allowance' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].allowance.toLowerCase()}?`}
              {type === 'delete-deduction' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].deduction.toLowerCase()}?`}
              {type === 'delete-reward' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].reward.toLowerCase()}?`}
              {type === 'delete-resignation' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].resignation.toLowerCase()}?`}
              {type === 'delete-trip' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].trip.toLowerCase()}?`}
              {type === 'delete-promotion' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].promotion.toLowerCase()}?`}
              {type === 'delete-complaint' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].complaint.toLowerCase()}?`}
              {type === 'delete-warning' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].warning.toLowerCase()}?`}
              {type === 'delete-termination' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].termination.toLowerCase()}?`}
              {type === 'delete-project' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].project.toLowerCase()}?`}
              {type === 'delete-asset' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].asset.toLowerCase()}?`}
              {type === 'delete-reimbursement' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].reimbursement.toLowerCase()}?`}
              {type === 'delete-leave-type' && `${dictionary['content'].areYouSureWantToDelete} ${dictionary['content'].leaveType.toLowerCase()}?`}
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
                {type === 'delete-branch' && `${dictionary['content'].branch} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-department' && `${dictionary['content'].department} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-designation' && `${dictionary['content'].designation} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-overtime' && `${dictionary['content'].overtime} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-payslip' && `${dictionary['content'].payslip} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-allowance' && `${dictionary['content'].allowance} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-deduction' && `${dictionary['content'].deduction} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-reward' && `${dictionary['content'].reward} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-resignation' && `${dictionary['content'].resignation} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-trip' && `${dictionary['content'].trip} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-promotion' && `${dictionary['content'].promotion} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-complaint' && `${dictionary['content'].complaint} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-warning' && `${dictionary['content'].warning} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-termination' && `${dictionary['content'].termination} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-project' && `${dictionary['content'].project} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-asset' && `${dictionary['content'].asset} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-reimbursement' && `${dictionary['content'].reimbursement} ${dictionary['content'].removedSuccessfully}`}
                {type === 'delete-leave-type' && `${dictionary['content'].leaveType} ${dictionary['content'].removedSuccessfully}`}
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
                {type === 'delete-branch' && `${dictionary['content'].branch} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-department' && `${dictionary['content'].department} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-designation' && `${dictionary['content'].designation} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-overtime' && `${dictionary['content'].overtime} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-payslip' && `${dictionary['content'].payslip} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-allowance' && `${dictionary['content'].allowance} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-deduction' && `${dictionary['content'].deduction} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-reward' && `${dictionary['content'].reward} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-resignation' && `${dictionary['content'].resignation} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-trip' && `${dictionary['content'].trip} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-complaint' && `${dictionary['content'].complaint} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-project' && `${dictionary['content'].project} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-asset' && `${dictionary['content'].asset} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-reimbursement' && `${dictionary['content'].reimbursement} ${dictionary['content'].deletionCancelled}`}
                {type === 'delete-leave-type' && `${dictionary['content'].leaveType} ${dictionary['content'].deletionCancelled}`}
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
