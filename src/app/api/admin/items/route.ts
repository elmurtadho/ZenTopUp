import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { items, games } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    let allItems = await db
      .select({
        id: items.id,
        gameId: items.gameId,
        name: items.name,
        nominal: items.nominal,
        price: items.price,
        originalPrice: items.originalPrice,
        currency: items.currency,
        isPopular: items.isPopular,
        isActive: items.isActive,
        createdAt: items.createdAt,
        gameName: games.name,
        gameSlug: games.slug,
        gameIcon: games.iconUrl,
      })
      .from(items)
      .leftJoin(games, eq(items.gameId, games.id))
      .orderBy(asc(items.gameId), asc(items.price));

    if (gameId && !isNaN(parseInt(gameId, 10))) {
      allItems = allItems.filter((i) => i.gameId === parseInt(gameId, 10));
    }

    return NextResponse.json({
      success: true,
      data: allItems,
    });
  } catch (error: any) {
    console.error('Error fetching admin items:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data nominal item', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, name, nominal, price, originalPrice, currency, isPopular, isActive } = body;

    if (!gameId || !name || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Game, nama item, dan harga jual wajib diisi.' },
        { status: 400 }
      );
    }

    const newItem = await db
      .insert(items)
      .values({
        gameId: Number(gameId),
        name,
        nominal: Number(nominal || 0),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        currency: currency || 'IDR',
        isPopular: Boolean(isPopular),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    // Optionally update game's minPrice if lower
    const gameItems = await db.select().from(items).where(eq(items.gameId, Number(gameId)));
    const lowestPrice = Math.min(...gameItems.map((i) => i.price));
    if (lowestPrice && lowestPrice > 0) {
      await db.update(games).set({ minPrice: lowestPrice }).where(eq(games.id, Number(gameId)));
    }

    return NextResponse.json({
      success: true,
      message: 'Nominal item baru berhasil ditambahkan!',
      data: newItem[0],
    });
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan item', error: error.message },
      { status: 500 }
    );
  }
}
