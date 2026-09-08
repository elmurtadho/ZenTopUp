export interface MockTransaction {
  id: string;
  gameName: string;
  gameSlug: string;
  gameIcon: string;
  itemName: string;
  gameUserId: string;
  serverId?: string;
  whatsapp: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'berhasil' | 'pending' | 'diproses' | 'gagal';
  createdAt: string;
  vaNumber?: string;
}

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: 'GEM-928174',
    gameName: 'Mobile Legends: Bang Bang',
    gameSlug: 'mobile-legends',
    gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
    itemName: 'Weekly Diamond Pass (WDP)',
    gameUserId: '128492019',
    serverId: '2648',
    whatsapp: '081234567890',
    paymentMethod: 'QRIS (Semua E-Wallet & Bank)',
    totalAmount: 28000,
    status: 'berhasil',
    createdAt: '2026-08-14 19:30:12',
  },
  {
    id: 'GEM-847291',
    gameName: 'Valorant',
    gameSlug: 'valorant',
    gameIcon: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=80',
    itemName: '1,000 Valorant Points (VP)',
    gameUserId: 'ShadowBlade#IDN',
    whatsapp: '081234567890',
    paymentMethod: 'BCA Virtual Account',
    totalAmount: 110000,
    status: 'pending',
    createdAt: '2026-08-14 20:15:40',
    vaNumber: '880184729177777777',
  },
  {
    id: 'GEM-761928',
    gameName: 'Free Fire',
    gameSlug: 'free-fire',
    gameIcon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80',
    itemName: '720 Diamonds',
    gameUserId: '987654321',
    whatsapp: '081234567890',
    paymentMethod: 'GoPay',
    totalAmount: 96000,
    status: 'berhasil',
    createdAt: '2026-08-13 14:22:05',
  },
  {
    id: 'GEM-618294',
    gameName: 'Genshin Impact',
    gameSlug: 'genshin-impact',
    gameIcon: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
    itemName: 'Blessing of the Welkin Moon',
    gameUserId: '812938475',
    serverId: 'Asia',
    whatsapp: '081234567890',
    paymentMethod: 'DANA',
    totalAmount: 79000,
    status: 'berhasil',
    createdAt: '2026-08-12 11:05:30',
  },
  {
    id: 'GEM-519283',
    gameName: 'PUBG Mobile',
    gameSlug: 'pubg-mobile',
    gameIcon: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=150&auto=format&fit=crop&q=80',
    itemName: '325 Unknown Cash (UC)',
    gameUserId: '512938472',
    whatsapp: '081234567890',
    paymentMethod: 'Mandiri Virtual Account',
    totalAmount: 76000,
    status: 'gagal',
    createdAt: '2026-08-11 09:40:18',
  },
];
