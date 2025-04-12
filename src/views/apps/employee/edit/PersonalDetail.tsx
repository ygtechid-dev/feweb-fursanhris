'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomTextField from '@core/components/mui/TextField'
import { MenuItem } from '@mui/material'
import { useFormContext, UseFormReturn } from 'react-hook-form'
import { EmployeeFormData } from '@/types/apps/userTypes'
import { useEffect } from 'react'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

const PersonalDetail = () => {
  const { register, formState: { errors }, control } = useFormContext();
  const {dictionary} = useDictionary();
  
return (
  <Card>
    <CardHeader title='Personal Detail' />
    <CardContent>
      <Grid container spacing={6} className='mbe-6'>
        <Grid item xs={12} sm={6}>
           <QTextField
                name='name'
                control={control}
                fullWidth
                required
                placeholder='Enter employee name'
                rules={{ 
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  }
                }}
                label={dictionary['content'].name} 
              />
        </Grid>
        <Grid item xs={12} sm={6}>
              <QTextField
                name='phone'
                control={control}
                fullWidth
                required
                placeholder='Enter phone'
                rules={{ 
                  pattern: {
                    value: /^[0-9]{10,13}$/,
                    message: 'Please enter a valid phone number'
                  }
                }}
                label={dictionary['content'].phone} 
              />
        </Grid>
        <Grid item xs={12} sm={6}>
               <QReactDatepicker
                name='dob'
                control={control}
                label={dictionary['content'].dateOfBirth} 
                required
              />
        </Grid>
        <Grid item xs={12} sm={6}>
              <QTextField
                name='gender'
                control={control}
                fullWidth
                required
                placeholder='Enter gender'
                label={dictionary['content'].gender} 
                select
              >
                <MenuItem value="">Select gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </QTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <QTextField
                name='email'
                control={control}
                fullWidth
                required
                placeholder='Enter email'
                type='email' 
                rules={{ 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                }}
                label={dictionary['content'].email} 
              />
        </Grid>
        <Grid item xs={12} sm={6}>
          <QTextField
                name='password'
                control={control}
                fullWidth
                placeholder='Enter password'
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
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <QTextField
              name='address'
              control={control}
              fullWidth
              required
              placeholder='Enter address'
              multiline
              rows={4}
              rules={{ 
                minLength: {
                  value: 10,
                  message: 'Please enter a complete address'
                }
              }}
              label={dictionary['content'].address} 
            />
      </Grid>
    </CardContent>
  </Card>
)
}

export default PersonalDetail
