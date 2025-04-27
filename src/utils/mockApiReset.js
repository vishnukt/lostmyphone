/**
 * Utility to reset the mock API state
 * This is useful for testing and debugging
 */

// Function to clear mock API data
export const resetMockApi = () => {
  console.log('Resetting mock API state...');
  localStorage.removeItem('mockUsers');
  localStorage.removeItem('mockContacts');
  console.log('Mock API state reset complete');
  
  // Also clear any authentication
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  console.log('Session storage cleared');
  
  // Create a test user for easier testing
  const testUser = {
    id: Date.now().toString(),
    fullName: "Test User",
    dateOfBirth: "2000-01-01",
    phoneNumber: "+11234567890",
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('mockUsers', JSON.stringify([testUser]));
  localStorage.setItem('mockContacts', JSON.stringify({
    [testUser.id]: []
  }));
  
  console.log('Created test user with credentials:');
  console.log('- Name: Test User');
  console.log('- Date of Birth: 2000-01-01 (Year: 2000, Month: Jan, Day: 1)');
  console.log('- Phone: +11234567890 (Country code: +1, Number: 1234567890)');
  
  return {
    success: true,
    testUser
  };
};

export default resetMockApi; 