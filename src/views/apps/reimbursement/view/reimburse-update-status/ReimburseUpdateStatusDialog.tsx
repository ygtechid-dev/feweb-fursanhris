'use client'

import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { Reimbursement } from '@/types/reimburseTypes'
import { updateReimbursementStatus } from '@/services/reimbursementService'

interface ReimburseUpdateStatusDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  data: Reimbursement | null
  onStatusUpdate: () => void
}

const ReimburseUpdateStatusDialog = ({ open, setOpen, data, onStatusUpdate }: ReimburseUpdateStatusDialogProps) => {
  // States
  const [status, setStatus] = useState<'approved' | 'rejected' | 'paid'>('approved')
  const [remark, setRemark] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  // Hooks
  const { dictionary } = useDictionary()
  
  const handleClose = () => {
    setOpen(false)
    setStatus('approved')
    setRemark('')
  }
  
  const handleSubmit = async () => {
    if (!data) return
    
    try {
      setIsSubmitting(true)
      
      const response = await updateReimbursementStatus(data.id, {
        status,
        remark: remark.trim() || getDefaultRemark()
      })
      
      if (response.status) {
        toast.success(response.message || `${dictionary['content'].reimbursement} ${status} ${dictionary['content'].successfully}`)
        onStatusUpdate()
        handleClose()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `${dictionary['content'].errorUpdating} ${dictionary['content'].reimbursementStatus}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getDefaultRemark = () => {
    switch (status) {
      case 'approved':
        return 'Reimbursement approved';
      case 'rejected':
        return 'Reimbursement rejected';
      case 'paid':
        return 'Reimbursement paid';
      default:
        return '';
    }
  }
  
  const getButtonColor = () => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'paid':
        return 'primary';
      default:
        return 'primary';
    }
  }

  useEffect(() => {
    if (data?.status == 'approved') {
      setStatus('paid')
    }
  }, [data, open])
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {dictionary['content'].updateReimburseStatus}
        {data && (
          <span className="text-sm font-normal">
            {data.employee.name} • {data?.category?.name}
          </span>
        )}
      </DialogTitle>
      
      <DialogContent dividers>
        <div className="my-4">
          <FormControl component="fieldset">
            <FormLabel component="legend">{dictionary['content'].status}</FormLabel>
            <RadioGroup
              row
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'approved' | 'rejected' | 'paid')}
            >
             
               {
                data?.status != 'approved' && data?.status != 'paid'&& 
                  <FormControlLabel 
                  value="approved" 
                  control={<Radio color="success" />} 
                  label={dictionary['content'].approved} 
                />
              }
              {
                data?.status != 'approved' && data?.status != 'paid' && 
                <FormControlLabel 
                value="rejected" 
                control={<Radio color="error" />} 
                label={dictionary['content'].rejected} 
              />
              }
              <FormControlLabel 
                value="paid" 
                control={<Radio color="primary" />} 
                label={dictionary['content'].paid} 
              />
            </RadioGroup>
          </FormControl>
        </div>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label={dictionary['content'].remark}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={
            status === 'approved' 
              ? dictionary['content'].enterApprovalRemark 
              : status === 'rejected'
                ? dictionary['content'].enterRejectionReason
                : dictionary['content'].enterPaymentDetails
          }
          variant="outlined"
          className="mt-4"
        />
      </DialogContent>
      
      <DialogActions className="p-6">
        <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
          {dictionary['content'].cancel}
        </Button>
        <Button 
          variant="contained" 
          color={getButtonColor()}
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting 
            ? dictionary['content'].updating 
            : status === 'approved' 
              ? dictionary['content'].approve
              : status === 'rejected'
                ? dictionary['content'].reject
                : dictionary['content'].markAsPaid
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReimburseUpdateStatusDialog
