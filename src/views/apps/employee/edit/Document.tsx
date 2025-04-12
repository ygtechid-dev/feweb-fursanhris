'use client'
// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
// Icons - importing from general location instead of specific icons
// Components Imports
import QTextField from '@/@core/components/mui/QTextField'

import { useFormContext } from 'react-hook-form'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import { useState, useEffect } from 'react'
import { DownloadIcon, File, ImageIcon } from 'lucide-react'

interface DocumentFiles {
  certificate: string | File;
  photo: string | File;
}

const Document = () => {
  const { control, watch } = useFormContext()
  const { dictionary } = useDictionary()
  const watchedDocuments = watch('documents')
  
  // State to track existing files
  const [existingFiles, setExistingFiles] = useState<{
    certificate: string;
    photo: string;
  }>({
    certificate: '',
    photo: ''
  })

  // Update state when form values change
  useEffect(() => {
    if (watchedDocuments) {
      setExistingFiles({
        certificate: typeof watchedDocuments.certificate === 'string' ? watchedDocuments.certificate : '',
        photo: typeof watchedDocuments.photo === 'string' ? watchedDocuments.photo : ''
      })
    }
  }, [watchedDocuments])

  // Helper function to get file name from URL
  const getFileNameFromUrl = (url: string): string => {
    if (!url) return ''
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  // Helper function to determine file type icon
  const getFileIcon = (url: string) => {
    if (!url) return null
    
    if (url.toLowerCase().endsWith('.pdf')) {
      return <File color="primary" />
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => url.toLowerCase().endsWith(ext))) {
      return <ImageIcon color="primary" />
    } else {
      return <DownloadIcon color="primary" />
    }
  }

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
            />
            {existingFiles.certificate && (
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                {getFileIcon(existingFiles.certificate)}
                <Link 
                  href={existingFiles.certificate} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {getFileNameFromUrl(existingFiles.certificate)}
                </Link>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <QTextField
              name='documents.photo'
              control={control}
              type='file'
              fullWidth
              label={dictionary['content'].photo}
            />
            {existingFiles.photo && (
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                {getFileIcon(existingFiles.photo)}
                <Link 
                  href={existingFiles.photo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {getFileNameFromUrl(existingFiles.photo)}
                </Link>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Document
