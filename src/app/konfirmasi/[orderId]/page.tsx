'use client';

import React, { use, useState, useEffect } from 'react';
import PaymentStatusPage from '@/components/PaymentStatusPage';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ status?: string; method?: string }>;
}

export default function KonfirmasiPage({ params, searchParams }: PageProps) {
  const { orderId } = use(params);
  const { status, method } = use(searchParams);
  const router = useRouter();

  const [orderData, setOrderData] = useState<{
    gameName: string;
    itemName: string;
    totalAmount: number;
    discountAmount?: number;
    paymentMethod: string;
    status: 'success' | 'pending' | 'failed';
  }>({
    gameName: 'Mobile Legends: Bang Bang',
    itemName: 'Weekly Diamond Pass',
    totalAmount: 79000,
    discountAmount: 0,
    paymentMethod: method === 'saldo' ? 'Saldo Dompet TokoGem' : 'BCA Virtual Account',
    status: (status === 'pending' || status === 'failed') ? status : 'success',
  });

  // Fetch live order details from database
  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            let mappedStatus: 'success' | 'pending' | 'failed' = 'success';
            if (d.status === 'gagal') mappedStatus = 'failed';
            else if (d.status === 'pending' || d.status === 'diproses') mappedStatus = 'pending';
            else if (d.status === 'berhasil') mappedStatus = 'success';
            else if (status === 'failed' || status === 'pending') mappedStatus = status;

            setOrderData({
              gameName: d.game || 'Game',
              itemName: d.item || 'Item Top Up',
              totalAmount: d.totalAmount || 79000,
              discountAmount: d.discountAmount || 0,
              paymentMethod: d.paymentMethod || (method === 'saldo' ? 'Saldo Dompet TokoGem' : 'BCA Virtual Account'),
              status: mappedStatus,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching confirmation order data:', err);
      }
    }
    loadOrder();
  }, [orderId, status, method]);

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <PaymentStatusPage
      orderId={orderId}
      status={orderData.status}
      gameName={orderData.gameName}
      itemName={orderData.itemName}
      totalAmount={orderData.totalAmount}
      discountAmount={(orderData as any).discountAmount || 0}
      paymentMethod={orderData.paymentMethod}
      onRetry={handleRetry}
    />
  );
}
