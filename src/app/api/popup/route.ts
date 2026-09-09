import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { webPopups } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    await seedDatabase();

    const activePopup = await db
      .select()
      .from(webPopups)
      .where(eq(webPopups.isActive, true))
      .limit(1);

    if (!activePopup.length) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: activePopup[0],
    });
  } catch (error: any) {
    console.error('Error fetching public popup:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat popup', error: error.message },
      { status: 500 }
    );
  }
}
