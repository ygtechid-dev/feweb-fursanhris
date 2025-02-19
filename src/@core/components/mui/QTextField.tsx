'use client'
import { Controller, Control, FieldValues, Path, ValidationRule } from 'react-hook-form'
import { TextFieldProps } from '@mui/material/TextField'
import CustomTextField from '@core/components/mui/TextField'
import { InputProps } from '@mui/material/Input'
import { MenuItem } from '@mui/material'

interface QTextFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  control?: Control<TFieldValues>
  fullWidth?: boolean
  label: string
  rules?: ValidationRule<any>
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  InputProps?: InputProps
  select?: boolean
  children?: React.ReactNode
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'file'
  multiline?: boolean
  rows?:number
  placeholder?: string
}

function QTextField<TFieldValues extends FieldValues>({
  name,
  control,
  fullWidth = true,
  required,
  rules,
  readonly,
  disabled,
  InputProps,
  select,
  multiline = false,
  rows = 4,
  children,
  type = 'text',
  label,
  placeholder,
  ...props
}: QTextFieldProps<TFieldValues>) {
  const defaultRules = {
    email: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address'
      }
    },
    password: {
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters'
      }
    }
  }

  const combinedRules = {
    ...rules,
    ...(required && { required: 'This field is required' }),
    ...(type === 'email' && defaultRules.email),
    ...(type === 'password' && defaultRules.password)
  }

  const readonlyInputProps = {
    ...InputProps,
    readOnly: readonly
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
        render={({ field, fieldState: { error } }) => (
          <CustomTextField
            {...field}
            {...props}
            fullWidth={fullWidth}
            error={!!error}
            helperText={error?.message}
            InputProps={readonlyInputProps}
            disabled={disabled}
            select={select}
            type={type}
            multiline={multiline}
            rows={rows}
            placeholder={placeholder}
            label={labelWithRequiredIndicator}
          >
            {children}
          </CustomTextField>
        )}
      />
    )
  }

  return (
    <CustomTextField
      name={name}
      {...props}
      fullWidth={fullWidth}
      InputProps={readonlyInputProps}
      disabled={disabled}
      select={select}
      type={type}
    >
      {children}
    </CustomTextField>
  )
}

export default QTextField
