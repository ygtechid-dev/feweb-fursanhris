'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Divider,
  Tabs,
  Tab,
  Box,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import { formatPrice } from '@/utils/formatPrice'

// Import dialog components
// import AllowanceDialog from './AllowanceDialog'
// import DeductionDialog from './DeductionDialog'
// import OvertimeDialog from './OvertimeDialog'
import { Allowance, Deduction, Payslip } from '@/types/payslipTypes'
import { Overtime } from '@/types/overtimeType'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import axiosInstance from '@/libs/axios'

// TabPanel component for tab content
const TabPanel = (props:any) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payslip-tabpanel-${index}`}
      aria-labelledby={`payslip-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const PayslipDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [payslipData, setPayslipData] = useState<Payslip | null>(null)
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [overtimes, setOvertimes] = useState<Overtime[]>([])
  
  // Dialog states
  const [allowanceDialogOpen, setAllowanceDialogOpen] = useState(false)
  const [deductionDialogOpen, setDeductionDialogOpen] = useState(false)
  const [overtimeDialogOpen, setOvertimeDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Fetch payslip data
    const fetchPayslipData = async () => {
      try {
        const response = await axiosInstance.get(`/web/payslips/${id}`)
        const data = await response.data?.data;
        
        setPayslipData(data)
        
        // Parse JSON strings if they exist
        if (data.allowance) {
          setAllowances(typeof data.allowance === 'string' ? JSON.parse(data.allowance) : data.allowance)
        }
        
        if (data.deduction) {
          setDeductions(typeof data.deduction === 'string' ? JSON.parse(data.deduction) : data.deduction)
        }
        
        if (data.overtime) {
          setOvertimes(typeof data.overtime === 'string' ? JSON.parse(data.overtime) : data.overtime)
        }
      } catch (error) {
        console.error('Error fetching payslip data:', error)
      }
    }

    if (id) {
      fetchPayslipData()
    }
  }, [id])

  const handleTabChange = (event:any, newValue:any) => {
    setActiveTab(newValue)
  }

  // Handler for adding new allowance
  const handleAddAllowance = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setAllowanceDialogOpen(true)
  }

  // Handler for editing allowance
  const handleEditAllowance = (item: Allowance) => {
    setSelectedItem(item)
    setIsEditing(true)
    setAllowanceDialogOpen(true)
  }

  // Handler for deleting allowance
  const handleDeleteAllowance = async (itemId:number) => {
    try {
      await fetch(`/api/allowances/${itemId}`, {
        method: 'DELETE'
      })
      
      // Update local state
      setAllowances(allowances.filter(item => item.id !== itemId))
      
      // Recalculate totals
      updatePayslipTotals()
    } catch (error) {
      console.error('Error deleting allowance:', error)
    }
  }

  // Handler for adding new deduction
  const handleAddDeduction = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setDeductionDialogOpen(true)
  }

  // Handler for editing deduction
  const handleEditDeduction = (item: Deduction) => {
    setSelectedItem(item)
    setIsEditing(true)
    setDeductionDialogOpen(true)
  }

  // Handler for deleting deduction
  const handleDeleteDeduction = async (itemId:number) => {
    try {
      await fetch(`/api/deductions/${itemId}`, {
        method: 'DELETE'
      })
      
      // Update local state
      setDeductions(deductions.filter(item => item.id !== itemId))
      
      // Recalculate totals
      updatePayslipTotals()
    } catch (error) {
      console.error('Error deleting deduction:', error)
    }
  }

  // Handler for adding new overtime
  const handleAddOvertime = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setOvertimeDialogOpen(true)
  }

  // Handler for editing overtime
  const handleEditOvertime = (item: Overtime) => {
    setSelectedItem(item)
    setIsEditing(true)
    setOvertimeDialogOpen(true)
  }

  // Handler for deleting overtime
  const handleDeleteOvertime = async (itemId: number) => {
    try {
      await fetch(`/api/overtimes/${itemId}`, {
        method: 'DELETE'
      })
      
      // Update local state
      setOvertimes(overtimes.filter(item => item.id !== itemId))
      
      // Recalculate totals
      updatePayslipTotals()
    } catch (error) {
      console.error('Error deleting overtime:', error)
    }
  }

  // Function to update payslip totals after changes
  const updatePayslipTotals = async () => {
    try {
      const response = await fetch(`/api/payslips/${id}/recalculate`, {
        method: 'POST'
      })
      const updatedPayslip = await response.json()
      setPayslipData(updatedPayslip)
    } catch (error) {
      console.error('Error recalculating payslip:', error)
    }
  }

  // Save allowance handler
  const handleSaveAllowance = async (allowanceData : Allowance) => {
    try {
      if (isEditing) {
        // Update existing allowance
        await fetch(`/api/allowances/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...allowanceData,
            employee_id: payslipData?.employee_id
          })
        })
        
        // Update local state
        setAllowances(allowances.map(item => 
          item.id === selectedItem.id ? { ...item, ...allowanceData } : item
        ))
      } else {
        // Add new allowance
        const response = await fetch('/api/allowances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...allowanceData,
            employee_id: payslipData?.employee_id,
            month: payslipData?.month,
            year: payslipData?.year
          })
        })
        const newAllowance = await response.json()
        
        // Update local state
        setAllowances([...allowances, newAllowance])
      }
      
      // Close dialog
      setAllowanceDialogOpen(false)
      
      // Recalculate totals
      updatePayslipTotals()
    } catch (error) {
      console.error('Error saving allowance:', error)
    }
  }

  // Save deduction handler
  const handleSaveDeduction = async (deductionData: Deduction) => {
    try {
      if (isEditing) {
        // Update existing deduction
        await fetch(`/api/deductions/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...deductionData,
            employee_id: payslipData?.employee_id
          })
        })
        
        // Update local state
        setDeductions(deductions.map(item => 
          item.id === selectedItem.id ? { ...item, ...deductionData } : item
        ))
      } else {
        // Add new deduction
        const response = await fetch('/api/deductions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...deductionData,
            employee_id: payslipData?.employee_id,
            month: payslipData?.month,
            year: payslipData?.year
          })
        })
        const newDeduction = await response.json()
        
        // Update local state
        setDeductions([...deductions, newDeduction])
      }
      
      // Close dialog
      setDeductionDialogOpen(false)
      
      // Recalculate totals
      updatePayslipTotals()
    } catch (error) {
      console.error('Error saving deduction:', error)
    }
  }

  // Save overtime handler
  const handleSaveOvertime = async (overtimeData: Overtime) => {
    try {
      if (isEditing) {
        // Update existing overtime
        await fetch(`/api/overtimes/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...overtimeData,
            employee_id: payslipData?.employee_id
          })
        })
        
        // Update local state
        setOvertimes(overtimes.map(item => 
          item.id === selectedItem.id ? { ...item, ...overtimeData } : item
        ))
      } else {
        // Add new overtime
        const response = await fetch('/api/overtimes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...overtimeData,
            employee_id: payslipData?.employee_id,
            month: payslipData?.month,
            year: payslipData?.year
          })
        })
        const newOvertime = await response.json()
        
        // Update local state
        setOvertimes([...overtimes, newOvertime])
      }
      
      // Close dialog
      setOvertimeDialogOpen(false)
      
      // Recalculate totals
      updatePayslipTotals()
    } catch (error) {
      console.error('Error saving overtime:', error)
    }
  }

  if (!payslipData) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading payslip data...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader 
          title={
            <div className="flex justify-between items-center">
              <Typography variant="h5">Payslip Details</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => router.back()}
              >
                Back to List
              </Button>
            </div>
          } 
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Typography variant="h6" className="mb-4">Employee Information</Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body2">{payslipData?.employee?.name}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Employee ID:</Typography>
                  <Typography variant="body2">{payslipData?.employee?.employee_id}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Department:</Typography>
                  <Typography variant="body2">{payslipData?.employee?.department?.name}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Position:</Typography>
                  <Typography variant="body2">{payslipData?.employee?.designation?.name}</Typography>
                </div>
              </div>
            </div>
            <div>
              <Typography variant="h6" className="mb-4">Payslip Information</Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Payslip Number:</Typography>
                  <Typography variant="body2">{payslipData?.payslip_number}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Month/Year:</Typography>
                  <Typography variant="body2">
                    {new Date(0, parseInt(payslipData?.month) - 1).toLocaleString('default', { month: 'long' })} {payslipData?.year}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Salary Type:</Typography>
                  <Typography variant="body2" className="capitalize">{payslipData?.salary_type}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2" color="text.secondary">Basic Salary:</Typography>
                  <Typography variant="body2">{formatPrice(payslipData?.basic_salary)}</Typography>
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="payslip tabs">
              <Tab label="Allowances" />
              <Tab label="Deductions" />
              <Tab label="Overtime" />
              <Tab label="Summary" />
            </Tabs>
          </Box>

          {/* Allowances Tab */}
          <TabPanel value={activeTab} index={0}>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">Allowances</Typography>
              <Button 
                variant="contained" 
                startIcon={<i className="tabler-plus" />} 
                onClick={handleAddAllowance}
              >
                Add Allowance
              </Button>
            </div>
            <Table>
            <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allowances.length > 0 ? (
                  allowances.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{formatPrice(item.amount)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.type} 
                          color={item.type === 'fixed' ? 'primary' : 'secondary'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditAllowance(item)}>
                          <i className="tabler-edit" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteAllowance(item.id)}>
                          <i className="tabler-trash" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No allowances found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabPanel>

          {/* Deductions Tab */}
          <TabPanel value={activeTab} index={1}>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">Deductions</Typography>
              <Button 
                variant="contained" 
                startIcon={<i className="tabler-plus" />} 
                onClick={handleAddDeduction}
              >
                Add Deduction
              </Button>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deductions.length > 0 ? (
                  deductions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{formatPrice(item.amount)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.type} 
                          color={item.type === 'fixed' ? 'primary' : 'secondary'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditDeduction(item)}>
                          <i className="tabler-edit" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteDeduction(item.id)}>
                          <i className="tabler-trash" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No deductions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabPanel>

          {/* Overtime Tab */}
          <TabPanel value={activeTab} index={2}>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">Overtime</Typography>
              <Button 
                variant="contained" 
                startIcon={<i className="tabler-plus" />} 
                onClick={handleAddOvertime}
              >
                Add Overtime
              </Button>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Hours</TableCell>
                  {/* <TableCell>Rate</TableCell> */}
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {overtimes.length > 0 ? (
                  overtimes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.overtime_date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{formatPrice(item.)}</TableCell>
                      <TableCell>{formatPrice(item.)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditOvertime(item)}>
                          <i className="tabler-edit" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteOvertime(item.id)}>
                          <i className="tabler-trash" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : ( */}
                  <TableRow>
                    <TableCell colSpan={5} align="center">No overtime records found</TableCell>
                  </TableRow>
                {/* )} */}
              </TableBody>
            </Table>
          </TabPanel>

          {/* Summary Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" className="mb-4">Payslip Summary</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="body1">Basic Salary:</Typography>
                  <Typography variant="body1">{formatPrice(payslipData?.basic_salary)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body1">Total Allowances:</Typography>
                  <Typography variant="body1">{formatPrice(payslipData?.total_allowance || 0)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body1">Total Overtime:</Typography>
                  <Typography variant="body1">{formatPrice(payslipData?.total_overtime || 0)}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body1">Total Deductions:</Typography>
                  <Typography variant="body1">{formatPrice(payslipData?.total_deduction || 0)}</Typography>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between">
                  <Typography variant="h6">Net Salary:</Typography>
                  <Typography variant="h6" color="primary">{formatPrice(payslipData?.net_salary || 0)}</Typography>
                </div>
              </div>
              <div>
                  <DatePicker
                    value={payslipData?.payment_date ? moment(payslipData?.payment_date).toString() : ''}
                    onChange={async (newDate:any) => {
                      try {
                        await fetch(`/api/payslips/${id}/payment-date`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ payment_date: newDate })
                        })
                        
                        setPayslipData({
                          ...payslipData,
                          payment_date: newDate
                        })
                      } catch (error) {
                        console.error('Error updating payment date:', error)
                      }
                    }}
                    // renderInput={(params:any) => <CustomTextField {...params} fullWidth />}r
                  />
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  className="mt-4"
                  onClick={() => {
                    // Handle print or PDF generation
                    router.push(`/payslips/${id}/print`)
                  }}
                >
                  Print Payslip
                </Button>
              </div>
            </div>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Allowance Dialog */}
      {/* <AllowanceDialog 
        open={allowanceDialogOpen}
        onClose={() => setAllowanceDialogOpen(false)}
        onSave={handleSaveAllowance}
        data={selectedItem}
        isEditing={isEditing}
      /> */}

      {/* Deduction Dialog */}
      {/* <DeductionDialog 
        open={deductionDialogOpen}
        onClose={() => setDeductionDialogOpen(false)}
        onSave={handleSaveDeduction}
        data={selectedItem}
        isEditing={isEditing}
      /> */}

      {/* Overtime Dialog */}
      {/* <OvertimeDialog 
        open={overtimeDialogOpen}
        onClose={() => setOvertimeDialogOpen(false)}
        onSave={handleSaveOvertime}
        data={selectedItem}
        isEditing={isEditing}
      /> */}
    </>
  )
}

export default PayslipDetailPage
