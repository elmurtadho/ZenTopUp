import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promos } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, gameSlug, amount = 0 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Kode promo harus diisi' },
        { status: 400 }
      );
    }

    // Ensure database is seeded
    await seedDatabase();

    const normalizedCode = code.trim().toUpperCase();

    // Query promo by code
    const promo = db
      .select()
      .from(promos)
      .where(and(eq(promos.code, normalizedCode), eq(promos.isActive, true)))
      .get();

    if (!promo) {
      return NextResponse.json(
        { valid: false, message: 'Kode promo tidak valid atau sudah kedaluwarsa' },
        { status: 404 }
      );
    }

    // Check specific game restriction
    if (promo.gameSlug && gameSlug && promo.gameSlug !== gameSlug) {
      return NextResponse.json(
        {
          valid: false,
          message: `Kode promo ${normalizedCode} hanya berlaku untuk game ${promo.gameSlug}`,
        },
        { status: 400 }
      );
    }

    // Check minimum purchase amount
    const parsedAmount = Number(amount) || 0;
    if (parsedAmount < promo.minPurchase) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimal transaksi untuk promo ini adalah Rp ${promo.minPurchase.toLocaleString('id-ID')}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === 'percent') {
      const calculated = Math.round((parsedAmount * promo.amount) / 100);
      discountAmount = promo.maxDiscount
        ? Math.min(calculated, promo.maxDiscount)
        : calculated;
    } else {
      // Fixed discount
      discountAmount = Math.min(parsedAmount, promo.amount);
    }

    const finalAmount = Math.max(0, parsedAmount - discountAmount);

    let parsedTerms: string[] = [];
    if (promo.terms) {
      try {
        parsedTerms = JSON.parse(promo.terms);
      } catch {
        parsedTerms = [promo.terms];
      }
    }

    return NextResponse.json({
      valid: true,
      promo: {
        ...promo,
        terms: parsedTerms,
      },
      discountAmount,
      finalAmount,
      message: `Kode promo ${promo.code} berhasil diterapkan! Hemat Rp ${discountAmount.toLocaleString('id-ID')}`,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { valid: false, message: 'Terjadi kesalahan sistem saat memvalidasi kode promo' },
      { status: 500 }
    );
  }
}
