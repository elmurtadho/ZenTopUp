import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { paymentMethods } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { name, adminFee, minAmount, maxAmount, isActive, instructions } = body;

    const existing = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    if (!existing.length) {
      return NextResponse.json({ success: false, message: 'Metode pembayaran tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (adminFee !== undefined) updateData.adminFee = Number(adminFee);
    if (minAmount !== undefined) updateData.minAmount = Number(minAmount);
    if (maxAmount !== undefined) updateData.maxAmount = Number(maxAmount);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (instructions !== undefined) {
      updateData.instructions = Array.isArray(instructions) ? JSON.stringify(instructions) : instructions;
    }

    const updated = await db
      .update(paymentMethods)
      .set(updateData)
      .where(eq(paymentMethods.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Metode pembayaran berhasil diperbarui!',
      data: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
