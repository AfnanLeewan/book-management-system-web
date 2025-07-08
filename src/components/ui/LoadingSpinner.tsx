import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import type { CircularProgressProps } from '@mui/material';

interface LoadingSpinnerProps extends Omit<CircularProgressProps, 'size'> {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  ...props
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 32;
      case 'lg':
        return 48;
      default:
        return 32;
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress 
        size={getSize()} 
        color="primary"
        {...props}
      />
    </Box>
  );
};

export default LoadingSpinner;
