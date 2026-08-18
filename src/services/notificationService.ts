import { db } from '@/db';
import { notifications } from '@/db/schema';

export interface CreateNotificationParams {
  userId?: number | null;
  orderId?: string | null;
  type: 'order_created' | 'order_success' | 'order_failed' | 'promo' | 'system';
  title: string;
  message: string;
  linkHref?: string | null;
  linkText?: string | null;
}

/**
 * Creates and persists a notification record in the database
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const inserted = await db
      .insert(notifications)
      .values({
        userId: params.userId || null,
        orderId: params.orderId || null,
        type: params.type,
        title: params.title,
        message: params.message,
        linkHref: params.linkHref || null,
        linkText: params.linkText || null,
        isRead: false,
      })
      .returning();

    const record = inserted[0];
    console.log(`[NotificationService] Created notification: ${params.title} (ID: ${record?.id})`);
    return record;
  } catch (error) {
    console.error('[NotificationService] Failed to create notification:', error);
    return null;
  }
}

/**
 * Triggers status change notifications for orders
 */
export async function triggerOrderStatusNotification(
  orderId: string,
  newStatus: 'pending' | 'diproses' | 'berhasil' | 'gagal',
  gameName?: string,
  itemName?: string
) {
  let title = `Status Pesanan ${orderId}`;
  let message = `Status pesanan kamu telah diperbarui menjadi ${newStatus}.`;
  let type: 'order_created' | 'order_success' | 'order_failed' = 'order_created';
  let linkHref = `/riwayat/${orderId}`;
  let linkText = 'Lihat Detail';

  if (newStatus === 'berhasil') {
    type = 'order_success';
    title = `Top Up Sukses — ${itemName || 'Item Game'} (${gameName || 'Game'})`;
    message = `Pembayaran pesanan ${orderId} telah diverifikasi. Item top up telah berhasil dikirimkan ke akun game kamu!`;
    linkHref = `/riwayat/${orderId}`;
    linkText = 'Buka Invoice';
  } else if (newStatus === 'pending') {
    type = 'order_created';
    title = `Menunggu Pembayaran — ${orderId}`;
    message = `Pesanan ${itemName || 'Item Game'} sedang menunggu pembayaran. Selesaikan sebelum batas waktu berakhir.`;
    linkHref = `/pembayaran/${orderId}`;
    linkText = 'Bayar Sekarang';
  } else if (newStatus === 'gagal') {
    type = 'order_failed';
    title = `Transaksi Dibatalkan / Gagal — ${orderId}`;
    message = `Pesanan ${orderId} telah dibatalkan atau batas waktu pembayaran telah kadaluarsa.`;
    linkHref = `/riwayat/${orderId}`;
    linkText = 'Cek Status';
  }

  return await createNotification({
    orderId,
    type,
    title,
    message,
    linkHref,
    linkText,
  });
}
