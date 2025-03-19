'use client'

import { useState } from 'react'
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
import { Leave } from '@/types/leaveTypes'
import { updateLeaveStatus } from '@/services/leaveService'
import { toast } from 'react-toastify'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

interface LeaveStatusDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  leaveData: Leave | null
  onStatusUpdate: () => void
}

const LeaveStatusDialog = ({ open, setOpen, leaveData, onStatusUpdate }: LeaveStatusDialogProps) => {
  // States
  const [status, setStatus] = useState<'approved' | 'rejected'>('approved')
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
    if (!leaveData) return
    
    try {
      setIsSubmitting(true)
      
      const response = await updateLeaveStatus(leaveData.id, {
        status,
        remark: remark.trim() || (status === 'approved' ? 'Leave approved' : 'Leave rejected')
      })
      
      if (response.status) {
        toast.success(response.message || `${dictionary['content'].leave} ${status} ${dictionary['content'].successfully}`)
        onStatusUpdate()
        handleClose()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `${dictionary['content'].errorUpdating} ${dictionary['content'].leaveStatus}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {dictionary['content'].updateLeaveStatus}
        {leaveData && (
          <span className="text-sm font-normal">
            {leaveData.employee.name} • {leaveData.leave_type.title}
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
              onChange={(e) => setStatus(e.target.value as 'approved' | 'rejected')}
            >
              <FormControlLabel 
                value="approved" 
                control={<Radio color="success" />} 
                label={dictionary['content'].approved} 
              />
              <FormControlLabel 
                value="rejected" 
                control={<Radio color="error" />} 
                label={dictionary['content'].rejected} 
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
          placeholder={status === 'approved' 
            ? dictionary['content'].enterApprovalRemark 
            : dictionary['content'].enterRejectionReason
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
          color={status === 'approved' ? 'success' : 'error'}
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting 
            ? dictionary['content'].updating 
            : status === 'approved' 
              ? dictionary['content'].approved 
              : dictionary['content'].rejected
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeaveStatusDialog
