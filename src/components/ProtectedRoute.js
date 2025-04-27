import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Get token expiry from sessionStorage
  const getTokenExpiry = () => {
    try {
      const tokenData = JSON.parse(sessionStorage.getItem('token') || '{"expires":0}');
      return tokenData.expires;
    } catch (e) {
      return 0;
    }
  };
  
  // Check if token is expired
  const isTokenExpired = () => {
    const expiry = getTokenExpiry();
    return expiry && Date.now() > expiry;
  };
  
  useEffect(() => {
    // Debug auth state - only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Protected route state:', { isAuthenticated, loading });
      console.log('Token expired:', isTokenExpired());
    }
    
    // If token is expired, redirect to login
    if (!loading && isTokenExpired()) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Verifying authentication...</Text>
        </VStack>
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || isTokenExpired()) {
    // Debug redirect - only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Redirecting to login page. Authentication failed.');
    }
    return <Navigate to="/login" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 