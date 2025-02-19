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

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('tabler-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('tabler-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('tabler-align-justified', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

const BankAccount =  () => {
  const { register, formState: { errors }, control } = useFormContext();
  const {dictionary} = useDictionary();
  
  return (
    <Card>
      <CardHeader title={dictionary['content'].bankAccountDetail} />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid item xs={12} sm={6}>
            <QTextField
                  name='account_holder_name'
                  control={control}
                  placeholder='Enter account holder name'
                  fullWidth
                  label={dictionary['content'].accountHolderName}
                />
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
                  name='account_number'
                  control={control}
                  placeholder='Enter account number'
                  type='number'
                  fullWidth
                  label={dictionary['content'].accountHolderName}
                />
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
                  name='bank_name'
                  control={control}
                  placeholder='Enter bank name'
                  fullWidth
                  label={dictionary['content'].bankName} 
                />
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
                  name='bank_identifier_code'
                  control={control}
                  placeholder='Enter identifier code'
                  fullWidth
                  label={dictionary['content'].bankIdentifierCode}
                />
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
                  name='branch_location'
                  control={control}
                  placeholder='Enter branch location'
                  fullWidth
                  label={dictionary['content'].branchLocation}
                />
          </Grid>
         
        </Grid>
     
      </CardContent>
    </Card>
  )
}

export default BankAccount
