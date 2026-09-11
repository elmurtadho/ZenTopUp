import { PaymentMethod } from '@/types';

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  // Saldo TokoGem (Dompet Digital Akun)
  {
    id: 'saldo',
    name: 'Saldo Dompet TokoGem (Bayar Instan)',
    category: 'Saldo',
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    adminFee: 0,
    isPopular: true,
    instructions: [
      'Gunakan saldo akun TokoGem untuk pembayaran instan 1 detik.',
      'Bebas biaya admin (Rp 0).',
      'Pastikan saldo dompet kamu mencukupi total belanja.',
    ],
  },
  // QRIS
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & Bank)',
    category: 'QRIS',
    icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    adminFee: 0,
    isPopular: true,
    instructions: [
      'Buka aplikasi e-wallet (GoPay, OVO, DANA, BCA Mobile, dll).',
      'Pilih menu Scan / Bayar QRIS.',
      'Arahkan kamera ke kode QRIS yang muncul di layar.',
      'Periksa nominal dan selesaikan pembayaran.',
    ],
  },
  // E-Wallets
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'E-Wallet',
    icon: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=100&auto=format&fit=crop&q=80',
    adminFee: 1000,
    isPopular: true,
    instructions: [
      'Klik tombol bayar untuk membuka aplikasi GoPay.',
      'Pastikan saldo GoPay mencukupi.',
      'Konfirmasi pembayaran dengan PIN GoPay.',
    ],
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'E-Wallet',
    icon: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=100&auto=format&fit=crop&q=80',
    adminFee: 1000,
    isPopular: true,
    instructions: [
      'Masukkan nomor HP akun OVO kamu.',
      'Buka notifikasi transaksi di aplikasi OVO dalam 60 detik.',
      'Klik Bayar dan masukkan security code OVO.',
    ],
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'E-Wallet',
    icon: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=100&auto=format&fit=crop&q=80',
    adminFee: 1000,
    isPopular: true,
    instructions: [
      'Kamu akan dialihkan ke halaman DANA.',
      'Masukkan nomor HP terdaftar & PIN DANA.',
      'Selesaikan pembayaran.',
    ],
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'E-Wallet',
    icon: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=100&auto=format&fit=crop&q=80',
    adminFee: 1000,
    instructions: [
      'Aplikasi Shopee akan otomatis terbuka.',
      'Verifikasi rincian pesanan dan bayar dengan PIN ShopeePay.',
    ],
  },

  // Virtual Accounts
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    category: 'Virtual Account',
    icon: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&auto=format&fit=crop&q=80',
    adminFee: 2500,
    isPopular: true,
    instructions: [
      'Buka BCA mobile / KlikBCA / ATM BCA.',
      'Pilih menu Transfer > Virtual Account.',
      'Masukkan nomor Virtual Account yang tertera.',
      'Pastikan nama & nominal sesuai, lalu konfirmasi pembayaran.',
    ],
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account (Livin)',
    category: 'Virtual Account',
    icon: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&auto=format&fit=crop&q=80',
    adminFee: 2500,
    instructions: [
      'Buka aplikasi Livin by Mandiri.',
      'Pilih menu Bayar > Multi Payment.',
      'Pilih penyedia jasa TokoGem dan masukkan nomor VA.',
      'Konfirmasi pembayaran.',
    ],
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account (BRIVA)',
    category: 'Virtual Account',
    icon: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&auto=format&fit=crop&q=80',
    adminFee: 2500,
    instructions: [
      'Buka BRImo / ATM BRI.',
      'Pilih Pembayaran > BRIVA.',
      'Masukkan nomor BRIVA dan selesaikan transaksi.',
    ],
  },
  {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    category: 'Virtual Account',
    icon: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&auto=format&fit=crop&q=80',
    adminFee: 2500,
    instructions: [
      'Buka BNI Mobile Banking.',
      'Pilih Transfer > Virtual Account Billing.',
      'Input nomor VA dan konfirmasi.',
    ],
  },

  // Convenience Stores
  {
    id: 'indomaret',
    name: 'Indomaret / Ceriamart',
    category: 'Convenience Store',
    icon: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&auto=format&fit=crop&q=80',
    adminFee: 3500,
    instructions: [
      'Kunjungi gerai Indomaret terdekat.',
      'Beritahu kasir ingin melakukan pembayaran TokoGem / Merchant.',
      'Tunjukkan kode pembayaran ke kasir dan bayar secara tunai.',
    ],
  },
  {
    id: 'alfamart',
    name: 'Alfamart / Alfamidi',
    category: 'Convenience Store',
    icon: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&auto=format&fit=crop&q=80',
    adminFee: 3500,
    instructions: [
      'Kunjungi gerai Alfamart terdekat.',
      'Sebutkan kode pembayaran kepada kasir.',
      'Lakukan pembayaran dan simpan struk sebagai bukti.',
    ],
  },
];
