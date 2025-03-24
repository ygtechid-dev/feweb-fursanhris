// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'

// Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Type Imports
import type { Dispatch } from '@reduxjs/toolkit'
import type { CalendarType, CalendarColors } from '@/types/apps/calendarTypes'

// Component Imports

// Slice Imports
import { addEvent, deleteEvent, updateEvent } from '@/redux-store/slices/calendar'
import QSimpleDatePicker from '@/@core/components/mui/QSimpleDatePicker'

interface AddEventSidebarProps {
  dispatch: Dispatch
  calendarApi: any
  calendarStore: CalendarType
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
  onEventCreate?: (event: any) => void
  onEventUpdate?: (event: any) => void
  onEventDelete?: (eventId: string) => void
  calendarsColor: CalendarColors
}


const defaultValues = {
  title: '',
  calendar: '',
  guests: [],
  description: '',
  start: new Date(),
  end: new Date(),
  priority: 'medium'
}

const AddEventSidebar = (props: AddEventSidebarProps) => {
  // Props
  const {
    dispatch,
    calendarApi,
    calendarStore,
    addEventSidebarOpen,
    handleAddEventSidebarToggle,
    onEventCreate,
    onEventUpdate,
    onEventDelete,
    calendarsColor
  } = props

  // States
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  // Form hooks
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  // Effects
  useEffect(() => {
    if (calendarStore.selectedEvent !== null) {
      const event = calendarStore.selectedEvent

      setValue('title', event.title || '')
      setValue('calendar', event.extendedProps?.calendar || 'Todo')
      setValue('description', event.extendedProps?.description || '')
      setValue('priority', event.extendedProps?.priority || 'medium')
      setValue('guests', event.extendedProps?.guests || [])

      // Set start and end dates
      let calculatedStartDate: Date | null = null
      let calculatedEndDate: Date | null = null

      if (event._instance?.range) {
        calculatedStartDate = event._instance.range.start
        calculatedEndDate = event._instance.range.end
      } else {
        if (event.start) calculatedStartDate = new Date(event.start as string)
        if (event.end) calculatedEndDate = new Date(event.end as string)
      }

      if (calculatedStartDate !== null) setStartDate(calculatedStartDate)
      if (calculatedEndDate !== null) setEndDate(calculatedEndDate)

      setValue('start', calculatedStartDate || new Date())
      setValue('end', calculatedEndDate || new Date())
    } else {
      reset()
    }
  }, [calendarStore.selectedEvent, reset, setValue])

  const onSubmit = (data: any) => {
    const modifiedEvent = {
      id: calendarStore.selectedEvent?.id,
      title: data.title,
      start: data.start || new Date(),
      end: data.end || new Date(),
      allDay: true,
      extendedProps: {
        calendar: data.calendar,
        description: data.description,
        priority: data.priority,
        guests: data.guests,
        isTask: true
      }
    }

    if (calendarStore.selectedEvent?.id) {
      // Update existing event
      if (onEventUpdate) {
        onEventUpdate(modifiedEvent)
      } else {
        // Default Redux action
        dispatch(updateEvent(modifiedEvent))
      }
    } else {
      // Create new event
      if (onEventCreate) {
        onEventCreate(modifiedEvent)
      } else {
        // Default Redux action
        dispatch(addEvent(modifiedEvent))
      }
    }

    // Reset form
    reset()
    handleAddEventSidebarToggle()
  }

  const handleDeleteEvent = () => {
    if (calendarStore.selectedEvent?.id && onEventDelete) {
      onEventDelete(calendarStore.selectedEvent.id as string)
    } else if (calendarStore.selectedEvent?.id) {
      dispatch(deleteEvent(calendarStore.selectedEvent.id as string))
    }
    
    // Reset form
    reset()
    handleAddEventSidebarToggle()
  }

  const handleSidebarClose = () => {
    reset()
    clearErrors()
    handleAddEventSidebarToggle()
    dispatch({ type: 'calendar/selectedEvent', payload: null })
  }

  return (
    <Drawer
      open={addEventSidebarOpen}
      anchor='right'
      variant='temporary'
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Box
        sx={{
          height: '100%',
          p: theme => theme.spacing(6),
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h5'>
            {calendarStore.selectedEvent?.id ? 'Update Task' : 'Add Task'}
          </Typography>
          <IconButton onClick={handleSidebarClose}>
            <i className='tabler tabler-x' />
          </IconButton>
        </Box>

        <Box sx={{ mt: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='Title'
                  {...field}
                  sx={{ mb: 4 }}
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name='calendar'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 4 }} error={Boolean(errors.calendar)}>
                  <InputLabel id='calendar-label'>Status</InputLabel>
                  <Select {...field} label='Status' labelId='calendar-label'>
                    <MenuItem value='todo'>Todo</MenuItem>
                    <MenuItem value='in_progress'>In Progress</MenuItem>
                    <MenuItem value='in_review'>In Review</MenuItem>
                    <MenuItem value='done'>Done</MenuItem>
                  </Select>
                  {errors.calendar && <FormHelperText>{errors.calendar.message}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name='priority'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel id='priority-label'>Priority</InputLabel>
                  <Select {...field} label='Priority' labelId='priority-label'>
                    <MenuItem value='low'>Low</MenuItem>
                    <MenuItem value='medium'>Medium</MenuItem>
                    <MenuItem value='high'>High</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Box sx={{ mb: 4 }}>
              <Controller
                name='start'
                control={control}
                render={({ field }) => (
                  <QSimpleDatePicker
                    name='start-date'
                    label='Due Date'
                    value={startDate}
                    onChange={(date: Date | null) => {
                      setStartDate(date);
                      setEndDate(date);
                      setValue('start', date || new Date());
                      setValue('end', date || new Date());
                    }}
                    error={Boolean(errors.start)}
                    helperText={errors.start?.message?.toString()}
                    dateFormat="MM/dd/yyyy"
                    showYearDropdown
                    showMonthDropdown
                    fullWidth
                  />
                )}
              />
            </Box>

            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  rows={4}
                  multiline
                  fullWidth
                  label='Description'
                  {...field}
                  sx={{ mb: 6 }}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant='contained' type='submit'>
                {calendarStore.selectedEvent?.id ? 'Update' : 'Add'}
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleSidebarClose}>
                Cancel
              </Button>
              {calendarStore.selectedEvent?.id && (
                <Button variant='outlined' color='error' onClick={handleDeleteEvent}>
                  Delete
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar
