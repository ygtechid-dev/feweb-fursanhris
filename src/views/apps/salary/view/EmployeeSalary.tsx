'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

import { Button, MenuItem, Tooltip, Typography } from '@mui/material'

import { Employee } from '@/types/apps/userTypes'
import { formatPrice } from '@/utils/formatPrice'
import { EditIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import FormDialog from '@/components/dialogs/form-dialog/FormDialog'
import { toast } from 'react-toastify'
import QTextField from '@/@core/components/mui/QTextField'
import { updateEmployeeSalary } from '@/services/employeeService'
import { useParams } from 'next/navigation'

type DialogMode = 'add' | 'edit' | 'delete' | null

type Salary = {
  salary: number;
  salary_type: string;
}

const EmployeeSalary = ({employee, fetchEmployee} : {employee?:Employee, fetchEmployee:any}) => {
  const {dictionary} = useDictionary();
  const params = useParams()

   // States
   const [rowSelection, setRowSelection] = useState({})
   const [globalFilter, setGlobalFilter] = useState('')
   const [dialogMode, setDialogMode] = useState<DialogMode>(null)
   const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const employeeId = typeof params.id === 'string' 
  ? params.id 
  : typeof params.detail === 'string' 
    ? params.detail 
    : Array.isArray(params.id) 
      ? params.id[0] 
      : Array.isArray(params.detail) 
        ? params.detail[0] 
        : '';

   const methods = useForm<Salary>({
       defaultValues: {
        salary: 0,
        salary_type: ''
       }
     })
  
   const handleOpenDialog =  (mode: DialogMode, salary?: Salary) => {
       setDialogMode(mode)
       if(salary) setSelectedSalary(salary)
     
       if (mode == 'edit') {
         const formattedData = {
           ...salary,
          }
          // Reset form 
          methods.reset(formattedData)
        
       }else{
         methods.reset({
          salary: 0,
          salary_type: ''
         })
       }
   
       setDialogOpen(true)
     }

    const handleCloseDialog = () => {
      setDialogOpen(false)
      setDialogMode(null)
      setSelectedSalary(null)
    }
  
    const handleDialogSuccess = async () => {
      fetchEmployee();
      handleCloseDialog()
    }
return (
  <Card className=''>
    <CardHeader 
    title={`${dictionary['content'].employee} ${dictionary['content'].salary}`}
     action={
      <Tooltip title={`${dictionary['content'].add} ${dictionary['content'].allowance}`}>
        <Button
          variant='contained'
          color='primary'
          className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          onClick={() => handleOpenDialog('edit', {
            salary: employee?.salary || 0,
            salary_type:  employee?.salary_type || ''
          })}
        >
          <EditIcon fontSize="small" />
        </Button>
      </Tooltip>
    }
    />
    <CardContent>
      <Grid container spacing={6} className=''>
        <Grid item sm={6}>
         <div className="flex flex-col">
            <Typography color='text.primary' className='font-medium'>
            {`${dictionary['content'].payslipType}`}
            </Typography>
            {employee?.salary_type}
          </div> 
        </Grid>
        <Grid item sm={6} className='text-end'>
          <div className="flex flex-col">
            <Typography color='text.primary' className='font-medium'>
            {`${dictionary['content'].salary}`}
            </Typography>
            {formatPrice(employee?.salary || '')}
          </div> 
        </Grid>
        <Grid item sm={6} className=''>
          <div className="flex flex-col">
            <Typography color='text.primary' className='font-medium'>
            {`${dictionary['content'].accountHolderName}`}
            </Typography>
            {employee?.account_holder_name }
          </div> 
        </Grid>
      </Grid>
    </CardContent>

    {dialogOpen && dialogMode == 'edit' && (
        <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        // title={dictionary['content'].addNewBranch}
        title={`${dictionary['content'].edit} ${dictionary['content'].salary}`}
        onSubmit={async (data:any) => {
          try {
            if (!selectedSalary) return
            
            const res = await updateEmployeeSalary(parseInt(employeeId), {
              ...data
            });
            
            if (res.status) {
              
              // Refresh data with SWR
              handleDialogSuccess()
              toast.success(res.message || dictionary['content'].leaveUpdatedSuccessfully)
            }
          } catch (error) {
            console.log('Error updating allowance', error)
            toast.error(dictionary['content'].errorUpdatingLeave)
          } finally {
            methods.reset()
            // setEditDialogOpen(false)
            // setObjectToEdit(null)
          }
        }}
        handleSubmit={methods.handleSubmit}
      >
       <>
        <QTextField
            name='salary_type'
            control={methods.control}
            fullWidth
            required
            select
            label={`${dictionary['content'].type}`}
            // disabled={dialogFetchLoading}
            rules={{
              validate: (value:any) => value !== 0 && value !== "0" || 'Please select an type'
            }}
          >
            <MenuItem value="0">{dictionary['content'].select} {`${dictionary['content'].type}`}</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="hourly">Hourly</MenuItem>
          </QTextField>
       
          <QTextField
            name='salary'
            control={methods.control}
            fullWidth
            required
            type='number'
            placeholder={`${dictionary['content'].enter} ${dictionary['content'].salary}`}
            // label={dictionary['content'].name}
            label={`Amount`}
          />
         
       </>
       
      </FormDialog>
      )} 
  </Card>
)
}

export default EmployeeSalary
