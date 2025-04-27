/**
 * Mock API Service for Development
 * This provides a mock implementation of the auth and contact APIs for development
 * when a real backend is not available.
 */

// Simulated delay to mimic network latency
const DELAY = 500;

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Debug logging for mock API
const logMockApi = (action, data) => {
  console.log(`[Mock API] ${action}:`, data);
};

// Mock storage
const mockStorage = {
  users: JSON.parse(localStorage.getItem('mockUsers') || '[]'),
  contacts: JSON.parse(localStorage.getItem('mockContacts') || '{}'),
  
  saveUsers() {
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
    logMockApi('Saved users', this.users.length);
  },
  
  saveContacts() {
    localStorage.setItem('mockContacts', JSON.stringify(this.contacts));
  },
  
  clear() {
    localStorage.removeItem('mockUsers');
    localStorage.removeItem('mockContacts');
    this.users = [];
    this.contacts = {};
    logMockApi('Cleared storage', null);
  }
};

// Generate a mock token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mock auth services
export const mockAuthService = {
  login: async (userData) => {
    await delay(DELAY);
    logMockApi('Login attempt', userData);
    
    const { fullName, dateOfBirth, phoneNumber } = userData;
    
    // Check if user exists
    const user = mockStorage.users.find(u => 
      u.fullName.toLowerCase() === fullName.toLowerCase() && 
      u.dateOfBirth === dateOfBirth &&
      u.phoneNumber === phoneNumber
    );
    
    logMockApi('User found', user ? 'yes' : 'no');
    
    if (!user) {
      // Simulate a server error response
      const error = new Error('Invalid credentials');
      error.response = {
        status: 401,
        data: { message: 'Invalid credentials. Please check your information and try again.' }
      };
      throw error;
    }
    
    const response = {
      token: generateToken(),
      expiresIn: 3600,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber
      }
    };
    
    logMockApi('Login successful', response);
    return response;
  },
  
  register: async (userData) => {
    await delay(DELAY);
    logMockApi('Register attempt', userData);
    
    const { fullName, dateOfBirth, phoneNumber } = userData;
    
    // Check if user already exists
    const existingUser = mockStorage.users.find(u => 
      u.phoneNumber === phoneNumber || 
      (u.fullName.toLowerCase() === fullName.toLowerCase() && u.dateOfBirth === dateOfBirth)
    );
    
    if (existingUser) {
      logMockApi('User already exists', existingUser);
      // Simulate a server error response
      const error = new Error('User already exists');
      error.response = {
        status: 409,
        data: { message: 'A user with this name and date of birth or phone number already exists.' }
      };
      throw error;
    }
    
    // Create a new user
    const newUser = { 
      id: Date.now().toString(),
      fullName, 
      dateOfBirth, 
      phoneNumber,
      createdAt: new Date().toISOString()
    };
    
    mockStorage.users.push(newUser);
    mockStorage.contacts[newUser.id] = [];
    mockStorage.saveUsers();
    mockStorage.saveContacts();
    
    const response = {
      token: generateToken(),
      expiresIn: 3600,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber
      }
    };
    
    logMockApi('Registration successful', response);
    return response;
  }
};

// Mock contact services
export const mockContactService = {
  getContacts: async () => {
    await delay(DELAY);
    
    // In a real implementation, we would extract the user ID from the token
    // Here we just return a mock list for the first user
    const userId = mockStorage.users[0]?.id;
    const contacts = userId ? (mockStorage.contacts[userId] || []) : [];
    
    logMockApi('Get contacts', { userId, count: contacts.length });
    return { data: contacts };
  },
  
  addContact: async (contactData) => {
    await delay(DELAY);
    logMockApi('Add contact', contactData);
    
    // New contact with generated ID
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString()
    };
    
    // In a real implementation, we would extract the user ID from the token
    const userId = mockStorage.users[0]?.id;
    
    if (userId) {
      if (!mockStorage.contacts[userId]) {
        mockStorage.contacts[userId] = [];
      }
      
      // Check for contact limit (max 5)
      if (mockStorage.contacts[userId].length >= 5) {
        const error = new Error('Contact limit reached');
        error.response = {
          status: 400,
          data: { message: 'You can only store up to 5 emergency contacts.' }
        };
        throw error;
      }
      
      mockStorage.contacts[userId].push(newContact);
      mockStorage.saveContacts();
      
      logMockApi('Contact added', newContact);
    } else {
      logMockApi('No user found for adding contact', null);
    }
    
    return newContact;
  },
  
  deleteContact: async (id) => {
    await delay(DELAY);
    logMockApi('Delete contact', { id });
    
    // In a real implementation, we would extract the user ID from the token
    const userId = mockStorage.users[0]?.id;
    
    if (userId && mockStorage.contacts[userId]) {
      const contactIndex = mockStorage.contacts[userId].findIndex(c => c.id === id);
      
      if (contactIndex === -1) {
        const error = new Error('Contact not found');
        error.response = {
          status: 404,
          data: { message: 'Contact not found.' }
        };
        throw error;
      }
      
      mockStorage.contacts[userId].splice(contactIndex, 1);
      mockStorage.saveContacts();
      
      logMockApi('Contact deleted', { id });
    } else {
      logMockApi('No user found for deleting contact', null);
    }
    
    return { message: 'Contact deleted successfully' };
  }
};

// Debug function to get current mock data state
export const debugMockApi = () => {
  return {
    users: mockStorage.users,
    contacts: mockStorage.contacts
  };
};

export default {
  authService: mockAuthService,
  contactService: mockContactService,
  debugMockApi
}; 