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
    let periodLabel = 'Semua Waktu';

    const parseOrderDate = (dateStr: string | null) => {
      if (!dateStr) return null;
      // Handle both SQLite CURRENT_TIMESTAMP "YYYY-MM-DD HH:MM:SS" and ISO "YYYY-MM-DDTHH:MM:SS"
      const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
      const d = new Date(normalized);
      return isNaN(d.getTime()) ? new Date(dateStr) : d;
    };

    const formatDateIndo = (date: Date) => {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate + 'T00:00:00') : new Date('2020-01-01');
      const end = endDate ? new Date(endDate + 'T23:59:59.999') : new Date();

      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        if (!d) return false;
        return d >= start && d <= end;
      });

      if (startDate && endDate) {
        periodLabel = `${formatDateIndo(start)} - ${formatDateIndo(end)}`;
      } else if (startDate) {
        periodLabel = `Mulai ${formatDateIndo(start)}`;
      } else if (endDate) {
        periodLabel = `Hingga ${formatDateIndo(end)}`;
      }
    } else if (period === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= startOfDay && d <= endOfDay;
      });
      periodLabel = `Hari Ini (${formatDateIndo(now)})`;
    } else if (period === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      const endOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= startOfDay && d <= endOfDay;
      });
      periodLabel = `Kemarin (${formatDateIndo(yesterday)})`;
    } else if (period === '7days') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= sevenDaysAgo && d <= now;
      });
      periodLabel = `7 Hari Terakhir (${formatDateIndo(sevenDaysAgo)} - ${formatDateIndo(now)})`;
    } else if (period === '30days') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= thirtyDaysAgo && d <= now;
      });
      periodLabel = `30 Hari Terakhir (${formatDateIndo(thirtyDaysAgo)} - ${formatDateIndo(now)})`;
    } else if (period === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= firstDay && d <= now;
      });
      periodLabel = `Bulan Ini (${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})`;
    } else if (period === 'last_month') {
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= firstDayLastMonth && d <= lastDayLastMonth;
      });
      periodLabel = `Bulan Lalu (${firstDayLastMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})`;
    } else if (period === 'this_year') {
      const firstDayYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      filteredOrders = allOrders.filter((o) => {
        const d = parseOrderDate(o.createdAt);
        return d && d >= firstDayYear && d <= now;
      });
      periodLabel = `Tahun Ini (${now.getFullYear()})`;
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
        periodLabel,
        startDate: startDate || null,
        endDate: endDate || null,
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
