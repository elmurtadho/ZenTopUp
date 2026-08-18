'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberLevel?: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  totalTransactions?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const saved = localStorage.getItem('zentopup_user');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default demo user
        const demoUser: UserProfile = {
          id: 1,
          name: 'Reza Gamers ID',
          email: 'reza.gamers@example.com',
          phone: '081234567890',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          memberLevel: 'VIP Platinum',
          totalTransactions: 14,
        };
        setUser(demoUser);
        localStorage.setItem('zentopup_user', JSON.stringify(demoUser));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: userData.id || Date.now(),
      name: userData.name || 'Gamer ZenTopUp',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '081234567890',
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      memberLevel: userData.memberLevel || 'Gold',
      totalTransactions: userData.totalTransactions || 5,
    };
    setUser(newUser);
    try {
      localStorage.setItem('zentopup_user', JSON.stringify(newUser));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('zentopup_user');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
