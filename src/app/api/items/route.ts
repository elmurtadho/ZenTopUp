import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games, items } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const gameSlug = searchParams.get('gameSlug');

    // Ensure database is seeded
    await seedDatabase();

    if (gameSlug) {
      const game = db
        .select()
        .from(games)
        .where(eq(games.slug, gameSlug))
        .get();

      if (!game) {
        return NextResponse.json(
          { success: false, message: 'Game tidak ditemukan' },
          { status: 404 }
        );
      }

      const gameItems = db
        .select()
        .from(items)
        .where(and(eq(items.gameId, game.id), eq(items.isActive, true)))
        .orderBy(asc(items.price))
        .all();

      return NextResponse.json({
        success: true,
        game: { id: game.id, name: game.name, slug: game.slug },
        data: gameItems,
        total: gameItems.length,
      });
    }

    if (gameId) {
      const parsedGameId = parseInt(gameId, 10);
      const gameItems = db
        .select()
        .from(items)
        .where(and(eq(items.gameId, parsedGameId), eq(items.isActive, true)))
        .orderBy(asc(items.price))
        .all();

      return NextResponse.json({
        success: true,
        data: gameItems,
        total: gameItems.length,
      });
    }

    // Return all items if no filter
    const allItems = db
      .select()
      .from(items)
      .where(eq(items.isActive, true))
      .orderBy(asc(items.price))
      .all();

    return NextResponse.json({
      success: true,
      data: allItems,
      total: allItems.length,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil daftar item' },
      { status: 500 }
    );
  }
}
