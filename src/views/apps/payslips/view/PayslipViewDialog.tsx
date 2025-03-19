'use client'

import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { formatPrice } from '@/utils/formatPrice'
import { Allowance, Deduction, Payslip } from '@/types/payslipTypes'
import axiosInstance from '@/libs/axios'

// Function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Function to get month name
const getMonthName = (month: string) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  const monthIndex = parseInt(month, 10) - 1
  return monthNames[monthIndex] || month
}

interface PayslipViewDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  payslip: Payslip | null
}

const PayslipViewDialog = ({ open, setOpen, payslip }: PayslipViewDialogProps) => {
  console.log({payslip})
  const [isDownloading, setIsDownloading] = useState(false)
  // Commented out print state
  // const [isPrinting, setIsPrinting] = useState(false)

  // Parse JSON strings to arrays
  const allowances = payslip?.allowance ? JSON.parse(payslip.allowance) : []
  const deductions = payslip?.deduction ? JSON.parse(payslip.deduction) : []
  const overtimes = payslip?.overtime ? JSON.parse(payslip.overtime) : []

  const handleClose = () => {
    setOpen(false)
  }

  // Commented out print function
  /*
  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 1000)
  }
  */

  // New function to download PDF
  const handleDownloadPdf = async () => {
    if (!payslip?.id) return
    
    try {
      setIsDownloading(true)
      
      const response = await axiosInstance.get(`/web/payslips/${payslip.id}/export-pdf`)
      
      if (response.data.status && response.data.data.file_url) {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a')
        link.href = response.data.data.file_url
        link.setAttribute('download', `Payslip-${payslip.payslip_number}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error('PDF download failed:', response.data.message)
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      // You might want to show a toast notification here
    } finally {
      setIsDownloading(false)
    }
  }

  if (!payslip) return null

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      // Changed to use isDownloading instead of isPrinting
      className={isDownloading ? 'download-mode' : ''}
    >
      <DialogTitle className="flex justify-between items-center border-b">
        <Typography variant="h6">Payslip Details</Typography>
        <div className="flex gap-2">
          {/* Replaced Print button with Download PDF button */}
          <Button
            variant="contained"
            startIcon={<i className="tabler-download" />}
            onClick={handleDownloadPdf}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
          <IconButton onClick={handleClose}>
            <i className="tabler-x" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className="pt-6">
        <div id="payslip-content">
          {/* Header with company info */}
          <div className="text-center mb-6">
            <Typography variant="h5" className="font-bold">FURSAN-HRIS</Typography>
            <Typography variant="subtitle1">
              PAYSLIP FOR {getMonthName(payslip.month)} {payslip.year}
            </Typography>
            <Typography variant="body2">Ref: {payslip.payslip_number}</Typography>
          </div>

          {/* Employee Information */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="mb-3">Employee Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{payslip.employee?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">ID:</Typography>
                  <Typography variant="body1">{payslip.employee_id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Department:</Typography>
                  <Typography variant="body1">{payslip.employee?.department?.name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Branch:</Typography>
                  <Typography variant="body1">{payslip.employee?.branch?.name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Position:</Typography>
                  <Typography variant="body1">{payslip.employee?.designation.name || '-'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="mb-3">Salary Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Salary Type:</Typography>
                  <Typography variant="body1" className="capitalize">{payslip.salary_type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Basic Salary:</Typography>
                  <Typography variant="body1">{formatPrice(payslip.basic_salary)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                  <Chip 
                    label={payslip.payment_status} 
                    color={payslip.payment_status === 'paid' ? 'success' : 'secondary'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Payment Date:</Typography>
                  <Typography variant="body1">{formatDate(payslip.payment_date)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                  <Typography variant="body1" className="capitalize">{payslip.payment_method || '-'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="mb-3">Earnings</Typography>
              <Box className="mb-4">
                <Grid container className="font-medium mb-1">
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Description</Typography>
                  </Grid>
                  <Grid item xs={6} className="text-right">
                    <Typography variant="subtitle2">Amount</Typography>
                  </Grid>
                </Grid>
                <Divider />
                
                <Grid container className="py-2">
                  <Grid item xs={6}>
                    <Typography>Basic Salary</Typography>
                  </Grid>
                  <Grid item xs={6} className="text-right">
                    <Typography>{formatPrice(payslip.basic_salary)}</Typography>
                  </Grid>
                </Grid>
                
                {allowances.length > 0 && (
                  <>
                    <Divider />
                    {allowances.map((allowance : Allowance, index:number) => (
                      <Grid container className="py-2" key={`allowance-${index}`}>
                        <Grid item xs={6}>
                          <Typography>{allowance.title}</Typography>
                        </Grid>
                        <Grid item xs={6} className="text-right">
                          <Typography>{formatPrice(allowance.amount)}</Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                )}
                
                {overtimes.length > 0 && (
                  <>
                    <Divider />
                    <Grid container className="py-2">
                      <Grid item xs={6}>
                        <Typography>Overtime</Typography>
                      </Grid>
                      <Grid item xs={6} className="text-right">
                        <Typography>{formatPrice(payslip.total_overtime)}</Typography>
                      </Grid>
                    </Grid>
                  </>
                )}
                
                <Divider />
                <Grid container className="py-2 font-medium">
                  <Grid item xs={6}>
                    <Typography>Total Earnings</Typography>
                  </Grid>
                  <Grid item xs={6} className="text-right">
                    <Typography>
                      {formatPrice(
                        (parseFloat(payslip.basic_salary) + 
                        parseFloat(payslip.total_allowance) + 
                        parseFloat(payslip.total_overtime)).toString()
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Deductions */}
          {deductions.length > 0 && (
            <Card className="mb-4">
              <CardContent>
                <Typography variant="h6" className="mb-3">Deductions</Typography>
                <Box>
                  <Grid container className="font-medium mb-1">
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Description</Typography>
                    </Grid>
                    <Grid item xs={6} className="text-right">
                      <Typography variant="subtitle2">Amount</Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  
                  {deductions.map((deduction: Deduction, index:number) => (
                    <Grid container className="py-2" key={`deduction-${index}`}>
                      <Grid item xs={6}>
                        <Typography>{deduction.title}</Typography>
                      </Grid>
                      <Grid item xs={6} className="text-right">
                        <Typography>{formatPrice(deduction.amount)}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                  
                  <Divider />
                  <Grid container className="py-2 font-medium">
                    <Grid item xs={6}>
                      <Typography>Total Deductions</Typography>
                    </Grid>
                    <Grid item xs={6} className="text-right">
                      <Typography>{formatPrice(payslip.total_deduction)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Net Salary */}
          <Card className="mb-4">
            <CardContent className="bg-primary-lighten">
              <Grid container className="py-2 font-bold">
                <Grid item xs={6}>
                  <Typography variant="h6">NET SALARY:</Typography>
                </Grid>
                <Grid item xs={6} className="text-right">
                  <Typography variant="h6">{formatPrice(payslip.net_salary)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box className="text-center mt-6 text-xs text-gray-500">
            <Typography variant="caption">This is a computer-generated document. No signature is required.</Typography>
            <Typography variant="caption" display="block">
              Generated on {new Date().toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </Typography>
          </Box>
        </div>
      </DialogContent>

      {/* Commented out Print Styles */}
      {/*
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #payslip-content, #payslip-content * {
            visibility: visible;
          }
          #payslip-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .MuiDialog-root {
            position: absolute !important;
            left: 0;
            top: 0;
            height: auto;
            overflow: visible !important;
          }
          .MuiPaper-root {
            box-shadow: none !important;
          }
          .MuiDialogTitle-root, .MuiDialogActions-root, .print-hide {
            display: none !important;
          }
        }
      `}</style>
      */}
    </Dialog>
  )
}

export default PayslipViewDialog
