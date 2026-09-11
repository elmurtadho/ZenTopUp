import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { webPopups } from '@/db/schema';
import { seedDatabase } from '@/db/seed';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await seedDatabase();

    const popupList = await db
      .select()
      .from(webPopups)
      .orderBy(desc(webPopups.id));

    if (!popupList.length) {
      // Create a default record if missing
      const created = await db
        .insert(webPopups)
        .values({
          title: '🎉 Promo Spesial Selamat Datang!',
          tag: 'DISCOUNT MEMBER BARU',
          description:
            'Dapatkan potongan harga spesial pengguna baru hingga Rp 15.000 untuk semua game populer dengan kode voucher: TOKOGEMBARU.',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
          buttonText: 'Ambil Voucher & Top Up Sekarang',
          buttonUrl: '/promo',
          isActive: true,
        })
        .returning();

      return NextResponse.json({
        success: true,
        data: created,
      });
    }

    return NextResponse.json({
      success: true,
      data: popupList,
    });
  } catch (error: any) {
    console.error('Error fetching admin popups:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat konfigurasi popup', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, tag, description, imageUrl, buttonText, buttonUrl, isActive } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Judul dan deskripsi popup wajib diisi.' },
        { status: 400 }
      );
    }

    const created = await db
      .insert(webPopups)
      .values({
        title: title.trim(),
        tag: tag ? tag.trim() : null,
        description: description.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : null,
        buttonText: buttonText ? buttonText.trim() : 'Lihat Promo',
        buttonUrl: buttonUrl ? buttonUrl.trim() : '/promo',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Popup promo baru berhasil ditambahkan!',
      data: created[0],
    });
  } catch (error: any) {
    console.error('Error creating admin popup:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat popup baru', error: error.message },
      { status: 500 }
    );
  }
}
