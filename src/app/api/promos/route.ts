import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promos } from '@/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get('gameSlug');
    const discountType = searchParams.get('type'); // 'percent' | 'fixed'

    // Ensure database is seeded
    await seedDatabase();

    const conditions = [];

    // Active promos only
    conditions.push(eq(promos.isActive, true));

    // Discount type filter
    if (discountType === 'percent' || discountType === 'fixed') {
      conditions.push(eq(promos.discountType, discountType));
    }

    // Game slug filter (global promos where game_slug is null, OR specific to this game)
    if (gameSlug) {
      conditions.push(
        or(
          isNull(promos.gameSlug),
          eq(promos.gameSlug, gameSlug),
          eq(promos.gameSlug, '')
        )
      );
    }

    const result = db
      .select()
      .from(promos)
      .where(and(...conditions))
      .all();

    // Parse terms JSON array
    const formattedResult = result.map((p) => {
      let parsedTerms: string[] = [];
      if (p.terms) {
        try {
          parsedTerms = JSON.parse(p.terms);
        } catch {
          parsedTerms = [p.terms];
        }
      }
      return {
        ...p,
        terms: parsedTerms,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedResult,
      total: formattedResult.length,
    });
  } catch (error) {
    console.error('Error fetching promos:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil daftar promo' },
      { status: 500 }
    );
  }
}
