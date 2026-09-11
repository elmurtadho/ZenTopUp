import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { webPopups } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await seedDatabase();

    const activePopups = await db
      .select()
      .from(webPopups)
      .where(eq(webPopups.isActive, true))
      .orderBy(desc(webPopups.id));

    return NextResponse.json({
      success: true,
      data: activePopups,
    });
  } catch (error: any) {
    console.error('Error fetching public popups:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat popup', error: error.message },
      { status: 500 }
    );
  }
}
