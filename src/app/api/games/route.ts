import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games } from '@/db/schema';
import { eq, like, or, and, desc, asc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';
import { MOCK_GAMES } from '@/data/mockGames';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const isPopular = searchParams.get('popular');
    const sort = searchParams.get('sort') || 'popular';

    // Ensure db is seeded
    await seedDatabase();

    const conditions = [];

    // Active games only
    conditions.push(eq(games.isActive, true));

    // Category filter
    if (category && category !== 'Semua' && category !== 'Populer') {
      conditions.push(eq(games.category, category));
    }

    // Popular filter
    if (isPopular === 'true' || category === 'Populer') {
      conditions.push(eq(games.isPopular, true));
    }

    // Search query filter (name or publisher or category)
    if (q && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      conditions.push(
        or(
          like(games.name, searchTerm),
          like(games.publisher, searchTerm),
          like(games.category, searchTerm)
        )
      );
    }

    let query = db.select().from(games).where(and(...conditions));

    // Sorting
    let result;
    if (sort === 'rating') {
      result = await query.orderBy(desc(games.rating));
    } else if (sort === 'price-asc') {
      result = await query.orderBy(asc(games.minPrice));
    } else if (sort === 'name-asc') {
      result = await query.orderBy(asc(games.name));
    } else {
      // Default: popular first
      result = await query.orderBy(desc(games.isPopular), asc(games.name));
    }

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
    });
  } catch (error) {
    console.warn('[API /games] Falling back to mock data:', error);
    return NextResponse.json({
      success: true,
      data: MOCK_GAMES,
      total: MOCK_GAMES.length,
    });
  }
}
