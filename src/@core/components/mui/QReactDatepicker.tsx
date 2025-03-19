'use client'
import { Controller, Control, FieldValues, Path, ValidationRule } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

interface QReactDatepickerProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  control?: Control<TFieldValues>
  label: string
  rules?: ValidationRule<any>
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
  onChangeCustom?: (date:Date|null) => void
}

function QReactDatepicker<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  rules,
  required,
  disabled,
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
  onChangeCustom,
  ...props
}: QReactDatepickerProps<TFieldValues>) {
  const combinedRules = {
    ...rules,
    ...(required && { required: 'This field is required' })
  }
  
  const labelWithRequiredIndicator = required
    ? `${label} *`
    : label
    
  // Adjust placeholder text based on whether it's time only or date
  const adjustedPlaceholderText = showTimeSelectOnly 
    ? 'HH:MM' 
    : placeholderText
    
  // Adjust date format based on whether it's time only or date
  const adjustedDateFormat = showTimeSelectOnly 
    ? timeFormat 
    : dateFormat
  
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={combinedRules}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AppReactDatepicker
            selected={value}
            onChange={(date, event) => {
              onChange(date, event)

              if (onChangeCustom) {
                onChangeCustom(date)
              }
            }}
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
            customInput={
              <CustomTextField
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                label={labelWithRequiredIndicator}
                disabled={disabled}
                {...(error && { error: true, helperText: error.message })}
                {...props}
              />
            }
          />
        )}
      />
    )
  }
  
  return (
    <AppReactDatepicker
      name={name}
      showYearDropdown={showYearDropdown}
      showMonthDropdown={showMonthDropdown}
      placeholderText={adjustedPlaceholderText}
      showTimeSelect={showTimeSelect}
      showTimeSelectOnly={showTimeSelectOnly}
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
      dateFormat={adjustedDateFormat}
      customInput={
        <CustomTextField
          name={name}
          fullWidth={fullWidth}
          label={label}
          disabled={disabled}
          {...props}
        />
      }
    />
  )
}

export default QReactDatepicker
