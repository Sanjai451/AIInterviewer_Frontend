import React, { createContext, useContext, useState, type ReactNode } from 'react';

type UserRole = 'user' | 'hr' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (will be replaced with real backend later)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'hr@example.com',
    name: 'HR Manager',
    role: 'hr',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock login - in real app, this would call the backend
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    // For demo, create a new user on login attempt
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      role,
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
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
