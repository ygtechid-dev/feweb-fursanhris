'use client'
import { Controller, Control, FieldValues, Path, ValidationRule } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { InputProps } from '@mui/material/Input'
import { Box, Typography } from '@mui/material'

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
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'file' | 'date'
  multiline?: boolean
  rows?: number
  placeholder?: string
  onChange?: (value: any) => void
  accept?: string // For file input restrictions
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
  onChange,
  accept,
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
        render={({ field, fieldState: { error } }) => {
          // Special handling for file input
          if (type === 'file') {
            // Get file name from field.value if it exists
            const isFile = (value: unknown): value is File => value instanceof File;
            const currentFileName = isFile(field.value) ? field.value.name : '';
            
            return (
              <>
                <CustomTextField
                  {...props}
                  fullWidth={fullWidth}
                  error={!!error}
                  helperText={error?.message}
                  InputProps={readonlyInputProps}
                  disabled={disabled}
                  type={type}
                  label={labelWithRequiredIndicator}
                  inputProps={{ accept }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // Get the file from the event
                    const file = e.target.files?.[0] || null;
                    
                    // Update the form value with the actual File object
                    field.onChange(file);
                    
                    // Call custom onChange if provided
                    if (onChange) onChange(file);
                  }}
                  // We need to set value to empty string for file inputs
                  // to avoid React controlled/uncontrolled warning
                  value=""
                />
                {currentFileName && (
                  <Box mt={1}>
                    <Typography variant="body2" color="primary">
                      Selected file: {currentFileName}
                    </Typography>
                  </Box>
                )}
              </>
            );
          }

          // For other input types (non-file)
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);
            if (onChange) {
              const value = e.target.value;
              onChange(value);
            }
          };

          return (
            <CustomTextField
              {...field}
              {...props}
              onChange={handleChange}
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
          );
        }}
      />
    );
  }

  // For uncontrolled use case (no control provided)
  return (
    <CustomTextField
      name={name}
      {...props}
      fullWidth={fullWidth}
      InputProps={readonlyInputProps}
      disabled={disabled}
      select={select}
      type={type}
      inputProps={{
        ...(type === 'file' && { accept })
      }}
    >
      {children}
    </CustomTextField>
  );
}

export default QTextField
