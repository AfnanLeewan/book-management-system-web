import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthResponse, LoginDto, RegisterDto } from '../types/api';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const user = await authApi.getProfile();
          setState({
            user,
            isLoading: false,
            error: null,
          });
        } catch {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response: AuthResponse = await authApi.login(credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setState({
        user: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please try again.';
      setState({
        user: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  const register = async (userData: RegisterDto) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response: AuthResponse = await authApi.register(userData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setState({
        user: response.user,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
      setState({
        user: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setState({
      user: null,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
