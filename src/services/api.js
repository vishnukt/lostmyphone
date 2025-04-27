import axios from 'axios';
import { mockAuthService, mockContactService, debugMockApi } from './mockApi';

// Define base URL - force HTTPS in production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const isProduction = process.env.NODE_ENV === 'production';
const TOKEN_EXPIRY = parseInt(process.env.REACT_APP_TOKEN_EXPIRY || '3600', 10);

// Flag to use mock API (set to true when developing without a backend)
const USE_MOCK_API = false; // Explicitly enable mock API for development

// Add timeout to API requests
const TIMEOUT = 10000; // 10 seconds

console.log('[API Service] Configuration:', {
  API_URL,
  isProduction,
  USE_MOCK_API,
  TIMEOUT,
  debugInfo: process.env.NODE_ENV !== 'production' ? debugMockApi() : null
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // We need to disable withCredentials to prevent CORS issues
  withCredentials: false,
  timeout: TIMEOUT,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const tokenData = JSON.parse(sessionStorage.getItem('token') || '{"value":"","expires":0}');
      if (tokenData.value && Date.now() < tokenData.expires) {
        config.headers.Authorization = `Bearer ${tokenData.value}`;
      }
    } catch (error) {
      // Invalid token format, remove it
      sessionStorage.removeItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Service] Response error:', error.message);
    
    // Create a standardized error format for timeout/network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      const formattedError = new Error('Network Error: Could not connect to the server');
      formattedError.response = {
        status: 0,
        data: { 
          message: 'Cannot connect to the server. Please check your internet connection or try again later.' 
        }
      };
      return Promise.reject(formattedError);
    }
    
    // Special handling for "User does not exist" error
    if (error.response && 
        error.response.data && 
        error.response.data.message === "User does not exists") {
      console.log('[API Service] User does not exist, treating as invalid credentials');
      const formattedError = new Error('Invalid credentials');
      formattedError.response = {
        status: 401,
        data: { 
          message: 'Invalid credentials. Please check your information and try again.' 
        }
      };
      return Promise.reject(formattedError);
    }
    
    // Special handling for "User already exists" error
    if (error.response && 
        error.response.data && 
        (error.response.data.message === "User already exists" || 
         error.response.data.message.includes("duplicate") || 
         error.response.data.message.includes("already exists"))) {
      console.log('[API Service] User already exists error');
      const formattedError = new Error('User already exists');
      formattedError.response = {
        status: 409,
        data: { 
          message: 'A user with these details already exists. Please use different information or try logging in instead.' 
        }
      };
      return Promise.reject(formattedError);
    }
    
    // If the error is due to an unauthorized request (expired token)
    if (error.response && error.response.status === 401) {
      console.log('[API Service] Unauthorized error (401). Current path:', window.location.pathname);
      
      // Clear the token and user data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Only redirect to login if not already there and not a login/register attempt
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && 
          currentPath !== '/register' && 
          !error.config.url.includes('/auth/login') && 
          !error.config.url.includes('/auth/register')) {
        console.log('[API Service] Redirecting to login due to unauthorized error');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Save token helper function
export const saveToken = (token, expiresIn = TOKEN_EXPIRY) => {
  const tokenData = {
    value: token,
    expires: Date.now() + expiresIn * 1000 // Convert seconds to milliseconds
  };
  sessionStorage.setItem('token', JSON.stringify(tokenData));
  console.log('[API Service] Token saved, expires in', expiresIn, 'seconds');
};

// Fallback to mock API if real API call fails (useful for development)
const withMockFallback = async (realApiCall, mockApiCall, ...args) => {
  if (USE_MOCK_API) {
    return await mockApiCall(...args);
  }
  
  try {
    return await realApiCall(...args);
  } catch (error) {
    console.error('[API Service] Real API call failed, using mock fallback:', error.message);
    
    // Only use mock fallback in development
    if (process.env.NODE_ENV !== 'production') {
      return await mockApiCall(...args);
    }
    
    throw error;
  }
};

// Auth services
export const authService = {
  register: async (userData) => {
    try {
      if (USE_MOCK_API) {
        console.log('[API Service] Using mock API for registration', userData);
        const response = await mockAuthService.register(userData);
        if (response && response.token) {
          saveToken(response.token, response.expiresIn || TOKEN_EXPIRY);
        }
        return response;
      }
      
      console.log('[API Service] Using real API for registration');
      try {
        const response = await api.post('/auth/register', userData);
        
        // Check that we have a successful response with a token
        if (!response.data || !response.data.token) {
          console.error('[API Service] Registration response missing token:', response.data);
          throw new Error('Invalid registration response');
        }
        
        // Only save the token if we get a valid response
        console.log('[API Service] Real API registration successful:', response.data);
        saveToken(response.data.token, response.data.expiresIn || TOKEN_EXPIRY);
        return response.data;
      } catch (error) {
        console.error('[API Service] Real API registration failed:', error.message);
        
        // Check if this is a duplicate user error (common registration error)
        if (error.response && 
            error.response.data && 
            (error.response.data.message === "User already exists" || 
             error.response.data.message.includes("duplicate") || 
             error.response.data.message.includes("already exists"))) {
          console.error('[API Service] User already exists, not using fallback');
          throw error; // Don't use fallback for duplicate user errors
        }
        
        // Only use mock fallback for network/server errors in development
        if (process.env.NODE_ENV !== 'production' && 
            (!error.response || error.response.status >= 500)) {
          console.log('[API Service] Using mock fallback for server error');
          const response = await mockAuthService.register(userData);
          if (response && response.token) {
            saveToken(response.token, response.expiresIn || TOKEN_EXPIRY);
          }
          return response;
        }
        
        throw error;
      }
    } catch (error) {
      console.error('[API Service] Registration error:', error);
      throw error;
    }
  },
  
  login: async (userData) => {
    try {
      if (USE_MOCK_API) {
        console.log('[API Service] Using mock API for login', userData);
        const response = await mockAuthService.login(userData);
        if (response && response.token) {
          saveToken(response.token, response.expiresIn || TOKEN_EXPIRY);
        }
        return response;
      }
      
      console.log('[API Service] Using real API for login');
      try {
        const response = await api.post('/auth/login', userData);
        
        // Check that we have a successful response with a token
        if (!response.data || !response.data.token) {
          console.error('[API Service] Login response missing token:', response.data);
          throw new Error('Invalid login response');
        }
        
        // Only save the token if we get a valid response
        console.log('[API Service] Real API login successful:', response.data);
        saveToken(response.data.token, response.data.expiresIn || TOKEN_EXPIRY);
        return response.data;
      } catch (error) {
        console.error('[API Service] Real API login failed:', error.message);
        
        // Check if this is an authentication error (invalid credentials)
        if (error.response && 
            (error.response.status === 401 || 
             error.response.status === 403 || 
             (error.response.data && 
              (error.response.data.message === "User does not exists" || 
               error.response.data.message.includes("invalid") || 
               error.response.data.message.includes("incorrect"))))) {
          console.error('[API Service] Authentication error, not using fallback');
          throw error; // Don't use fallback for auth errors
        }
        
        // Only use mock fallback for network/server errors in development
        if (process.env.NODE_ENV !== 'production' && 
            (!error.response || error.response.status >= 500)) {
          console.log('[API Service] Using mock fallback for server error');
          const response = await mockAuthService.login(userData);
          if (response && response.token) {
            saveToken(response.token, response.expiresIn || TOKEN_EXPIRY);
          }
          return response;
        }
        
        throw error;
      }
    } catch (error) {
      console.error('[API Service] Login error:', error);
      throw error;
    }
  },
};

// Contact services
export const contactService = {
  getContacts: async () => {
    try {
      return await withMockFallback(
        async () => {
          console.log('[API Service] Using real API for getContacts');
          const response = await api.get('/contacts');
          return { data: response.data };
        },
        async () => {
          console.log('[API Service] Using mock API for getContacts');
          return await mockContactService.getContacts();
        }
      );
    } catch (error) {
      console.error('[API Service] getContacts error:', error);
      throw error;
    }
  },
  
  addContact: async (contactData) => {
    try {
      return await withMockFallback(
        async () => {
          console.log('[API Service] Using real API for addContact', contactData);
          const response = await api.post('/contacts', contactData);
          if (response?.data?.contact) {
            return response.data.contact;
          } else if (response?.data) {
            return {
              id: response.data.id || response.data._id || Date.now().toString(),
              ...contactData,
              ...response.data
            };
          } else {
            return {
              id: Date.now().toString(),
              ...contactData
            };
          }
        },
        async () => {
          console.log('[API Service] Using mock API for addContact', contactData);
          return await mockContactService.addContact(contactData);
        },
        contactData
      );
    } catch (error) {
      console.error('[API Service] addContact error:', error);
      throw error;
    }
  },
  
  deleteContact: async (id) => {
    try {
      return await withMockFallback(
        async () => {
          console.log('[API Service] Using real API for deleteContact', id);
          const response = await api.delete(`/contacts/${id}`);
          return response.data;
        },
        async () => {
          console.log('[API Service] Using mock API for deleteContact', id);
          return await mockContactService.deleteContact(id);
        },
        id
      );
    } catch (error) {
      console.error('[API Service] deleteContact error:', error);
      throw error;
    }
  },
};

export default api; 