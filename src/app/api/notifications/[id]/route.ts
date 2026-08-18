import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await seedDatabase();

    const notif = db
      .select()
      .from(notifications)
      .where(eq(notifications.id, Number(id)))
      .get();

    if (!notif) {
      return NextResponse.json(
        { success: false, message: 'Notifikasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notif });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data notifikasi' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isRead = body.isRead !== undefined ? body.isRead : true;

    await seedDatabase();

    const updated = db
      .update(notifications)
      .set({ isRead })
      .where(eq(notifications.id, Number(id)))
      .returning()
      .get();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Notifikasi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Notifikasi berhasil ditandai sebagai ${isRead ? 'sudah dibaca' : 'belum dibaca'}`,
    });
  } catch (error) {
    console.error('Error updating notification read status:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status notifikasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await seedDatabase();

    db.delete(notifications)
      .where(eq(notifications.id, Number(id)))
      .run();

    return NextResponse.json({
      success: true,
      message: 'Notifikasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus notifikasi' },
      { status: 500 }
    );
  }
}
