import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  // Função para atualizar os estados de permissão baseados no papel do usuário
  const updatePermissions = (userRole?: UserRole) => {
    setIsAdmin(userRole === 'admin');
    setIsManager(userRole === 'admin' || userRole === 'manager');
  };

  useEffect(() => {
    // Check for saved user in localStorage or sessionStorage
    const savedUserLocal = localStorage.getItem('user');
    const savedUserSession = sessionStorage.getItem('user');
    
    let savedUser = null;
    if (savedUserLocal) {
      savedUser = JSON.parse(savedUserLocal);
      setUser(savedUser);
    } else if (savedUserSession) {
      savedUser = JSON.parse(savedUserSession);
      setUser(savedUser);
    }
    
    if (savedUser) {
      updatePermissions(savedUser.role as UserRole);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Fazer login usando a API
      const response = await fetch('http://localhost:3001/api/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        console.error('Erro ao fazer login:', response.status);
        setIsLoading(false);
        return false;
      }
      
      const data = await response.json();
      
      if (!data.user) {
        console.error('Dados de usuário não encontrados na resposta');
        setIsLoading(false);
        return false;
      }
      
      const loggedUser: User = data.user;
      
      setUser(loggedUser);
      updatePermissions(loggedUser.role as UserRole);
      
      // Store user data based on rememberMe preference
      if (rememberMe) {
        // Persist across browser sessions
        localStorage.setItem('user', JSON.stringify(loggedUser));
        // Clean up session storage if exists
        sessionStorage.removeItem('user');
      } else {
        // Only for current browser session
        sessionStorage.setItem('user', JSON.stringify(loggedUser));
        // Clean up local storage if exists
        localStorage.removeItem('user');
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setIsManager(false);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, isManager, login, logout }}>
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