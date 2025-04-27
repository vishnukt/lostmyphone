import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Get token utility
const getToken = () => {
  try {
    const tokenData = JSON.parse(sessionStorage.getItem('token') || '{"value":"","expires":0}');
    if (tokenData.expires && Date.now() > tokenData.expires) {
      // Token has expired
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return null;
    }
    return tokenData.value;
  } catch (e) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token validity
  const validateSession = useCallback(() => {
    const token = getToken();
    const userData = sessionStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        // Invalid user data
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    validateSession();
    setLoading(false);
    
    // Set up interval to check token expiration
    const interval = setInterval(validateSession, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [validateSession]);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Attempting registration with data:', { ...userData, phoneNumber: userData.phoneNumber ? 'REDACTED' : undefined });
      
      const response = await authService.register(userData);
      
      // Debug token storage - only in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Register response:', response);
        const token = getToken();
        console.log('Token after registration:', token ? 'Token exists' : 'No token');
      }
      
      // Create a sanitized user object
      const secureUserData = { ...userData };
      delete secureUserData.password; // Don't store password
      
      // Set user in session storage
      sessionStorage.setItem('user', JSON.stringify(secureUserData));
      setUser(secureUserData);
      
      // Immediate validation to ensure everything is set
      validateSession();
      
      return response;
    } catch (err) {
      console.error('AuthContext: Registration error:', err);
      
      // Make sure we clear any partial auth data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setUser(null);
      
      // Set error message for UI
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      
      // Explicitly rethrow to be handled by the Register component
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Attempting login with data:', { ...userData, phoneNumber: userData.phoneNumber ? 'REDACTED' : undefined });
      
      const response = await authService.login(userData);
      
      // Debug token storage - only in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Login response in AuthContext:', response);
        const token = getToken();
        console.log('Token after login:', token ? 'Token exists' : 'No token');
      }
      
      // Create a sanitized user object
      const secureUserData = { ...userData };
      delete secureUserData.password; // Don't store password
      
      // Set user in session storage
      sessionStorage.setItem('user', JSON.stringify(secureUserData));
      setUser(secureUserData);
      
      // Immediate validation to ensure everything is set
      validateSession();
      
      return response;
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      
      // Make sure we clear any partial auth data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setUser(null);
      
      // Set error message for UI
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      
      // Explicitly rethrow to be handled by the Login component
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 