import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games, items } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const gameId = parseInt(id, 10);

  if (isNaN(gameId)) {
    return NextResponse.json({ success: false, message: 'ID game tidak valid' }, { status: 400 });
  }

  try {
    const game = await db.select().from(games).where(eq(games.id, gameId));
    if (!game.length) {
      return NextResponse.json({ success: false, message: 'Game tidak ditemukan' }, { status: 404 });
    }

    const gameItems = await db.select().from(items).where(eq(items.gameId, gameId));

    return NextResponse.json({
      success: true,
      data: {
        ...game[0],
        items: gameItems,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const gameId = parseInt(id, 10);

  if (isNaN(gameId)) {
    return NextResponse.json({ success: false, message: 'ID game tidak valid' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      publisher,
      category,
      iconUrl,
      bannerUrl,
      tagline,
      isPopular,
      rating,
      minPrice,
      serverRequired,
      serverList,
      isActive,
    } = body;

    const existing = await db.select().from(games).where(eq(games.id, gameId));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Game tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    if (publisher !== undefined) updateData.publisher = publisher;
    if (category !== undefined) updateData.category = category;
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (minPrice !== undefined) updateData.minPrice = Number(minPrice);
    if (serverRequired !== undefined) updateData.serverRequired = Boolean(serverRequired);
    if (serverList !== undefined) {
      updateData.serverList = Array.isArray(serverList) ? JSON.stringify(serverList) : serverList;
    }
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await db
      .update(games)
      .set(updateData)
      .where(eq(games.id, gameId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Game berhasil diperbarui!',
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating game:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const gameId = parseInt(id, 10);

  if (isNaN(gameId)) {
    return NextResponse.json({ success: false, message: 'ID game tidak valid' }, { status: 400 });
  }

  try {
    // Delete associated items first
    await db.delete(items).where(eq(items.gameId, gameId));
    // Delete game
    const deleted = await db.delete(games).where(eq(games.id, gameId)).returning();

    if (!deleted.length) {
      return NextResponse.json({ success: false, message: 'Game tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Game '${deleted[0].name}' beserta item terkait berhasil dihapus!`,
    });
  } catch (error: any) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
