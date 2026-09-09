import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    await seedDatabase();

    const activeBanners = await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(asc(banners.position), asc(banners.id));

    return NextResponse.json({
      success: true,
      data: activeBanners,
    });
  } catch (error: any) {
    console.error('Error fetching public banners:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat banner', error: error.message },
      { status: 500 }
    );
  }
}
