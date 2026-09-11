'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, WalletTransaction } from '@/types';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'guest' | 'member' | 'reseller';
  memberLevel?: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  balance: number; // Saldo Dompet Rupiah
  gemPoints: number;
  totalTransactions: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  isMember: boolean;
  isReseller: boolean;
  walletTransactions: WalletTransaction[];
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  setGuestMode: () => void;
  depositBalance: (amount: number, method: string) => Promise<boolean>;
  deductBalance: (
    amount: number,
    orderId: string,
    description: string
  ) => Promise<{ success: boolean; message?: string }>;
  upgradeToReseller: () => void;
  switchRole: (role: 'guest' | 'member' | 'reseller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_MEMBER: UserProfile = {
  id: 1,
  name: 'Reza Gamers ID',
  email: 'reza.gamers@example.com',
  phone: '081234567890',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  role: 'member',
  memberLevel: 'Gold',
  balance: 75000,
  gemPoints: 420,
  totalTransactions: 14,
};

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TX-101',
    userId: 1,
    type: 'topup',
    amount: 100000,
    balanceBefore: 0,
    balanceAfter: 100000,
    referenceId: 'DEP-77821',
    description: 'Deposit Saldo TokoGem via QRIS Instant',
    paymentMethod: 'QRIS',
    status: 'berhasil',
    createdAt: '2026-09-10 10:15:00',
  },
  {
    id: 'TX-102',
    userId: 1,
    type: 'payment',
    amount: 25000,
    balanceBefore: 100000,
    balanceAfter: 75000,
    referenceId: 'GEM-89211',
    description: 'Pembelian 86 Diamonds Mobile Legends',
    paymentMethod: 'Saldo TokoGem',
    status: 'berhasil',
    createdAt: '2026-09-10 14:30:00',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('tokogem_user');
      const savedTx = localStorage.getItem('tokogem_wallet_transactions');

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Ensure role & balance exist
        if (!parsed.role) parsed.role = 'member';
        if (parsed.balance === undefined) parsed.balance = 75000;
        if (parsed.gemPoints === undefined) parsed.gemPoints = 420;
        setUser(parsed);
      } else {
        // Start with default member so users can immediately test balance
        setUser(DEFAULT_MEMBER);
        localStorage.setItem('tokogem_user', JSON.stringify(DEFAULT_MEMBER));
      }

      if (savedTx) {
        setWalletTransactions(JSON.parse(savedTx));
      } else {
        setWalletTransactions(DEFAULT_TRANSACTIONS);
        localStorage.setItem('tokogem_wallet_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
      }
    } catch {
      setUser(DEFAULT_MEMBER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    try {
      if (updatedUser) {
        localStorage.setItem('tokogem_user', JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem('tokogem_user');
      }
    } catch {}
  };

  const saveTransactions = (txList: WalletTransaction[]) => {
    setWalletTransactions(txList);
    try {
      localStorage.setItem('tokogem_wallet_transactions', JSON.stringify(txList));
    } catch {}
  };

  const login = (userData: Partial<UserProfile>) => {
    const role = userData.role || 'member';
    const newUser: UserProfile = {
      id: userData.id || Date.now(),
      name: userData.name || (role === 'reseller' ? 'Mitra TokoGem VIP' : 'Gamer TokoGem'),
      email: userData.email || 'user@example.com',
      phone: userData.phone || '081234567890',
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role,
      memberLevel: userData.memberLevel || (role === 'reseller' ? 'VIP Platinum' : 'Gold'),
      balance:
        userData.balance !== undefined
          ? userData.balance
          : role === 'reseller'
          ? 250000
          : 50000,
      gemPoints: userData.gemPoints !== undefined ? userData.gemPoints : 500,
      totalTransactions: userData.totalTransactions || 10,
    };
    saveUser(newUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const setGuestMode = () => {
    saveUser(null);
  };

  const depositBalance = async (amount: number, method: string): Promise<boolean> => {
    if (!user) return false;
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + amount;

    const updatedUser: UserProfile = {
      ...user,
      balance: balanceAfter,
      gemPoints: user.gemPoints + Math.floor(amount / 5000), // Bonus points
    };
    saveUser(updatedUser);

    const newTx: WalletTransaction = {
      id: `DEP-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      type: 'topup',
      amount,
      balanceBefore,
      balanceAfter,
      referenceId: `REF-${Date.now()}`,
      description: `Isi Saldo Dompet TokoGem via ${method}`,
      paymentMethod: method,
      status: 'berhasil',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    saveTransactions([newTx, ...walletTransactions]);
    return true;
  };

  const deductBalance = async (
    amount: number,
    orderId: string,
    description: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'Harap masuk ke akun terlebih dahulu untuk menggunakan saldo' };
    }

    if (user.balance < amount) {
      return {
        success: false,
        message: `Saldo tidak mencukupi (Saldo Anda: Rp ${user.balance.toLocaleString('id-ID')} / Butuh: Rp ${amount.toLocaleString('id-ID')})`,
      };
    }

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - amount;
    const pointsEarned = Math.floor(amount / 1000);

    const updatedUser: UserProfile = {
      ...user,
      balance: balanceAfter,
      gemPoints: user.gemPoints + pointsEarned,
      totalTransactions: user.totalTransactions + 1,
    };
    saveUser(updatedUser);

    const newTx: WalletTransaction = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      type: 'payment',
      amount,
      balanceBefore,
      balanceAfter,
      referenceId: orderId,
      description,
      paymentMethod: 'Saldo TokoGem',
      status: 'berhasil',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    saveTransactions([newTx, ...walletTransactions]);
    return { success: true };
  };

  const upgradeToReseller = () => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      role: 'reseller',
      memberLevel: 'VIP Platinum',
      balance: user.balance + 100000, // Welcome bonus saldo reseller
      gemPoints: user.gemPoints + 1000,
    };
    saveUser(updatedUser);

    const bonusTx: WalletTransaction = {
      id: `BON-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      type: 'bonus',
      amount: 100000,
      balanceBefore: user.balance,
      balanceAfter: user.balance + 100000,
      description: '🎁 Bonus Selamat Datang Mitra VIP Reseller TokoGem',
      paymentMethod: 'Sistem TokoGem',
      status: 'berhasil',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    saveTransactions([bonusTx, ...walletTransactions]);
  };

  const switchRole = (newRole: 'guest' | 'member' | 'reseller') => {
    if (newRole === 'guest') {
      saveUser(null);
    } else if (newRole === 'reseller') {
      login({
        name: 'Mitra Agen TopUp (Reseller VIP)',
        email: 'reseller.vip@tokogem.com',
        role: 'reseller',
        memberLevel: 'VIP Platinum',
        balance: 350000,
        gemPoints: 1250,
      });
    } else {
      login({
        name: 'Reza Gamers ID',
        email: 'reza.gamers@example.com',
        role: 'member',
        memberLevel: 'Gold',
        balance: 75000,
        gemPoints: 420,
      });
    }
  };

  const isGuest = !user || user.role === 'guest';
  const isMember = Boolean(user && user.role === 'member');
  const isReseller = Boolean(user && user.role === 'reseller');

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        isMember,
        isReseller,
        walletTransactions,
        login,
        logout,
        setGuestMode,
        depositBalance,
        deductBalance,
        upgradeToReseller,
        switchRole,
      }}
    >
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
