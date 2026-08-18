'use client';

import React, { use } from 'react';
import PaymentStatusPage from '@/components/PaymentStatusPage';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default function KonfirmasiPage({ params, searchParams }: PageProps) {
  const { orderId } = use(params);
  const { status } = use(searchParams);
  const router = useRouter();

  const resolvedStatus = (status === 'pending' || status === 'failed') ? status : 'success';

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <PaymentStatusPage
      orderId={orderId}
      status={resolvedStatus}
      gameName="Mobile Legends: Bang Bang"
      itemName="Weekly Diamond Pass"
      totalAmount={79000}
      paymentMethod="BCA Virtual Account"
      onRetry={handleRetry}
    />
  );
}
