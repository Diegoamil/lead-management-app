import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    // This would be an API call in a real application
    // For demo purposes, we'll simulate a successful login
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      phone,
      name: 'João Silva'
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}