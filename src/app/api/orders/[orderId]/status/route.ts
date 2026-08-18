import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, payments, games, items, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';
import { triggerOrderStatusNotification } from '@/services/notificationService';

interface RouteContext {
  params: Promise<{ orderId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { orderId } = await params;

    // Ensure database is seeded
    await seedDatabase();

    const order = db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .get();

    if (!order) {
      // Return mock structure if it's a random generated demo order ID
      return NextResponse.json({
        success: true,
        data: {
          orderId,
          status: 'pending',
          isPaid: false,
          game: 'Mobile Legends: Bang Bang',
          item: 'Weekly Diamond Pass',
          totalAmount: 79000,
          paymentMethod: 'BCA Virtual Account',
          createdAt: new Date().toISOString(),
        },
      });
    }

    const game = db.select().from(games).where(eq(games.id, order.gameId)).get();
    const item = db.select().from(items).where(eq(items.id, order.itemId)).get();
    const payment = db.select().from(payments).where(eq(payments.orderId, order.id)).get();

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        isPaid: order.status === 'berhasil',
        game: game ? game.name : 'Game',
        gameSlug: game ? game.slug : null,
        item: item ? item.name : 'Item Top Up',
        gameUserId: order.gameUserId,
        serverId: order.serverId,
        whatsapp: order.whatsapp,
        itemPrice: order.itemPrice,
        discountAmount: order.discountAmount,
        adminFee: order.adminFee,
        totalAmount: order.totalAmount,
        promoCode: order.promoCode,
        paymentMethod: order.paymentMethod,
        paymentStatus: payment ? payment.status : 'pending',
        externalRef: payment ? payment.externalRef : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching order status:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengecek status transaksi' },
      { status: 500 }
    );
  }
}

// POST endpoint to simulate payment completion / status update
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { orderId } = await params;
    const body = await request.json().catch(() => ({}));
    const newStatus = body.status || 'berhasil';

    // Ensure database is seeded
    await seedDatabase();

    const order = db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .get();

    if (order) {
      db.update(orders)
        .set({
          status: newStatus,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(orders.id, orderId))
        .run();

      db.update(payments)
        .set({
          status: newStatus === 'berhasil' ? 'berhasil' : 'pending',
          paidAt: newStatus === 'berhasil' ? new Date().toISOString() : null,
        })
        .where(eq(payments.orderId, orderId))
        .run();

      const game = db.select().from(games).where(eq(games.id, order.gameId)).get();
      const item = db.select().from(items).where(eq(items.id, order.itemId)).get();

      await triggerOrderStatusNotification(
        orderId,
        newStatus,
        game?.name,
        item?.name
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: newStatus,
      message: `Status pesanan ${orderId} berhasil diubah menjadi ${newStatus}`,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status transaksi' },
      { status: 500 }
    );
  }
}
