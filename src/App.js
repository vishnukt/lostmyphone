import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';

function App() {
  return (
    <HelmetProvider>
      <ChakraProvider>
        <AuthProvider>
          <Router basename={process.env.PUBLIC_URL}>
            <Box display="flex" flexDirection="column" minH="100vh">
              <Navbar />
              <Box flex="1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/contacts" element={<Contacts />} />
                  </Route>
                  
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </HelmetProvider>
  );
}

export default App;
