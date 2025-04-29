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
import { Overtime } from '@/types/overtimeType'
import { toast } from 'react-toastify'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { updateOvertimestatus } from '@/services/overtimeService'

interface OvertimeStatusDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  overtimeData: Overtime | null
  onStatusUpdate: () => void
}

const OvertimeStatusDialog = ({ open, setOpen, overtimeData, onStatusUpdate }: OvertimeStatusDialogProps) => {
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
    if (!overtimeData) return
    
    try {
      setIsSubmitting(true)
      
      const response = await updateOvertimestatus(overtimeData.id, {
        status,
        remark: remark.trim() || (status === 'approved' ? 'Overtime approved' : 'Overtime rejected')
      })
      
      if (response.status) {
        toast.success(response.message || `${'Overtime'} ${status} ${dictionary['content'].successfully}`)
        onStatusUpdate()
        handleClose()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `${dictionary['content'].errorUpdating} ${'Overtime Status'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        { 'Update Overtime Status'}
        {overtimeData && (
          <span className="text-sm font-normal">
            {overtimeData.employee.name} • {overtimeData.title}
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
                label={dictionary['content'].approved || 'Approved'} 
              />
              <FormControlLabel 
                value="rejected" 
                control={<Radio color="error" />} 
                label={dictionary['content'].rejected || 'Rejected'} 
              />
            </RadioGroup>
          </FormControl>
        </div>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label={dictionary['content'].remark || 'Remark'}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={status === 'approved' 
            ? (dictionary['content'].enterApprovalRemark || 'Enter approval remark')
            : (dictionary['content'].enterRejectionReason || 'Enter rejection reason')
          }
          variant="outlined"
          className="mt-4"
        />
      </DialogContent>
      
      <DialogActions className="p-6">
        <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
          {dictionary['content'].cancel || 'Cancel'}
        </Button>
        <Button 
          variant="contained" 
          color={status === 'approved' ? 'success' : 'error'}
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting 
            ? (dictionary['content'].updating || 'Updating')
            : status === 'approved' 
              ? (dictionary['content'].approve || 'Approve') 
              : (dictionary['content'].reject || 'Reject')
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OvertimeStatusDialog
