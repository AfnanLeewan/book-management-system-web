import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Indigo-600
      light: '#3b82f6', // Indigo-500
      dark: '#1d4ed8', // Indigo-700
    },
    secondary: {
      main: '#6b7280', // Gray-500
      light: '#9ca3af', // Gray-400
      dark: '#4b5563', // Gray-600
    },
    background: {
      default: '#f9fafb', // Gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Gray-900
      secondary: '#6b7280', // Gray-500
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "ui-sans-serif", "system-ui", sans-serif',
    h1: {
      fontSize: '2.25rem', // text-4xl
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.875rem', // text-3xl
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem', // text-xl
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem', // text-lg
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem', // text-base
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
          },
        },
      },
    },
  },
});
