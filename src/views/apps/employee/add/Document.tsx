'use client'
// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
// Style Imports
import { useFormContext } from 'react-hook-form'
import QTextField from '@/@core/components/mui/QTextField'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

const Document = () => {
  const { control } = useFormContext();
  const { dictionary } = useDictionary();
  
  return (
    <Card>
      <CardHeader title={dictionary['content'].document} />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid item xs={12} sm={12}>
            <QTextField
              name='documents.certificate'
              control={control}
              type='file'
              fullWidth
              label={dictionary['content'].certificate}
              accept="application/pdf,.pdf" 
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <QTextField
              name='documents.photo'
              control={control}
              type='file'
              fullWidth
              label={dictionary['content'].photo}
              accept="application/pdf,.pdf" 
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Document
