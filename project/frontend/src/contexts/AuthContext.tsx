import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const defaultUser: User = {
  id: '1',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  dateOfBirth: '1985-06-15',
  gender: 'male',
  phone: '+1234567890',
  height: 178,
  weight: 75,
  medicalConditions: ['Hypertension', 'Arrhythmia'],
  medications: 'Atenolol 50mg daily, Aspirin 81mg daily',
  alertThresholds: {
    tachycardia: 100,
    bradycardia: 60
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This would be an API call in a real application
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just set the default user
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      // This would be an API call in a real application
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user with the provided data and some defaults
      const newUser: User = {
        ...defaultUser,
        ...userData,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // This would be an API call in a real application
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};