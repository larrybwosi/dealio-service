'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isRegistered: boolean;
  profile?: CustomerProfile;
}

export interface CustomerProfile {
  fullName: string;
  phone: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  deliveryNotes?: string;
  allergies?: string;
  preferredDeliveryTime?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  dateOfBirth?: string;
  occupation?: string;
  institution?: string;
}

interface StoredUser extends User {
  password: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: CustomerProfile) => Promise<boolean>;
  completeRegistration: (profile: CustomerProfile) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('bookhub_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('bookhub_user');
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists in localStorage (simulate database)
    const users: StoredUser[] = JSON.parse(localStorage.getItem('bookhub_users') || '[]');
    const user = users.find((u: StoredUser) => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setState({
        user: userWithoutPassword,
        isLoading: false,
        isAuthenticated: true,
      });
      localStorage.setItem('bookhub_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const users: StoredUser[] = JSON.parse(localStorage.getItem('bookhub_users') || '[]');
    const existingUser = users.find((u: StoredUser) => u.email === email);

    if (existingUser) {
      return false; // User already exists
    }

    // Create new user
    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, this would be hashed
      name,
      isRegistered: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('bookhub_users', JSON.stringify(users));

    // Log in the user
    const { password: _, ...userWithoutPassword } = newUser;
    setState({
      user: userWithoutPassword,
      isLoading: false,
      isAuthenticated: true,
    });
    localStorage.setItem('bookhub_user', JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    localStorage.removeItem('bookhub_user');
  };

  const updateProfile = async (profile: CustomerProfile): Promise<boolean> => {
    if (!state.user) return false;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser = {
      ...state.user,
      profile,
    };

    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));

    localStorage.setItem('bookhub_user', JSON.stringify(updatedUser));

    // Update in users array
    const users: StoredUser[] = JSON.parse(localStorage.getItem('bookhub_users') || '[]');
    const userIndex = users.findIndex((u: StoredUser) => u.id === state.user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], profile };
      localStorage.setItem('bookhub_users', JSON.stringify(users));
    }

    return true;
  };

  const completeRegistration = async (profile: CustomerProfile): Promise<boolean> => {
    if (!state.user) return false;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser = {
      ...state.user,
      isRegistered: true,
      profile,
    };

    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));

    localStorage.setItem('bookhub_user', JSON.stringify(updatedUser));

    // Update in users array
    const users: StoredUser[] = JSON.parse(localStorage.getItem('bookhub_users') || '[]');
    const userIndex = users.findIndex((u: StoredUser) => u.id === state.user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], isRegistered: true, profile };
      localStorage.setItem('bookhub_users', JSON.stringify(users));
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
        completeRegistration,
      }}
    >
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