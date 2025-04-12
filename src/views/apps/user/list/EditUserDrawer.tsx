import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import { User } from '@/types/apps/userTypes'
import QTextField from '@/@core/components/mui/QTextField'
import { toast } from 'react-toastify'
import { Role } from '@/types/userTypes'
import { fetchRoles, updateUser } from '@/services/userService'
import { KeyedMutator } from 'swr'
import { useParams } from 'next/navigation'
import { Dictionary } from '@/@core/types'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

type Props = {
  open: boolean
  handleClose: () => void
  user: User | null
  mutate: KeyedMutator<any>
}

const EditUserDrawer = (props: Props) => {
  const { open, handleClose, user, mutate } = props
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { lang: locale } = useParams()
  const {dictionary} = useDictionary();

  const methods = useForm<User>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      password: user?.password || '',
      type:  '',
    }
  })

  // Update form values when user prop changes
  useEffect(() => {
    if (user) {
        const _type = roles.find(role => role.name == user.type);
        console.log({_type})
      methods.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        type: _type?.id.toString(),
      })
    }
  }, [user, methods])

  const onSubmit = async (data: User) => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const res = await updateUser(user.id, data)

      if (res.status) {
        // Update the SWR cache with the correct mutate syntax
        await mutate(undefined, {
          optimisticData: (currentData: any) => {
            if (currentData?.data) {
              const updatedData = currentData.data.map((item: User) =>
                item.id === user.id ? { ...item, ...data } : item
              )
              return {
                ...currentData,
                data: updatedData
              }
            }
            return currentData
          },
          rollbackOnError: true,
          populateCache: true,
          revalidate: true
        })

        toast.success(res?.message || 'User updated successfully')
        handleReset()
      }
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error?.response?.data?.message || 'Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    handleClose()
    methods.reset()
  }

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true)
        const roleData = await fetchRoles()
        setRoles(roleData)
      } catch (error) {
        console.error('Error loading roles:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (open) {
      loadRoles()
    }
  }, [open])

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
        <Typography variant='h5'>Edit User</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
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
              placeholder='Enter the password to update'
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
            <Button variant='contained' type='submit' disabled={isLoading}>
            {isLoading ? `${dictionary['content'].updating}...` : dictionary['content'].update}
            </Button>
            <Button variant='tonal' color='error' onClick={handleReset}>
            {dictionary['content'].cancel}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default EditUserDrawer
