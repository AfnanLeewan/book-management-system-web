import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Button as MuiButton
} from '@mui/material';
import { MenuBook, Home, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Books', href: '/books', icon: MenuBook },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <MenuBook sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                BookManager
              </Typography>
            </Link>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 6 }}>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <MuiButton
                    key={item.name}
                    component={Link}
                    to={item.href}
                    startIcon={<Icon />}
                    sx={{
                      mr: 4,
                      py: 2,
                      borderBottom: 2,
                      borderColor: location.pathname === item.href ? 'primary.main' : 'transparent',
                      borderRadius: 0,
                      color: location.pathname === item.href ? 'text.primary' : 'text.secondary',
                      '&:hover': {
                        bgcolor: 'transparent',
                        borderColor: 'grey.300',
                        color: 'text.primary'
                      }
                    }}
                  >
                    {item.name}
                  </MuiButton>
                );
              })}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Person sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              startIcon={<Logout />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>

        {/* Mobile menu */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ py: 1 }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <MuiButton
                  key={item.name}
                  component={Link}
                  to={item.href}
                  fullWidth
                  startIcon={<Icon />}
                  sx={{
                    justifyContent: 'flex-start',
                    pl: 3,
                    py: 2,
                    borderLeft: 4,
                    borderRadius: 0,
                    borderColor: location.pathname === item.href ? 'primary.main' : 'transparent',
                    bgcolor: location.pathname === item.href ? 'primary.50' : 'transparent',
                    color: location.pathname === item.href ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'grey.50',
                      borderColor: 'grey.300',
                      color: 'text.primary'
                    }
                  }}
                >
                  {item.name}
                </MuiButton>
              );
            })}
          </Box>
        </Box>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ px: { xs: 2, sm: 0 }, py: 3 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
