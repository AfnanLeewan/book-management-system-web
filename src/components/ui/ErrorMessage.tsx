import React from 'react';
import { Alert, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose,
  severity = 'error'
}) => {
  return (
    <Alert 
      severity={severity}
      action={
        onClose && (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        )
      }
      sx={{ borderRadius: '0.375rem' }}
    >
      {message}
    </Alert>
  );
};

export default ErrorMessage;
