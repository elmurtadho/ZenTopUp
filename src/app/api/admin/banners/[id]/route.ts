import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const bannerId = parseInt(id, 10);

  if (isNaN(bannerId)) {
    return NextResponse.json({ success: false, message: 'ID banner tidak valid' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, targetUrl, badgeText, position, isActive } = body;

    const existing = await db.select().from(banners).where(eq(banners.id, bannerId));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Banner tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle ? subtitle.trim() : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (targetUrl !== undefined) updateData.targetUrl = targetUrl ? targetUrl.trim() : '/#katalog';
    if (badgeText !== undefined) updateData.badgeText = badgeText ? badgeText.trim() : null;
    if (position !== undefined) updateData.position = Number(position);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await db
      .update(banners)
      .set(updateData)
      .where(eq(banners.id, bannerId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Banner event berhasil diperbarui!',
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const bannerId = parseInt(id, 10);

  if (isNaN(bannerId)) {
    return NextResponse.json({ success: false, message: 'ID banner tidak valid' }, { status: 400 });
  }

  try {
    const deleted = await db.delete(banners).where(eq(banners.id, bannerId)).returning();
    if (!deleted.length) {
      return NextResponse.json({ success: false, message: 'Banner tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Banner '${deleted[0].title}' berhasil dihapus!`,
    });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
