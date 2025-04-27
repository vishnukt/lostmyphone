/**
 * Format error messages for user display
 * @param {Error} error - The error object from API call
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  // CORS errors don't have response data
  if (!error) {
    return 'An unknown error occurred. Please try again.';
  }
  
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection or try again later.';
  }
  
  // Server returned an error status
  if (error.response) {
    // Check if there's a message in the response data
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    
    // Otherwise use HTTP status text
    if (error.response.status === 401) {
      return 'Authentication failed. Please check your credentials and try again.';
    } else if (error.response.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    return `Error: ${error.response.statusText || 'Unknown server error'}`;
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Log errors to console in development only
 * @param {Error} error - The error to log
 * @param {string} context - Description of where the error occurred
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    // Log additional details if available
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response was received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    // Log stack trace
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
};

// Create a named export object instead of an anonymous default export
const errorHandlers = {
  formatErrorMessage,
  logError,
};

export default errorHandlers; 