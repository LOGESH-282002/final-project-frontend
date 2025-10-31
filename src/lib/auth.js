import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Token storage utilities
const tokenStorage = {
  set: (token) => {
    try {
      // Try multiple storage methods
      Cookies.set('auth-token', token, { 
        expires: 7,
        path: '/',
        sameSite: 'lax'
      });
      
      // Also store in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
      }
      
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },
  
  get: () => {
    try {
      // Try cookies first
      let token = Cookies.get('auth-token');
      
      // Fallback to localStorage
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth-token');
        // If found in localStorage, restore to cookies
        if (token) {
          Cookies.set('auth-token', token, { 
            expires: 7,
            path: '/',
            sameSite: 'lax'
          });
        }
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  remove: () => {
    try {
      Cookies.remove('auth-token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

// Add token to requests
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  // Register with email/password
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      tokenStorage.set(response.data.token);
    }
    return response.data;
  },

  // Login with email/password
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      tokenStorage.set(response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout');
    tokenStorage.remove();
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Google OAuth login
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  // Set token from URL (for OAuth callback)
  setTokenFromUrl: (token) => {
    if (token) {
      tokenStorage.set(token);
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!tokenStorage.get();
  },

  // Get token
  getToken: () => {
    return tokenStorage.get();
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/auth/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};