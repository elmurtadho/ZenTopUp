import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { paymentMethods } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const amount = searchParams.get('amount');

    // Ensure database is seeded
    await seedDatabase();

    const conditions = [];

    // Active methods only
    conditions.push(eq(paymentMethods.isActive, true));

    // Category filter
    if (category && category !== 'Semua') {
      conditions.push(eq(paymentMethods.category, category));
    }

    const result = await db
      .select()
      .from(paymentMethods)
      .where(and(...conditions));

    // Parse instructions
    const formatted = result.map((m) => {
      let instructions: string[] = [];
      if (m.instructions) {
        try {
          instructions = JSON.parse(m.instructions);
        } catch {
          instructions = [m.instructions];
        }
      }
      return {
        id: m.id,
        name: m.name,
        category: m.category,
        icon: m.iconUrl,
        adminFee: m.adminFee,
        minAmount: m.minAmount,
        maxAmount: m.maxAmount,
        instructions,
        isAvailable: amount
          ? Number(amount) >= m.minAmount && Number(amount) <= m.maxAmount
          : true,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil daftar metode pembayaran' },
      { status: 500 }
    );
  }
}
