const API_BASE_URL = 'https://online-quiz-app-backend-1-5hio.onrender.com/api';
export const userAPI = {
  register: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      console.log('Register response:', data);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Logging in:', credentials);
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      console.log('Login response:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

export const testAPI = {
  getAll: async () => {
    try {
      console.log('Fetching tests...');
      const response = await fetch(`${API_BASE_URL}/tests`);
      const data = await response.json();
      console.log('Tests response:', data);
      return data;
    } catch (error) {
      console.error('Get tests error:', error);
      throw error;
    }
  },

  create: async (testData) => {
    try {
      console.log('Creating test:', testData);
      const response = await fetch(`${API_BASE_URL}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      console.log('Create test response:', data);
      return data;
    } catch (error) {
      console.error('Create test error:', error);
      throw error;
    }
  },

  delete: async (testId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
        method: 'DELETE'
      });
      return response.json();
    } catch (error) {
      console.error('Delete test error:', error);
      throw error;
    }
  }
};

export const resultAPI = {
  submit: async (resultData) => {
    try {
      console.log('Submitting result:', resultData);
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });
      const data = await response.json();
      console.log('Submit result response:', data);
      return data;
    } catch (error) {
      console.error('Submit result error:', error);
      throw error;
    }
  },

  getLeaderboard: async (testId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/results/test/${testId}`);
      return response.json();
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return [];
    }
  },

  getUserResults: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/results/user/${userId}`);
      return response.json();
    } catch (error) {
      console.error('Get user results error:', error);
      return [];
    }
  }
};