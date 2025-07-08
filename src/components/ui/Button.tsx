import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled(MuiButton)(() => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '0.375rem',
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}));

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}) => {
  const getMuiVariant = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained';
      case 'outline':
        return 'outlined';
      case 'danger':
        return 'contained';
      default:
        return 'contained';
    }
  };

  const getMuiColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'primary';
      case 'danger':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getMuiSize = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'medium';
      case 'lg':
        return 'large';
      default:
        return 'medium';
    }
  };

  return (
    <StyledButton
      variant={getMuiVariant()}
      color={getMuiColor()}
      size={getMuiSize()}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
