import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promos } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const promoId = parseInt(id, 10);

  if (isNaN(promoId)) {
    return NextResponse.json({ success: false, message: 'ID promo tidak valid' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      code,
      title,
      description,
      discountType,
      amount,
      minPurchase,
      maxDiscount,
      imageUrl,
      gameSlug,
      startsAt,
      endsAt,
      terms,
      isActive,
    } = body;

    const existing = await db.select().from(promos).where(eq(promos.id, promoId));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Promo tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {};
    if (code !== undefined) updateData.code = code.toUpperCase().trim();
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (discountType !== undefined) updateData.discountType = discountType;
    if (amount !== undefined) updateData.amount = Number(amount);
    if (minPurchase !== undefined) updateData.minPurchase = Number(minPurchase);
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (gameSlug !== undefined) updateData.gameSlug = gameSlug || null;
    if (startsAt !== undefined) updateData.startsAt = startsAt;
    if (endsAt !== undefined) updateData.endsAt = endsAt;
    if (terms !== undefined) updateData.terms = Array.isArray(terms) ? JSON.stringify(terms) : terms;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await db
      .update(promos)
      .set(updateData)
      .where(eq(promos.id, promoId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Voucher promo berhasil diperbarui!',
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating promo:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const promoId = parseInt(id, 10);

  if (isNaN(promoId)) {
    return NextResponse.json({ success: false, message: 'ID promo tidak valid' }, { status: 400 });
  }

  try {
    const deleted = await db.delete(promos).where(eq(promos.id, promoId)).returning();
    if (!deleted.length) {
      return NextResponse.json({ success: false, message: 'Promo tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Promo '${deleted[0].code}' berhasil dihapus!`,
    });
  } catch (error: any) {
    console.error('Error deleting promo:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
