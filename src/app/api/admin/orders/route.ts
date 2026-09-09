import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, games, items } from '@/db/schema';
import { desc, eq, like, or } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    let allOrders = await db
      .select({
        id: orders.id,
        gameId: orders.gameId,
        itemId: orders.itemId,
        gameUserId: orders.gameUserId,
        serverId: orders.serverId,
        whatsapp: orders.whatsapp,
        email: orders.email,
        itemPrice: orders.itemPrice,
        discountAmount: orders.discountAmount,
        adminFee: orders.adminFee,
        totalAmount: orders.totalAmount,
        promoCode: orders.promoCode,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        gameName: games.name,
        gameSlug: games.slug,
        gameIcon: games.iconUrl,
        itemName: items.name,
      })
      .from(orders)
      .leftJoin(games, eq(orders.gameId, games.id))
      .leftJoin(items, eq(orders.itemId, items.id))
      .orderBy(desc(orders.createdAt));

    if (status && status !== 'semua') {
      allOrders = allOrders.filter((o) => o.status === status);
    }

    if (q && q.trim()) {
      const query = q.toLowerCase().trim();
      allOrders = allOrders.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          (o.gameName && o.gameName.toLowerCase().includes(query)) ||
          o.gameUserId.toLowerCase().includes(query) ||
          o.whatsapp.includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      data: allOrders,
    });
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat daftar pesanan', error: error.message },
      { status: 500 }
    );
  }
}
