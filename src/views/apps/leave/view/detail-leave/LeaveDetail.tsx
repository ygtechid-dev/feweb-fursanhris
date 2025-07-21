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
import { Leave } from '@/types/leaveTypes';
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext';
import { ucfirst } from '@/utils/string';
import { Link } from '@mui/material';

interface LeaveDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  leaveData: Leave | null;
}

const LeaveDetailsDialog = ({ open, setOpen, leaveData }: LeaveDetailsDialogProps) => {
  const { dictionary } = useDictionary();

  if (!leaveData) return null;

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

  // Function to determine if file is an image or PDF
  const isImageFile = (url: string) => {
    const lowerCaseUrl = url.toLowerCase();
    return lowerCaseUrl.endsWith('.jpg') || 
           lowerCaseUrl.endsWith('.jpeg') || 
           lowerCaseUrl.endsWith('.png') || 
           lowerCaseUrl.endsWith('.gif') || 
           lowerCaseUrl.endsWith('.webp');
  };
  
  const isPdfFile = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };
  
  // Function to open receipt in new tab
  const handleViewReceipt = () => {
    if (leaveData.document_path) {
      window.open(leaveData.document_path, '_blank');
    }
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="leave-details-dialog-title"
    >
      <DialogTitle id="leave-details-dialog-title" className="flex justify-between items-center py-3">
        {dictionary['content'].leaveDetails}
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
                  {leaveData.employee.name}
                </Typography>
                <Chip 
                  label={ucfirst(leaveData.status)} 
                  color={getStatusColor(leaveData.status)} 
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {leaveData.leave_type.title}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].appliedOn}
              </Typography>
              <Typography variant="body1">{leaveData.applied_on}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].totalDays}
              </Typography>
              <Typography variant="body1">{leaveData.total_leave_days} {dictionary['content'].totalDays}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].startDate}
              </Typography>
              <Typography variant="body1">{leaveData.start_date}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].endDate}
              </Typography>
              <Typography variant="body1">{leaveData.end_date}</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].leaveReason}
              </Typography>
              <Typography variant="body1" className="mt-1">
                {leaveData.leave_reason}
              </Typography>
            </Grid>
            
            {leaveData.emergency_contact && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content'].emergencyContact}
                </Typography>
                <Typography variant="body1" className="mt-1">
                  {leaveData.emergency_contact}
                </Typography>
              </Grid>
            )}
            
            {leaveData.remark && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content'].remark}
                </Typography>
                <Typography variant="body1" className="mt-1">
                  {leaveData.remark}
                </Typography>
              </Grid>
            )}

            {/* Receipt Display Section */}
            {leaveData.document_path && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" className="mb-1">
                  {dictionary['content']?.document || 'Receipt'}
                </Typography>
                
                <Box className="mt-1 flex flex-col">
                  {isImageFile(leaveData.document_path) ? (
                    <Box className="max-w-xs mb-2">
                      <img 
                        src={leaveData.document_path} 
                        alt="Receipt" 
                        className="w-full rounded border cursor-pointer" 
                        onClick={handleViewReceipt}
                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                      />
                    </Box>
                  ) : isPdfFile(leaveData.document_path) ? (
                    <Box className="flex items-center">
                      <i className="tabler-file-type-pdf text-red-500 text-xl mr-2" />
                      <Link
                        href="#" 
                        onClick={handleViewReceipt}
                        underline="hover"
                        className="text-primary"
                      >
                        {dictionary['content']?.viewReceipt || 'View PDF Receipt'}
                      </Link>
                    </Box>
                  ) : (
                    <Link 
                      href={leaveData.document_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      underline="hover"
                      className="text-primary"
                    >
                      {dictionary['content']?.viewReceipt || 'View Receipt'}
                    </Link>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" className="mt-1">
                    {leaveData.document_path.split('/').pop() || 'Receipt'}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {/* Status section */}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Approval information */}
            {leaveData.status === 'approved' && leaveData.approver && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content']?.approvedBy || 'Approved By'}
                </Typography>
                <Typography variant="body1" className="mt-1 flex items-center">
                  <span className="font-medium">{leaveData.approver.first_name} {leaveData.approver.last_name}</span>
                  {/* <Chip 
                    label={leaveData.approver.type} 
                    size="small" 
                    color="primary"
                    className="ml-2"
                  /> */}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {formatDateTime(leaveData.approved_at)}
                </Typography>
              </Grid>
            )}
            
            {/* Rejection information */}
            {leaveData.status === 'rejected' && leaveData.rejecter && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content']?.rejectedBy || 'Rejected By'}
                </Typography>
                <Typography variant="body1" className="mt-1 flex items-center">
                  <span className="font-medium">{leaveData.rejecter.first_name} {leaveData.rejecter.last_name}</span>
                  {/* <Chip 
                    label={leaveData.rejecter.type} 
                    size="small" 
                    color="error"
                    className="ml-2"
                  /> */}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {formatDateTime(leaveData.rejected_at)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className="py-3">
        <Button onClick={handleClose} color="primary">
          {dictionary['content'].close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveDetailsDialog;
