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
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type Props = {
  open: boolean
  handleClose: () => void
  userData?: UsersType[]
  setData: (data: UsersType[]) => void
}

type FormValidateType = {
  fullName: string
  password: string
  username: string
  email: string
  role: string
  plan: string
  status: string
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

const AddDrawer = (props: Props) => {
  // Props
  const { open, handleClose, userData, setData } = props
// States
const [date, setDate] = useState<Date | null | undefined>(new Date())

  // States
  const [formData, setFormData] = useState<FormNonValidateType>(initialData)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      fullName: '',
      password: '',
      username: '',
      email: '',
      role: '',
      plan: '',
      status: ''
    }
  })

  const onSubmit = (data: FormValidateType) => {
    const newUser: UsersType = {
      id: (userData?.length && userData?.length + 1) || 1,
      avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`,
      fullName: data.fullName,
      password: data.password,
      username: data.username,
      email: data.email,
      role: data.role,
      currentPlan: data.plan,
      status: data.status,
      company: formData.company,
      country: formData.country,
      contact: formData.contact,
      billing: userData?.[Math.floor(Math.random() * 50) + 1].billing ?? 'Auto Debit'
    }

    setData([...(userData ?? []), newUser])
    handleClose()
    setFormData(initialData)
    resetForm({ fullName: '',password: '', username: '', email: '', role: '', plan: '', status: '' })
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
        <Typography variant='h5'>Add New Warning</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
        <Controller
            name='fullName'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-role'
                label='Warning By'
                {...field}
                {...(errors.role && { error: true, helperText: 'This field is required.' })}
              >
                <MenuItem value='' >Select Employee</MenuItem>
                <MenuItem value='admin'>Employee Abc</MenuItem>
                <MenuItem value='author'>Employee Abcasd</MenuItem>
                <MenuItem value='editor'>Employee sss</MenuItem>
              </CustomTextField>
            )}
          />
          <CustomTextField
                select
                fullWidth
                id='select-role'
                label='Warning To'
              >
                <MenuItem value='' >Select Employee</MenuItem>
                <MenuItem value='admin'>Employee Abc</MenuItem>
                <MenuItem value='author'>Employee Abcasd</MenuItem>
                <MenuItem value='editor'>Employee sss</MenuItem>
              </CustomTextField>
          <CustomTextField
            label='Subject'
            fullWidth
            placeholder='Enter Subject'
            // value={formData.company}
            // onChange={e => setFormData({ ...formData, company: e.target.value })}
          />
          <AppReactDatepicker
            selected={date}
            id='basic-input'
            onChange={(date: Date | null) => setDate(date)}
            placeholderText='Click to select a date'
            value=''
            customInput={<CustomTextField label='Warning Date' fullWidth />}
          />
         {/* <CustomTextField
            label='Purpose of Trip'
            fullWidth
            placeholder=''
            // value={formData.company}
            // onChange={e => setFormData({ ...formData, company: e.target.value })}
          /> */}
          <CustomTextField
            rows={4}
            multiline
            label='Description'
            defaultValue=''
            placeholder='Enter Reason'
            id='textarea-outlined-static'
          />
         
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

export default AddDrawer
