import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { User } from '@/types/apps/userTypes';

interface SimpleMemberSelectorProps {
  label?: string;
  placeholder?: string;
  employees: User[];
  required?: boolean;
  value: User[];
  disabled?: boolean;
  onChange: (value: User[]) => void;
  error?: boolean;
  helperText?: string;
}

const SimpleMemberSelector: React.FC<SimpleMemberSelectorProps> = ({
  label = 'Assign Members',
  placeholder = 'Select team members',
  employees,
  required = false,
  value = [],
  disabled = false,
  onChange,
  error = false,
  helperText = '',
}) => {
  return (
    <Autocomplete
      multiple
      id="member-selector"
      options={employees}
      getOptionLabel={(option) => `${option.name || `${option.first_name} ${option.last_name}`}`}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          fullWidth
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            <div className="flex items-center gap-3">
              <Avatar
                src={option.avatar || '/images/avatars/1.png'}
                alt={option.name || `${option.first_name} ${option.last_name}`}
                sx={{ width: 24, height: 24 }}
              />
              <div>
                <Typography variant="body2">
                  {option.name || `${option.first_name} ${option.last_name}`}
                </Typography>
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
          return (
            <Chip
              avatar={
                <Avatar 
                  src={option.avatar || '/images/avatars/1.png'} 
                  alt={option.name || `${option.first_name} ${option.last_name}`} 
                />
              }
              label={option.name || `${option.first_name} ${option.last_name}`}
              {...tagProps}
              size="small"
            />
          );
        })
      }
    />
  );
};

export default SimpleMemberSelector;
