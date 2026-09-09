import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { asc, desc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    await seedDatabase();

    const allBanners = await db
      .select()
      .from(banners)
      .orderBy(asc(banners.position), desc(banners.id));

    return NextResponse.json({
      success: true,
      data: allBanners,
    });
  } catch (error: any) {
    console.error('Error fetching admin banners:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat banner admin', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, imageUrl, targetUrl, badgeText, position, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Judul dan URL gambar banner wajib diisi.' },
        { status: 400 }
      );
    }

    const newBanner = await db
      .insert(banners)
      .values({
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        imageUrl: imageUrl.trim(),
        targetUrl: targetUrl ? targetUrl.trim() : '/#katalog',
        badgeText: badgeText ? badgeText.trim() : null,
        position: position !== undefined ? Number(position) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Banner event baru berhasil ditambahkan!',
      data: newBanner[0],
    });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan banner', error: error.message },
      { status: 500 }
    );
  }
}
