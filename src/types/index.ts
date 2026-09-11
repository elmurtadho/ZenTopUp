export type UserRole = 'guest' | 'member' | 'reseller' | 'admin';

export interface GameItem {
  id: number | string;
  gameId: number | string;
  name: string;
  nominal: number;
  price: number; // Guest / normal price
  memberPrice?: number; // Member discount price
  resellerPrice?: number; // Reseller wholesale price
  costPrice?: number;
  originalPrice?: number;
  currency: string;
  iconUrl?: string;
  isPopular?: boolean;
  isActive: boolean;
}

export interface Game {
  id: number | string;
  name: string;
  slug: string;
  publisher: string;
  category: 'MOBA' | 'Battle Royale' | 'RPG' | 'FPS' | 'Casual' | 'Sports' | 'Strategy' | string;
  iconUrl: string;
  bannerUrl: string;
  tagline?: string;
  isPopular: boolean;
  isActive: boolean;
  rating?: number;
  minPrice: number;
  serverRequired?: boolean;
  serverList?: string[];
  items?: GameItem[];
}

export interface Promo {
  id: number | string;
  code: string;
  title: string;
  description: string;
  discountType: 'percent' | 'fixed';
  amount: number;
  minPurchase: number;
  maxDiscount?: number;
  imageUrl: string;
  gameSlug?: string;
  startsAt: string;
  endsAt: string;
  terms: string[];
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'E-Wallet' | 'Virtual Account' | 'Transfer Bank' | 'Convenience Store' | 'QRIS' | 'Saldo';
  icon: string;
  adminFee: number;
  instructions: string[];
  isPopular?: boolean;
  minAmount?: number;
  maxAmount?: number;
  isActive?: boolean;
}

export interface Order {
  id: string;
  userId?: string | number;
  userRole?: UserRole;
  gameId: number | string;
  gameName: string;
  itemId: number | string;
  itemName: string;
  gameUserId: string;
  serverId?: string;
  whatsapp?: string;
  email?: string;
  price: number;
  discount: number;
  adminFee?: number;
  totalAmount: number;
  promoCode?: string;
  paymentMethod: string;
  status: 'pending' | 'diproses' | 'berhasil' | 'gagal';
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string | number;
  userId: number;
  type: 'topup' | 'payment' | 'refund' | 'bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  paymentMethod?: string;
  status: 'berhasil' | 'pending' | 'gagal';
  createdAt: string;
}
