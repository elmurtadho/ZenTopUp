import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { games, items } from '@/db/schema';
import { desc, eq, like, or } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');

    let allGames = await db.select().from(games).orderBy(desc(games.id));

    if (q && q.trim()) {
      const query = q.toLowerCase().trim();
      allGames = allGames.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.publisher.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query)
      );
    }

    if (category && category !== 'Semua') {
      allGames = allGames.filter((g) => g.category === category);
    }

    // Attach item counts
    const allItems = await db.select().from(items);
    const gamesWithCount = allGames.map((g) => {
      const gameItems = allItems.filter((i) => i.gameId === g.id);
      return {
        ...g,
        itemsCount: gameItems.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: gamesWithCount,
    });
  } catch (error: any) {
    console.error('Error fetching admin games:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data game', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!name || !slug || !publisher || !category || !iconUrl) {
      return NextResponse.json(
        { success: false, message: 'Nama, slug, publisher, kategori, dan icon URL wajib diisi.' },
        { status: 400 }
      );
    }

    // Generate clean slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    // Check slug uniqueness
    const existing = await db.select().from(games).where(eq(games.slug, cleanSlug));
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: `Slug '${cleanSlug}' sudah digunakan oleh game lain.` },
        { status: 400 }
      );
    }

    const newGame = await db
      .insert(games)
      .values({
        name,
        slug: cleanSlug,
        publisher,
        category,
        iconUrl,
        bannerUrl: bannerUrl || iconUrl,
        tagline: tagline || `Top up ${name} resmi dan instan`,
        isPopular: Boolean(isPopular),
        rating: rating ? Number(rating) : 4.8,
        minPrice: minPrice ? Number(minPrice) : 1000,
        serverRequired: Boolean(serverRequired),
        serverList: serverList ? (Array.isArray(serverList) ? JSON.stringify(serverList) : serverList) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Game baru berhasil ditambahkan!',
      data: newGame[0],
    });
  } catch (error: any) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan game baru', error: error.message },
      { status: 500 }
    );
  }
}
