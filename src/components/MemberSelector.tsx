import React from 'react';
import { Controller, Control } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CustomTextField from '@/@core/components/mui/TextField';
import { User } from '@/types/apps/userTypes';

// Define the Employee interface
export interface Employee {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
}

interface MemberSelectorProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  employees: User[];
  required?: boolean;
  defaultValue?: User[];
  disabled?: boolean;
  onChange?: (value: User[]) => void;
}

const MemberSelector: React.FC<MemberSelectorProps> = ({
  name,
  control,
  label = 'Assign Members',
  placeholder = 'Select team members',
  employees,
  required = false,
  defaultValue = [],
  disabled = false,
  onChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: required ? 'This field is required' : false }}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete
            multiple
            id={`${name}-select`}
            options={employees}
            getOptionLabel={(option) => `${option.name}`}
            value={field.value as unknown as User[] || []}
            onChange={(_, newValue) => {
              field.onChange(newValue);
              if (onChange) onChange(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={disabled}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label={label}
                placeholder={placeholder}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required={required}
              />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={option.avatar || '/images/avatars/1.png'}
                      alt={`${option.name}`}
                      sx={{ width: 24, height: 24 }}
                    />
                    <div>
                      <Typography variant="body2">{`${option.name}`}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </div>
                  </div>
                </li>
              );
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const tagProps = getTagProps({ index });
                // Fix: Don't destructure the key property
                return (
                  <Chip
                    avatar={<Avatar src={option.avatar || '/images/avatars/1.png'} alt={`${option.name}`} />}
                    label={`${option.name}`}
                    {...tagProps}
                    size="small"
                  />
                );
              })
            }
          />
        );
      }}
    />
  );
};

export default MemberSelector;
