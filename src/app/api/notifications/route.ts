import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const unread = searchParams.get('unread');
    const userId = searchParams.get('userId');

    // Ensure database is initialized & seeded
    await seedDatabase();

    let allNotifs = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.id));

    // Filter by user ID if provided
    if (userId) {
      allNotifs = allNotifs.filter(
        (n) => n.userId === Number(userId) || n.userId === null
      );
    }

    // Filter by type
    if (type && type !== 'semua') {
      if (type === 'transaksi') {
        allNotifs = allNotifs.filter((n) =>
          ['order_success', 'order_created', 'order_failed'].includes(n.type)
        );
      } else {
        allNotifs = allNotifs.filter((n) => n.type === type);
      }
    }

    // Filter by unread
    if (unread === 'true') {
      allNotifs = allNotifs.filter((n) => !n.isRead);
    }

    const unreadCount = allNotifs.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: allNotifs,
      unreadCount,
      total: allNotifs.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data notifikasi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, message, linkHref, linkText, orderId, userId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Judul dan pesan notifikasi wajib diisi' },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(notifications)
      .values({
        userId: userId || null,
        orderId: orderId || null,
        type: type || 'system',
        title,
        message,
        linkHref: linkHref || null,
        linkText: linkText || null,
        isRead: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: inserted[0],
      message: 'Notifikasi berhasil dibuat',
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat notifikasi' },
      { status: 500 }
    );
  }
}
