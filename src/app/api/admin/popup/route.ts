import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { webPopups } from '@/db/schema';
import { seedDatabase } from '@/db/seed';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    await seedDatabase();

    const popupList = await db.select().from(webPopups).limit(1);
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
        data: created[0],
      });
    }

    return NextResponse.json({
      success: true,
      data: popupList[0],
    });
  } catch (error: any) {
    console.error('Error fetching admin popup:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat konfigurasi popup', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, tag, description, imageUrl, buttonText, buttonUrl, isActive } = body;

    const popupList = await db.select().from(webPopups).limit(1);

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Judul dan deskripsi popup wajib diisi.' },
        { status: 400 }
      );
    }

    let result;
    if (popupList.length > 0) {
      const updated = await db
        .update(webPopups)
        .set({
          title: title.trim(),
          tag: tag ? tag.trim() : null,
          description: description.trim(),
          imageUrl: imageUrl ? imageUrl.trim() : null,
          buttonText: buttonText ? buttonText.trim() : 'Lihat Promo',
          buttonUrl: buttonUrl ? buttonUrl.trim() : '/promo',
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(webPopups.id, popupList[0].id))
        .returning();
      result = updated[0];
    } else {
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
      result = created[0];
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan popup selamat datang berhasil disimpan!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error updating admin popup:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan popup', error: error.message },
      { status: 500 }
    );
  }
}
