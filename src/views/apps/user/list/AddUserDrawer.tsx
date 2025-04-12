// React Imports
import { useEffect, useState } from 'react'

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

import { User } from '@/types/apps/userTypes'
import QTextField from '@/@core/components/mui/QTextField'
import { toast } from 'react-toastify'
import { Role } from '@/types/userTypes'
import { fetchRoles, postUser } from '@/services/userService'
import { KeyedMutator, useSWRConfig } from 'swr'
import { useParams, useRouter } from 'next/navigation'
import { Dictionary } from '@/@core/types'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

type Props = {
  open: boolean
  handleClose: () => void
  userData?: User[]
  setData: (data: User[]) => void,
  mutate: KeyedMutator<any>
  roles:Role[]
}



// Vars
const initialData = {
  company: '',
  country: '',
  contact: ''
}

const AddUserDrawer = (props: Props) => {
  // Props
  const { open, handleClose, userData, setData, roles } = props

  // States
  const [formData, setFormData] = useState<any>(initialData)
  
  
  const [isLoading, setIsLoading] = useState(false)


  // Hooks
  const { mutate } = useSWRConfig()
  const {dictionary} = useDictionary();
  const router = useRouter()
  const { lang:locale} = useParams();
  const methods = useForm<User>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      type: '',
    }
  })

  const onSubmit = async (data: User) => {
    try {
      setIsLoading(true)
      const res = await postUser(data)

      if (res.status) {
        // Properly mutate the SWR cache with the key
        await mutate('/web/users', async (currentData: any) => {
          console.log({currentData})
          // If we have the response data, use it directly
          if (res.data) {
            return {
              ...currentData,
              data: [...(currentData?.data || []), res.data]
            }
          }
          // If no response data, invalidate the cache to trigger a refetch
          return undefined
        })

        toast.success(res?.message)
        handleReset()
      }
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error('Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    handleClose()
    methods.reset({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      type: '',
    });
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
        <Typography variant='h5'>{dictionary['content'].addUser}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={methods.handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
           <QTextField
              name='first_name'
              control={methods.control}
              fullWidth
              required
              placeholder={`${dictionary['content'].enter} ${dictionary['content'].firstName}`}
              rules={{ 
                minLength: {
                  value: 3,
                  message: 'first name must be at least 3 characters'
                }
              }}
              label={dictionary['content'].firstName}
            />
          
           <QTextField
              name='last_name'
              control={methods.control}
              fullWidth
              required
              placeholder={`${dictionary['content'].enter} ${dictionary['content'].lastName}`}
              rules={{ 
                minLength: {
                  value: 3,
                  message: 'last name must be at least 3 characters'
                }
              }}
              label={dictionary['content'].lastName}
            />

          <QTextField
              name='email'
              control={methods.control}
              fullWidth
              required
              placeholder={`${dictionary['content'].enter} ${dictionary['content'].email}`}
              type='email' 
              rules={{ 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              }}
              label={dictionary['content'].email}
            />

            <QTextField
             name='password'
              control={methods.control}
              fullWidth
              required
              placeholder={`${dictionary['content'].enter} ${dictionary['content'].password}`}
              type='password' 
              rules={{ 
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              }}
              label={dictionary['content'].password}
            />

            <QTextField
              name='type'
              control={methods.control}
              fullWidth
              required
              placeholder={`${dictionary['content'].enter} ${dictionary['content'].role}`}
              label={dictionary['content'].role}
              select
            >
              <MenuItem value="">{dictionary['content'].select} {dictionary['content'].role}</MenuItem>
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </QTextField>
        
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
            {isLoading ? `${dictionary['content'].submitting}...` : dictionary['content'].submit}
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              {dictionary['content'].cancel}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
