import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ZenTopUp — Platform Top Up Game Cepat, Termurah & Resmi',
  description:
    'Top up diamond MLBB, Free Fire, PUBG Mobile, Valorant VP, Genshin Impact Genesis Crystal instan 1 detik, aman dan resmi 24 jam.',
  keywords: [
    'top up game',
    'diamond ml murah',
    'diamond ff',
    'uc pubg',
    'valorant points',
    'zentopup',
    'topup resmi indonesia',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
