import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { paymentMethods } from '@/db/schema';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    await seedDatabase();

    const allMethods = await db.select().from(paymentMethods);

    const formatted = allMethods.map((m) => {
      let instructions: string[] = [];
      if (m.instructions) {
        try {
          instructions = JSON.parse(m.instructions);
        } catch {
          instructions = [m.instructions];
        }
      }
      return {
        ...m,
        instructions,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching admin payment methods:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat metode pembayaran', error: error.message },
      { status: 500 }
    );
  }
}
