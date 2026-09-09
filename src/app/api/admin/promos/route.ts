import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promos } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const allPromos = await db.select().from(promos).orderBy(desc(promos.id));

    const formatted = allPromos.map((p) => {
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
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching admin promos:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data promo', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      title,
      description,
      discountType,
      amount,
      minPurchase,
      maxDiscount,
      imageUrl,
      gameSlug,
      startsAt,
      endsAt,
      terms,
      isActive,
    } = body;

    if (!code || !title || !description || !discountType || amount === undefined) {
      return NextResponse.json(
        { success: false, message: 'Kode promo, judul, deskripsi, tipe diskon, dan jumlah diskon wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanCode = code.toUpperCase().trim();
    const existing = await db.select().from(promos).where(eq(promos.code, cleanCode));
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: `Kode promo '${cleanCode}' sudah digunakan.` },
        { status: 400 }
      );
    }

    const newPromo = await db
      .insert(promos)
      .values({
        code: cleanCode,
        title,
        description,
        discountType,
        amount: Number(amount),
        minPurchase: minPurchase ? Number(minPurchase) : 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        gameSlug: gameSlug || null,
        startsAt: startsAt || new Date().toISOString().split('T')[0],
        endsAt: endsAt || '2026-12-31',
        terms: terms ? (Array.isArray(terms) ? JSON.stringify(terms) : terms) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Voucher promo baru berhasil ditambahkan!',
      data: newPromo[0],
    });
  } catch (error: any) {
    console.error('Error creating promo:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan voucher promo', error: error.message },
      { status: 500 }
    );
  }
}
