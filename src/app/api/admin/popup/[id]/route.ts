import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { webPopups } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const popupId = parseInt(id, 10);

  if (isNaN(popupId)) {
    return NextResponse.json({ success: false, message: 'ID popup tidak valid' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, tag, description, imageUrl, buttonText, buttonUrl, isActive } = body;

    const existing = await db.select().from(webPopups).where(eq(webPopups.id, popupId));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Popup tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (tag !== undefined) updateData.tag = tag ? tag.trim() : null;
    if (description !== undefined) updateData.description = description ? description.trim() : '';
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
    if (buttonText !== undefined) updateData.buttonText = buttonText ? buttonText.trim() : 'Lihat Promo';
    if (buttonUrl !== undefined) updateData.buttonUrl = buttonUrl ? buttonUrl.trim() : '/promo';
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await db
      .update(webPopups)
      .set(updateData)
      .where(eq(webPopups.id, popupId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Popup promo berhasil diperbarui!',
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating popup:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const popupId = parseInt(id, 10);

  if (isNaN(popupId)) {
    return NextResponse.json({ success: false, message: 'ID popup tidak valid' }, { status: 400 });
  }

  try {
    const deleted = await db.delete(webPopups).where(eq(webPopups.id, popupId)).returning();
    if (!deleted.length) {
      return NextResponse.json({ success: false, message: 'Popup tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Popup '${deleted[0].title}' berhasil dihapus!`,
    });
  } catch (error: any) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
