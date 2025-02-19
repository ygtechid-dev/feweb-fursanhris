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
  ...props
}: QReactDatepickerProps<TFieldValues>) {
  const combinedRules = {
    ...rules,
    ...(required && { required: 'This field is required' })
  }

  const labelWithRequiredIndicator = required 
  ? `${label} *` 
  : label

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={combinedRules}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AppReactDatepicker
            selected={value}
            onChange={onChange}
            showYearDropdown={showYearDropdown}
            showMonthDropdown={showMonthDropdown}
            placeholderText={placeholderText}
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
      placeholderText={placeholderText}
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
