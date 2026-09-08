export interface MockNotification {
  id: string;
  type: 'order_success' | 'order_created' | 'order_failed' | 'promo' | 'system';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId?: string;
  linkHref?: string;
  linkText?: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'notif-1',
    type: 'order_success',
    title: 'Top Up Sukses: Weekly Diamond Pass',
    message: 'Pembayaran pesanan GEM-928174 berhasil diverifikasi! Item telah dikirimkan secara otomatis ke akun MLBB kamu.',
    createdAt: '10 menit yang lalu',
    isRead: false,
    orderId: 'GEM-928174',
    linkHref: '/riwayat/GEM-928174',
    linkText: 'Lihat Invoice',
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: 'Voucher Diskon 50% Mobile Legends!',
    message: 'Gunakan kode promo GEMMLBB50 sekarang untuk mendapatkan diskon hingga 50% semua nominal diamond MLBB.',
    createdAt: '2 jam yang lalu',
    isRead: false,
    linkHref: '/promo',
    linkText: 'Klaim Voucher',
  },
  {
    id: 'notif-3',
    type: 'order_created',
    title: 'Menunggu Pembayaran: Valorant Points',
    message: 'Pesanan GEM-847291 sebesar Rp 110.000 menunggu pembayaran via BCA Virtual Account sebelum batas waktu habis.',
    createdAt: '4 jam yang lalu',
    isRead: false,
    orderId: 'GEM-847291',
    linkHref: '/pembayaran/GEM-847291',
    linkText: 'Bayar Sekarang',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Pemeliharaan Server Game Valorant Selesai',
    message: 'Server game Riot Games Valorant telah selesai maintenance. Layanan top up instan TokoGem kembali normal 100%.',
    createdAt: '1 hari yang lalu',
    isRead: true,
  },
  {
    id: 'notif-5',
    type: 'order_success',
    title: 'Top Up Sukses: 720 Free Fire Diamonds',
    message: 'Pesanan GEM-761928 telah berhasil diproses ke User ID 987654321.',
    createdAt: '2 hari yang lalu',
    isRead: true,
    orderId: 'GEM-761928',
    linkHref: '/riwayat/GEM-761928',
    linkText: 'Detail Transaksi',
  },
];
