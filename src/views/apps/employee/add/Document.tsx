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
// import { useEditor, EditorContent } from '@tiptap/react'
// import { StarterKit } from '@tiptap/starter-kit'
// import { Underline } from '@tiptap/extension-underline'
// import { Placeholder } from '@tiptap/extension-placeholder'
// import { TextAlign } from '@tiptap/extension-text-align'
// import type { Editor } from '@tiptap/core'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
// import '@/libs/styles/tiptapEditor.css'
import { MenuItem } from '@mui/material'
import { useFormContext, UseFormReturn } from 'react-hook-form'
import { EmployeeFormData } from '@/types/apps/userTypes'
import QTextField from '@/@core/components/mui/QTextField'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'



const Document =  () => {
  const { register, formState: { errors }, control } = useFormContext();
  const {dictionary} = useDictionary();

  return (
    <Card>
      <CardHeader title={dictionary['content'].document} />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid item xs={12} sm={12}>
             <QTextField
                  name='document.certificate'
                  control={control}
                  type='file' 
                  fullWidth
                  label={dictionary['content'].certificate}
                />
          </Grid>
          <Grid item xs={12} sm={12}>
             <QTextField
                  name='document.photo'
                  control={control}
                  type='file' 
                  fullWidth
                  label={dictionary['content'].photo}
                />
          </Grid>
        </Grid>
     
      </CardContent>
    </Card>
  )
}

export default Document
