import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { items, games } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const itemId = parseInt(id, 10);

  if (isNaN(itemId)) {
    return NextResponse.json({ success: false, message: 'ID item tidak valid' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, nominal, price, originalPrice, currency, isPopular, isActive } = body;

    const existing = await db.select().from(items).where(eq(items.id, itemId));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Item tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (nominal !== undefined) updateData.nominal = Number(nominal);
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (currency !== undefined) updateData.currency = currency;
    if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await db
      .update(items)
      .set(updateData)
      .where(eq(items.id, itemId))
      .returning();

    // Recalculate game's minPrice
    const gameId = existing[0].gameId;
    const gameItems = await db.select().from(items).where(eq(items.gameId, gameId));
    const activeItems = gameItems.filter((i) => i.isActive);
    if (activeItems.length > 0) {
      const lowestPrice = Math.min(...activeItems.map((i) => i.price));
      await db.update(games).set({ minPrice: lowestPrice }).where(eq(games.id, gameId));
    }

    return NextResponse.json({
      success: true,
      message: 'Item berhasil diperbarui!',
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const itemId = parseInt(id, 10);

  if (isNaN(itemId)) {
    return NextResponse.json({ success: false, message: 'ID item tidak valid' }, { status: 400 });
  }

  try {
    const deleted = await db.delete(items).where(eq(items.id, itemId)).returning();
    if (!deleted.length) {
      return NextResponse.json({ success: false, message: 'Item tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Item '${deleted[0].name}' berhasil dihapus!`,
    });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
