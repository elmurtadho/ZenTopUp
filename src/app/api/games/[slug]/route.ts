import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games, items } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;

    // Ensure database is seeded
    await seedDatabase();

    // Find game by slug
    const game = db
      .select()
      .from(games)
      .where(and(eq(games.slug, slug), eq(games.isActive, true)))
      .get();

    if (!game) {
      return NextResponse.json(
        { success: false, message: `Game dengan slug '${slug}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Find game items
    const gameItems = db
      .select()
      .from(items)
      .where(and(eq(items.gameId, game.id), eq(items.isActive, true)))
      .orderBy(asc(items.price))
      .all();

    // Parse serverList if string
    let parsedServerList = null;
    if (game.serverList) {
      try {
        parsedServerList = JSON.parse(game.serverList);
      } catch (e) {
        parsedServerList = null;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...game,
        serverList: parsedServerList,
        items: gameItems,
      },
    });
  } catch (error) {
    console.error('Error fetching game detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail game' },
      { status: 500 }
    );
  }
}
