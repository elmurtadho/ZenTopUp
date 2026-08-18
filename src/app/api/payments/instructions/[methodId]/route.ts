import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { paymentMethods } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

interface RouteContext {
  params: Promise<{ methodId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { methodId } = await params;

    // Ensure database is seeded
    await seedDatabase();

    const methodResults = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, methodId.toLowerCase()));

    const method = methodResults[0];

    if (!method) {
      return NextResponse.json(
        { success: false, message: `Metode pembayaran '${methodId}' tidak ditemukan` },
        { status: 404 }
      );
    }

    let instructions: string[] = [];
    if (method.instructions) {
      try {
        instructions = JSON.parse(method.instructions);
      } catch {
        instructions = [method.instructions];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: method.id,
        name: method.name,
        category: method.category,
        adminFee: method.adminFee,
        instructions,
        notes: [
          'Pastikan nominal transfer sesuai persis hingga 3 digit terakhir.',
          'Pembayaran diverifikasi otomatis 24 jam tanpa perlu kirim bukti transfer.',
          'Jika dalam 5 menit item belum masuk, hubungi CS kami dengan menyertakan Nomor Pesanan.',
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching payment instructions:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil instruksi pembayaran' },
      { status: 500 }
    );
  }
}
