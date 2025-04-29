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
import { Reimbursement } from '@/types/reimburseTypes';
import { formatCurrency } from '@/utils/formatCurrency';

interface ReimburseDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Reimbursement | null;
}

const ReimburseDetail = ({ open, setOpen, data }: ReimburseDetailProps) => {
  const { dictionary } = useDictionary();
  
  if (!data) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'secondary';
      case 'paid':
        return 'success';
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
  
 
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="leave-details-dialog-title"
    >
      <DialogTitle id="leave-details-dialog-title" className="flex justify-between items-center py-3">
        {dictionary['content'].reimburseDetail}
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
                  {data.employee.name}
                </Typography>
                <Chip
                  label={ucfirst(data.status)}
                  color={getStatusColor(data.status)}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {data.category.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].requestNumber}
              </Typography>
              <Typography variant="body1">{data.request_number}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].transactionDate}
              </Typography>
              <Typography variant="body1">{data.transaction_date}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].requestedAt}
              </Typography>
              <Typography variant="body1">{data.requested_at}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].amount}
              </Typography>
              <Typography variant="body1">{formatCurrency(data.amount)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {dictionary['content'].description}
              </Typography>
              <Typography variant="body1">{data.description}</Typography>
            </Grid>
            {data.remark && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content'].remark}
                </Typography>
                <Typography variant="body1" className="mt-1">
                  {data.remark}
                </Typography>
              </Grid>
            )}
            {/* Status section */}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* Approval information */}
            {(data.status === 'approved' || data.approver) && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content']?.approvedBy || 'Approved By'}
                </Typography>
                <Typography variant="body1" className="mt-1 flex items-center">
                  <span className="font-medium">{data.approver?.first_name} {data.approver?.last_name}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {formatDateTime(data.approved_at)}
                </Typography>
              </Grid>
            )}
            {/* Rejection information */}
            {data.status === 'rejected' && data.rejecter && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content']?.rejectedBy || 'Rejected By'}
                </Typography>
                <Typography variant="body1" className="mt-1 flex items-center">
                  <span className="font-medium">{data.rejecter.first_name} {data.rejecter.last_name}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {formatDateTime(data.rejected_at)}
                </Typography>
              </Grid>
            )}
            {/* Payment information */}
            {data.status === 'paid' && data.payer && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  {dictionary['content']?.paidBy || 'Paid By'}
                </Typography>
                <Typography variant="body1" className="mt-1 flex items-center">
                  <span className="font-medium">{data.payer.first_name} {data.payer.last_name}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {formatDateTime(data.paid_at)}
                </Typography>
                {/* {data.payment_method && (
                  <Box className="mt-2">
                    <Typography variant="body2" color="text.secondary">
                      {dictionary['content']?.paymentMethod || 'Payment Method'}
                    </Typography>
                    <Typography variant="body1">
                      {data.payment_method}
                    </Typography>
                  </Box>
                )} */}
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

export default ReimburseDetail;
