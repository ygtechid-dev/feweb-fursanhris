'use client'
import React, { useState, forwardRef } from 'react'
// import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import TextField from '@mui/material/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'


interface QSimpleDatePickerProps {
  name: string
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
  required?: boolean
  disabled?: boolean
  fullWidth?: boolean
  placeholderText?: string
  showYearDropdown?: boolean
  showMonthDropdown?: boolean
  showTimeSelect?: boolean
  showTimeSelectOnly?: boolean
  timeFormat?: string
  timeIntervals?: number
  dateFormat?: string
  showMonthYearPicker?: boolean
  error?: boolean
  helperText?: string
}

const QSimpleDatePicker = ({
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  fullWidth = true,
  placeholderText = 'MM/DD/YYYY',
  showYearDropdown = true,
  showMonthDropdown = true,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeFormat = "HH:mm",
  timeIntervals = 15,
  dateFormat = "MM/dd/yyyy",
  showMonthYearPicker = false,
  error = false,
  helperText = '',
  ...props
}: QSimpleDatePickerProps) => {
  // Adjust placeholder text based on whether it's time only or date
  const adjustedPlaceholderText = showTimeSelectOnly ? 'HH:MM' : placeholderText
  
  // Adjust date format based on whether it's time only or date
  const adjustedDateFormat = showTimeSelectOnly ? timeFormat : dateFormat
  
  // Add required indicator to the label if needed
  const labelWithRequiredIndicator = required ? `${label} *` : label
  
  // Custom input component
  const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => (
    <TextField
      name={name}
      fullWidth={fullWidth}
      label={labelWithRequiredIndicator}
      onClick={onClick}
      onChange={onChange}
      value={value || ''}
      disabled={disabled}
      inputRef={ref}
      error={error}
      helperText={helperText}
      {...props}
    />
  ))
  
  CustomInput.displayName = 'DatePickerInput'

  return (
    <AppReactDatepicker
      selected={value}
      onChange={onChange}
      showYearDropdown={showYearDropdown}
      showMonthDropdown={showMonthDropdown}
      placeholderText={adjustedPlaceholderText}
      showTimeSelect={showTimeSelect}
      showTimeSelectOnly={showTimeSelectOnly}
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
      dateFormat={adjustedDateFormat}
      showMonthYearPicker={showMonthYearPicker}
      disabled={disabled}
      customInput={<CustomInput />}
    />
  )
}

export default QSimpleDatePicker
