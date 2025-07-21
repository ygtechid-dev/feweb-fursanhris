'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import '@/libs/styles/tiptapEditor.css'
import { MenuItem } from '@mui/material'
import { useFormContext, UseFormReturn } from 'react-hook-form'
import { EmployeeFormData } from '@/types/apps/userTypes'
import QTextField from '@/@core/components/mui/QTextField'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'


const Family =  () => {
 const { register, formState: { errors }, control } = useFormContext();
  const {dictionary} = useDictionary();

  return (
    <Card>
      <CardHeader title={dictionary['content'].family}/>
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid item xs={12} sm={6}>
            <QTextField
                  name='family_name'
                  control={control}
                  placeholder='Enter family name'
                  fullWidth
                  // label={dictionary['content'].accountHolderName}
                  label={'Family name'}
                />
          </Grid>
             <Grid item xs={12} sm={6}>
              <QTextField
                    name='family_phone'
                    control={control}
                    placeholder='Enter family phone'
                    fullWidth
                    // label={dictionary['content'].bankName}
                    label={'Family phone'}
                  />
            </Grid>
          <Grid item xs={12}>
            <QTextField
                  name='family_address'
                      multiline
                rows={4}
                  control={control}
                  placeholder='Enter family address number'
                  fullWidth
                  // label={dictionary['content'].accountNumber}
                  label={'Family address'}
                />
          </Grid>
       
        </Grid>
     
      </CardContent>
    </Card>
  )
}

export default Family
