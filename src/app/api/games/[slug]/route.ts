import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games, items } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';
import { MOCK_GAMES } from '@/data/mockGames';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  try {
    // Ensure database is seeded
    await seedDatabase();

    // Find game by slug
    const gameResults = await db
      .select()
      .from(games)
      .where(and(eq(games.slug, slug), eq(games.isActive, true)));

    const game = gameResults[0];

    if (!game) {
      const mockFallback = MOCK_GAMES.find((g) => g.slug === slug);
      if (mockFallback) {
        return NextResponse.json({
          success: true,
          data: mockFallback,
        });
      }
      return NextResponse.json(
        { success: false, message: `Game dengan slug '${slug}' tidak ditemukan` },
        { status: 404 }
      );
    }

    // Find game items
    const gameItems = await db
      .select()
      .from(items)
      .where(and(eq(items.gameId, game.id), eq(items.isActive, true)))
      .orderBy(asc(items.price));

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
    console.warn(`[API /games/${slug}] Falling back to mock data:`, error);
    const mock = MOCK_GAMES.find((g) => g.slug === slug);
    if (mock) {
      return NextResponse.json({
        success: true,
        data: mock,
      });
    }
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail game' },
      { status: 500 }
    );
  }
}
