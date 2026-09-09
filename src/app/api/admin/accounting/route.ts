import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, games, items, payments } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'all', 'today', '7days', 'month', 'custom'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Fetch all orders with item and game info
    const allOrders = await db
      .select({
        id: orders.id,
        gameId: orders.gameId,
        itemId: orders.itemId,
        gameUserId: orders.gameUserId,
        serverId: orders.serverId,
        whatsapp: orders.whatsapp,
        itemPrice: orders.itemPrice,
        discountAmount: orders.discountAmount,
        adminFee: orders.adminFee,
        totalAmount: orders.totalAmount,
        promoCode: orders.promoCode,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        createdAt: orders.createdAt,
        gameName: games.name,
        gameSlug: games.slug,
        itemName: items.name,
        itemCostPrice: items.costPrice,
      })
      .from(orders)
      .leftJoin(games, eq(orders.gameId, games.id))
      .leftJoin(items, eq(orders.itemId, items.id))
      .orderBy(desc(orders.createdAt));

    // Filter by date
    const now = new Date();
    let filteredOrders = allOrders;

    if (period === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      filteredOrders = allOrders.filter(
        (o) => o.createdAt && o.createdAt.startsWith(todayStr)
      );
    } else if (period === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      filteredOrders = allOrders.filter(
        (o) => o.createdAt && new Date(o.createdAt) >= sevenDaysAgo
      );
    } else if (period === 'month') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredOrders = allOrders.filter(
        (o) => o.createdAt && new Date(o.createdAt) >= firstDayOfMonth
      );
    } else if (period === 'custom' && startDate) {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate + 'T23:59:59') : now;
      filteredOrders = allOrders.filter((o) => {
        if (!o.createdAt) return false;
        const d = new Date(o.createdAt);
        return d >= start && d <= end;
      });
    }

    // Accounting Calculations
    const successfulOrders = filteredOrders.filter((o) => o.status === 'berhasil');

    let totalGrossSales = 0;
    let totalCogs = 0;
    let totalDiscount = 0;
    let totalAdminFees = 0;

    for (const ord of successfulOrders) {
      const saleAmount = ord.totalAmount || 0;
      totalGrossSales += saleAmount;
      totalDiscount += ord.discountAmount || 0;
      totalAdminFees += ord.adminFee || 0;

      // Calculate COGS / Modal: use itemCostPrice if set > 0, else default to 90% of base itemPrice
      const cost =
        ord.itemCostPrice && ord.itemCostPrice > 0
          ? ord.itemCostPrice
          : Math.round((ord.itemPrice || 0) * 0.9);
      totalCogs += cost;
    }

    const netProfit = totalGrossSales - totalCogs;
    const profitMargin = totalGrossSales > 0 ? (netProfit / totalGrossSales) * 100 : 0;

    // Breakdown per Game
    const gameMap: Record<string, { name: string; count: number; omset: number; modal: number; profit: number }> = {};
    for (const ord of successfulOrders) {
      const gName = ord.gameName || 'Lainnya';
      if (!gameMap[gName]) {
        gameMap[gName] = { name: gName, count: 0, omset: 0, modal: 0, profit: 0 };
      }
      const cost =
        ord.itemCostPrice && ord.itemCostPrice > 0
          ? ord.itemCostPrice
          : Math.round((ord.itemPrice || 0) * 0.9);
      const omset = ord.totalAmount || 0;
      gameMap[gName].count += 1;
      gameMap[gName].omset += omset;
      gameMap[gName].modal += cost;
      gameMap[gName].profit += omset - cost;
    }

    // Breakdown per Payment Method
    const paymentMap: Record<string, { method: string; count: number; volume: number }> = {};
    for (const ord of successfulOrders) {
      const pMethod = ord.paymentMethod || 'Unknown';
      if (!paymentMap[pMethod]) {
        paymentMap[pMethod] = { method: pMethod, count: 0, volume: 0 };
      }
      paymentMap[pMethod].count += 1;
      paymentMap[pMethod].volume += ord.totalAmount || 0;
    }

    // Ledger for Excel Export
    const ledger = filteredOrders.map((o) => {
      const cost =
        o.itemCostPrice && o.itemCostPrice > 0
          ? o.itemCostPrice
          : Math.round((o.itemPrice || 0) * 0.9);
      const profit = o.status === 'berhasil' ? (o.totalAmount || 0) - cost : 0;

      return {
        orderId: o.id,
        createdAt: o.createdAt || '',
        gameName: o.gameName || 'Game #' + o.gameId,
        itemName: o.itemName || 'Item #' + o.itemId,
        gameUserId: o.gameUserId,
        serverId: o.serverId || '-',
        whatsapp: o.whatsapp,
        paymentMethod: o.paymentMethod,
        status: o.status,
        itemPrice: o.itemPrice,
        discountAmount: o.discountAmount,
        adminFee: o.adminFee,
        totalAmount: o.totalAmount,
        cogs: cost,
        profit: profit,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        period,
        summary: {
          totalOrders: filteredOrders.length,
          successCount: successfulOrders.length,
          pendingCount: filteredOrders.filter(
            (o) => o.status === 'pending' || o.status === 'menunggu'
          ).length,
          failedCount: filteredOrders.filter((o) => o.status === 'gagal').length,
          totalGrossSales,
          totalCogs,
          netProfit,
          profitMargin: Number(profitMargin.toFixed(1)),
          totalDiscount,
          totalAdminFees,
        },
        gameBreakdown: Object.values(gameMap).sort((a, b) => b.omset - a.omset),
        paymentBreakdown: Object.values(paymentMap).sort((a, b) => b.volume - a.volume),
        ledger,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin accounting:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses kalkulasi keuangan', error: error.message },
      { status: 500 }
    );
  }
}
