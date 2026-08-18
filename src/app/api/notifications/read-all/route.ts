import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { seedDatabase } from '@/db/seed';

export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    await db.update(notifications).set({ isRead: true });

    return NextResponse.json({
      success: true,
      message: 'Semua notifikasi berhasil ditandai sebagai sudah dibaca',
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menandai semua notifikasi sudah dibaca' },
      { status: 500 }
    );
  }
}
