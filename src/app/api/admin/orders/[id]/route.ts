import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'menunggu', 'diproses', 'berhasil', 'gagal'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status tidak valid. Gunakan: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await db.select().from(orders).where(eq(orders.id, id));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    const updated = await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Status pesanan ${id} berhasil diubah menjadi '${status}'!`,
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const deleted = await db.delete(orders).where(eq(orders.id, id)).returning();
    if (!deleted.length) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Pesanan ${id} berhasil dihapus!`,
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
