// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Types Imports

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { AttendanceEmployee } from '@/types/attendanceEmployeeTypes'

type Props = {
  open: boolean
  handleClose: () => void
  userData?: AttendanceEmployee[]
  setData: (data: AttendanceEmployee[]) => void
}

type FormValidateType = {
  fullName: string
  password: string
  username: string
  email: string
  role: string
  plan: string
  status: 'Present' | 'Absent' | 'Late' | 'Early';
}

type FormNonValidateType = {
  company: string
  country: string
  contact: string
}

// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddUserDrawer = (props: Props) => {
  // Props
  const { open, handleClose, userData, setData } = props

  // States
  const [formData, setFormData] = useState<FormNonValidateType>(initialData)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<AttendanceEmployee>({
    defaultValues: {
      employee_name: '',
      date: '',
      clock_in: '',
      clock_in_location: '',
      clock_in_latitude: '',
      clock_in_longitude: '',
      clock_in_photo: '',
      clock_in_notes: '',
      clock_out: '',
      clock_out_location: '',
      clock_out_latitude: '',
      clock_out_longitude: '',
      clock_out_photo: '',
      clock_out_notes: '',
      status: 'Present',
      late: '',
      early_leaving: '',
      timezone: '',
      overtime: '',
      total_rest: '',
      clock_in_formatted: '',
      clock_out_formatted: ''
    }
  })

  const onSubmit = (data: AttendanceEmployee) => {
    const newUser: AttendanceEmployee = {
      employee_name: data.employee_name,
      date: '',
      clock_in: '',
      clock_in_location: '',
      clock_in_latitude: '',
      clock_in_longitude: '',
      clock_in_photo: '',
      clock_in_notes: '',
      clock_out: '',
      clock_out_location: '',
      clock_out_latitude: '',
      clock_out_longitude: '',
      clock_out_photo: '',
      clock_out_notes: '',
      status: 'Present',
      late: '',
      early_leaving: '',
      timezone: '',
      overtime: '',
      total_rest: '',
      clock_in_formatted: '',
      clock_out_formatted: ''
    }

    setData([...(userData ?? []), newUser])
    handleClose()
    setFormData(initialData)
    resetForm()
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New User</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          {/* <Controller
            name='fullName'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Name'
                placeholder='John Doe'
                {...(errors.fullName && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          
         
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='email'
                label='Email'
                placeholder='johndoe@gmail.com'
                {...(errors.email && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                type='password'
                fullWidth
                label='Password'
                {...(errors.password && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-role'
                label='Select Role'
                {...field}
                {...(errors.role && { error: true, helperText: 'This field is required.' })}
              >
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='author'>Author</MenuItem>
                <MenuItem value='editor'>Editor</MenuItem>
                <MenuItem value='maintainer'>Maintainer</MenuItem>
                <MenuItem value='subscriber'>Subscriber</MenuItem>
              </CustomTextField>
            )}
          /> */}
          {/* <Controller
            name='plan'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-plan'
                label='Select Plan'
                {...field}
                inputProps={{ placeholder: 'Select Plan' }}
                {...(errors.plan && { error: true, helperText: 'This field is required.' })}
              >
                <MenuItem value='basic'>Basic</MenuItem>
                <MenuItem value='company'>Company</MenuItem>
                <MenuItem value='enterprise'>Enterprise</MenuItem>
                <MenuItem value='team'>Team</MenuItem>
              </CustomTextField>
            )}
          /> */}
          {/* <Controller
            name='status'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-status'
                label='Select Status'
                {...field}
                {...(errors.status && { error: true, helperText: 'This field is required.' })}
              >
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            )}
          /> */}
          {/* <CustomTextField
            label='Company'
            fullWidth
            placeholder='Company PVT LTD'
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
          /> */}
          {/* <CustomTextField
            select
            fullWidth
            id='country'
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            label='Select Country'
            inputProps={{ placeholder: 'Country' }}
          >
            <MenuItem value='India'>India</MenuItem>
            <MenuItem value='USA'>USA</MenuItem>
            <MenuItem value='Australia'>Australia</MenuItem>
            <MenuItem value='Germany'>Germany</MenuItem>
          </CustomTextField>
          <CustomTextField
            label='Contact'
            type='number'
            fullWidth
            placeholder='(397) 294-5153'
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
          /> */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
