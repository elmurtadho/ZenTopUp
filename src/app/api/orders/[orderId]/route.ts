import { NextRequest, NextResponse } from 'next/server';
import { db, initDatabase } from '@/db';
import { orders, games, items, payments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Ensure database is initialized & seeded
    await seedDatabase();

    // 1. Fetch order
    const order = db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .get();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: `Transaksi dengan ID ${orderId} tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    // 2. Fetch associated game
    const game = db
      .select()
      .from(games)
      .where(eq(games.id, order.gameId))
      .get();

    // 3. Fetch associated item
    const item = db
      .select()
      .from(items)
      .where(eq(items.id, order.itemId))
      .get();

    // 4. Fetch associated payment
    const payment = db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .get();

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        game: game
          ? {
              id: game.id,
              name: game.name,
              slug: game.slug,
              publisher: game.publisher,
              iconUrl: game.iconUrl,
              bannerUrl: game.bannerUrl,
            }
          : null,
        item: item
          ? {
              id: item.id,
              name: item.name,
              nominal: item.nominal,
              price: item.price,
              currency: item.currency,
              isPopular: item.isPopular,
            }
          : null,
        payment: payment
          ? {
              id: payment.id,
              method: payment.method,
              status: payment.status,
              amount: payment.amount,
              externalRef: payment.externalRef,
              paidAt: payment.paidAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail transaksi' },
      { status: 500 }
    );
  }
}
