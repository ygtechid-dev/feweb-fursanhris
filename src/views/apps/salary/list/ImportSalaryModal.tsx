import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Paper
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import { exportEmployeeSalary } from '@/services/employeeService'

interface ImportSalaryModalProps {
  open: boolean
  onClose: () => void
  onImport: (file: File) => Promise<void>
}

const StyledDropzone = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '&.active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  }
}))

const ImportSalaryModal: React.FC<ImportSalaryModalProps> = ({
  open,
  onClose,
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
        setUploadError(null)
      }
    },
    onDropRejected: () => {
      setUploadError('File format tidak didukung. Silakan upload file Excel (.xlsx, .xls) atau CSV.')
    }
  })

  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const handleDownloadTemplate = async () => {
    setIsDownloading(true)
    setDownloadError(null)

    try {
      // Make API call to get download URL
      const response = await exportEmployeeSalary()

      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Backend should return something like: { downloadUrl: "https://api.example.com/files/template.csv" }
      if (!response.download_url) {
        throw new Error('Download URL not provided by server')
      }

      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = response.download_url
      link.setAttribute('download', response.filename || 'salary_component_template.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Optional: Show success message
      console.log('Template downloaded successfully')

    } catch (error) {
      console.error('Error downloading template:', error)
      setDownloadError(
        error instanceof Error 
          ? error.message 
          : 'Gagal mendownload template. Silakan coba lagi.'
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setUploadError('Silakan pilih file untuk diimport.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      await onImport(selectedFile)
      handleClose()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Terjadi kesalahan saat import data.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploadError(null)
    setIsUploading(false)
    onClose()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadError(null)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: 400 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <i className="tabler-upload" style={{ fontSize: '1.25rem' }} />
          Import Salary Component
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Download Template Section */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Download Template
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Download template untuk memudahkan pengisian data salary component
          </Typography>
          <Button
            variant="outlined"
            startIcon={isDownloading ? <i className="tabler-loader-2 animate-spin" /> : <i className="tabler-download" />}
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
            fullWidth
          >
            {isDownloading ? 'Downloading...' : 'Download Template'}
          </Button>

          {downloadError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {downloadError}
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Upload File Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Upload File
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Upload file Excel (.xlsx, .xls) atau CSV yang berisi data salary component
          </Typography>

          {!selectedFile ? (
            <StyledDropzone
              {...getRootProps()}
              className={isDragActive ? 'active' : ''}
              elevation={isDragActive ? 2 : 0}
            >
              <input {...getInputProps()} />
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <i 
                  className="tabler-cloud-upload" 
                  style={{ fontSize: '3rem', color: '#666' }}
                />
                <Typography variant="h6">
                  {isDragActive ? 'Drop file di sini...' : 'Drag & drop file atau klik untuk pilih'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Format yang didukung: .xlsx, .xls, .csv
                </Typography>
                <Button variant="contained" size="small">
                  Pilih File
                </Button>
              </Box>
            </StyledDropzone>
          ) : (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <i className="tabler-file-text" style={{ fontSize: '1.5rem', color: '#4caf50' }} />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={removeFile} size="small" color="error">
                  <i className="tabler-x" />
                </IconButton>
              </Box>
            </Paper>
          )}

          {uploadError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadError}
            </Alert>
          )}

          {isUploading && (
            <Box mt={2}>
              <Typography variant="body2" mb={1}>
                Mengimport data...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </Box>

        {/* Instructions */}
        {/* <Box mt={3}>
          <Alert severity="info">
            <Typography variant="body2" component="div">
              <strong>Petunjuk:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Download template terlebih dahulu untuk melihat format yang benar</li>
                <li>Pastikan data sudah sesuai dengan kolom yang tersedia</li>
                <li>File maksimal 5MB</li>
                <li>Data yang duplikat akan diabaikan</li>
              </ul>
            </Typography>
          </Alert>
        </Box> */}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={isUploading}
          color="inherit"
        >
          Batal
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!selectedFile || isUploading}
          startIcon={isUploading ? null : <i className="tabler-upload" />}
        >
          {isUploading ? 'Importing...' : 'Import Data'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportSalaryModal
