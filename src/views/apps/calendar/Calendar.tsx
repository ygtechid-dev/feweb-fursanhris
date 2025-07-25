// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party imports
import type { Dispatch } from '@reduxjs/toolkit'
import 'bootstrap-icons/font/bootstrap-icons.css'

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions } from '@fullcalendar/core'

// Type Imports
import type { AddEventType, CalendarColors, CalendarType } from '@/types/apps/calendarTypes'

// Slice Imports
import { filterEvents, selectedEvent, updateEvent } from '@/redux-store/slices/calendar'

type CalenderProps = {
  calendarStore: CalendarType
  calendarApi: any
  setCalendarApi: (val: any) => void
  calendarsColor: CalendarColors
  dispatch: Dispatch
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  onEventCreate?: (event: any) => void
  onEventUpdate?: (event: any) => void
  onEventDelete?: (eventId: string) => void
}

const blankEvent: AddEventType = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    description: ''
  }
}

const Calendar = (props: CalenderProps) => {
  // Props
  const {
    calendarStore,
    calendarApi,
    setCalendarApi,
    calendarsColor,
    dispatch,
    handleAddEventSidebarToggle,
    handleLeftSidebarToggle,
    onEventCreate,
    onEventUpdate,
    onEventDelete
  } = props

  // Refs
  const calendarRef = useRef()

  // Hooks
  const theme = useTheme()

  useEffect(() => {
    if (calendarApi === null) {
      // @ts-ignore
      setCalendarApi(calendarRef.current?.getApi())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // calendarOptions(Props)
  const calendarOptions: CalendarOptions = {
    events: calendarStore.events,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
      }
    },

    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }: any) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar] || 'primary'

      return [
        // Background Color
        `event-bg-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent, jsEvent }: any) {
      jsEvent.preventDefault()

      dispatch(selectedEvent(clickedEvent))
      handleAddEventSidebarToggle()

      if (clickedEvent.url) {
        // Open the URL in a new tab
        window.open(clickedEvent.url, '_blank')
      }
    },

    customButtons: {
      sidebarToggle: {
        icon: 'tabler tabler-menu-2',
        click() {
          handleLeftSidebarToggle()
        }
      }
    },

    dateClick(info: any) {
      const ev = {
        ...blankEvent,
        start: info.date,
        end: info.date,
        allDay: true,
        extendedProps: {
          ...blankEvent.extendedProps,
          calendar: 'todo',
          isTask: true
        }
      }
      
      dispatch(selectedEvent(ev))
      handleAddEventSidebarToggle()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }: any) {
      // Call the custom event update handler if provided
      if (onEventUpdate) {
        onEventUpdate(droppedEvent)
      } else {
        dispatch(updateEvent(droppedEvent))
        dispatch(filterEvents())
      }
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }: any) {
      // Call the custom event update handler if provided
      if (onEventUpdate) {
        onEventUpdate(resizedEvent)
      } else {
        dispatch(updateEvent(resizedEvent))
        dispatch(filterEvents())
      }
    },

    // @ts-ignore
    ref: calendarRef,

    direction: theme.direction
  }

  return <FullCalendar {...calendarOptions} />
}

export default Calendar
