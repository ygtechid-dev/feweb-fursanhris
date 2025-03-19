import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext';
import { ucfirst } from '@/utils/string';
import { Overtime } from '@/types/overtimeType';

interface OvertimeDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  overtimeData: Overtime | null;
}

const OvertimeDetailsDialog = ({ open, setOpen, overtimeData }: OvertimeDetailsDialogProps) => {
  const { dictionary } = useDictionary();

  if (!overtimeData) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Format date and time from timestamp
  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return '-';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  // Format time (e.g., "14:30" to "2:30 PM")
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return time;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="overtime-details-dialog-title"
    >
      <DialogTitle id="overtime-details-dialog-title" className="flex justify-between items-center py-3">
        {'Overtime Details'}
        <IconButton onClick={handleClose} size="small">
          <i className="tabler-x" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="mb-4">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box className="flex justify-between items-center mb-2">
                <Typography variant="h6" className="text-lg font-semibold">
                  {overtimeData.employee.name}
                </Typography>
                <Chip 
                  label={ucfirst(overtimeData.status)} 
                  color={getStatusColor(overtimeData.status)} 
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {overtimeData.title}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {'Overtime Date'}
              </Typography>
              <Typography variant="body1">{overtimeData.overtime_date}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {'Total Hours'}
              </Typography>
              <Typography variant="body1">{overtimeData.hours} {dictionary['content']?.hours || 'hours'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {'Start Time'}
              </Typography>
              <Typography variant="body1">{formatTime(overtimeData.start_time)}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {'End Time'}
              </Typography>
              <Typography variant="body1">{formatTime(overtimeData.end_time)}</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content']?.remark || 'Remark'}
              </Typography>
              <Typography variant="body1" className="mt-1">
                {overtimeData.remark || '-'}
              </Typography>
            </Grid>
            
            {/* Status section */}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Creation information */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                { 'Created At'}
              </Typography>
              <Typography variant="body1">{formatDateTime(overtimeData.created_at)}</Typography>
            </Grid>
            
            {/* Approval information */}
            {overtimeData.status === 'approved' && overtimeData.approver && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content']?.approvedBy || 'Approved By'}
                </Typography>
                <Typography variant="body1" className="mt-1 flex items-center">
                  <span className="font-medium">{overtimeData.approver.first_name} {overtimeData.approver.last_name}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {formatDateTime(overtimeData.approved_at)}
                </Typography>
              </Grid>
            )}
            
            {/* Rejection information */}
            {overtimeData.status === 'rejected' && overtimeData.rejecter && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.rejectedBy || 'Rejected By'}
                  </Typography>
                  <Typography variant="body1" className="mt-1 flex items-center">
                    <span className="font-medium">{overtimeData.rejecter.first_name} {overtimeData.rejecter.last_name}</span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-1">
                    {formatDateTime(overtimeData.rejected_at)}
                  </Typography>
                </Grid>
                
                {overtimeData.rejection_reason && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      { 'Rejection Reason'}
                    </Typography>
                    <Typography variant="body1" className="mt-1">
                      {overtimeData.rejection_reason}
                    </Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className="py-3">
        <Button onClick={handleClose} color="primary">
          {dictionary['content'].close || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OvertimeDetailsDialog;
