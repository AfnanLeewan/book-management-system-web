import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant' | 'error'> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        fullWidth
        error={!!error}
        helperText={error || helperText}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem',
          },
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
