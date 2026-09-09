import { NextResponse } from 'next/server';
import { db } from '@/db';
import { games, orders, promos, items } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    await seedDatabase();

    // Fetch all orders
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    
    // Fetch all games
    const allGames = await db.select().from(games);
    
    // Fetch all promos
    const allPromos = await db.select().from(promos);
    
    // Fetch all items count
    const allItems = await db.select().from(items);

    // Calculate revenue & stats
    const successfulOrders = allOrders.filter(
      (o) => o.status === 'berhasil' || o.status === 'success'
    );
    const pendingOrders = allOrders.filter(
      (o) => o.status === 'pending' || o.status === 'menunggu'
    );
    const failedOrders = allOrders.filter(
      (o) => o.status === 'gagal' || o.status === 'failed'
    );

    const totalRevenue = successfulOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const successRate =
      allOrders.length > 0
        ? Math.round((successfulOrders.length / allOrders.length) * 100)
        : 100;

    const activeGamesCount = allGames.filter((g) => g.isActive).length;
    const activePromosCount = allPromos.filter((p) => p.isActive).length;

    // Recent 5 transactions
    const recentOrders = allOrders.slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: allOrders.length,
        successfulOrdersCount: successfulOrders.length,
        pendingOrdersCount: pendingOrders.length,
        failedOrdersCount: failedOrders.length,
        successRate,
        totalGames: allGames.length,
        activeGamesCount,
        totalItems: allItems.length,
        activePromosCount,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memuat statistik admin',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
