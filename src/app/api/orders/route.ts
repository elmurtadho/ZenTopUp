import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, payments, games, items, promos, paymentMethods, notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gameId,
      gameSlug,
      itemId,
      gameUserId,
      serverId,
      whatsapp,
      email,
      paymentMethod: paymentMethodId,
      promoCode,
    } = body;

    // Ensure database is seeded
    await seedDatabase();

    // 1. Basic validation
    if (!gameUserId || !whatsapp || !paymentMethodId || (!itemId && !gameId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data pesanan tidak lengkap (User ID, WhatsApp, Item, dan Metode Pembayaran wajib diisi)',
        },
        { status: 400 }
      );
    }

    // 2. Find game & item
    let resolvedItem;
    if (itemId) {
      resolvedItem = db
        .select()
        .from(items)
        .where(eq(items.id, Number(itemId)))
        .get();
    }

    if (!resolvedItem) {
      return NextResponse.json(
        { success: false, message: 'Item game yang dipilih tidak valid' },
        { status: 404 }
      );
    }

    const resolvedGame = db
      .select()
      .from(games)
      .where(eq(games.id, resolvedItem.gameId))
      .get();

    if (!resolvedGame) {
      return NextResponse.json(
        { success: false, message: 'Game tidak ditemukan' },
        { status: 404 }
      );
    }

    // 3. Find payment method
    const resolvedMethod = db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, paymentMethodId.toLowerCase()))
      .get();

    const adminFee = resolvedMethod ? resolvedMethod.adminFee : 0;
    const itemPrice = resolvedItem.price;

    // 4. Calculate promo discount if applied
    let discountAmount = 0;
    let validPromoCode = null;

    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const normalizedPromo = promoCode.trim().toUpperCase();
      const promo = db
        .select()
        .from(promos)
        .where(and(eq(promos.code, normalizedPromo), eq(promos.isActive, true)))
        .get();

      if (promo && itemPrice >= promo.minPurchase) {
        if (!promo.gameSlug || promo.gameSlug === resolvedGame.slug) {
          validPromoCode = promo.code;
          if (promo.discountType === 'percent') {
            const calculated = Math.round((itemPrice * promo.amount) / 100);
            discountAmount = promo.maxDiscount
              ? Math.min(calculated, promo.maxDiscount)
              : calculated;
          } else {
            discountAmount = Math.min(itemPrice, promo.amount);
          }
        }
      }
    }

    // 5. Total amount
    const totalAmount = Math.max(0, itemPrice - discountAmount) + adminFee;

    // 6. Generate Unique Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ZEN-${Date.now().toString().slice(-4)}${randomSuffix}`;

    // 7. Insert into orders table
    db.insert(orders)
      .values({
        id: orderId,
        gameId: resolvedGame.id,
        itemId: resolvedItem.id,
        gameUserId: String(gameUserId),
        serverId: serverId ? String(serverId) : null,
        whatsapp: String(whatsapp),
        email: email ? String(email) : null,
        itemPrice,
        discountAmount,
        adminFee,
        totalAmount,
        promoCode: validPromoCode,
        paymentMethod: resolvedMethod ? resolvedMethod.name : paymentMethodId,
        status: 'pending',
      })
      .run();

    // 8. Generate payment reference & details
    const vaNumber = `8801${orderId.replace(/\D/g, '').padEnd(10, '7')}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    db.insert(payments)
      .values({
        orderId,
        method: resolvedMethod ? resolvedMethod.name : paymentMethodId,
        status: 'pending',
        amount: totalAmount,
        externalRef: vaNumber,
      })
      .run();

    // 9. Insert Notification
    db.insert(notifications)
      .values({
        orderId,
        type: 'order_created',
        title: `Pesanan ${orderId} Dibuat`,
        message: `Menunggu pembayaran sebesar Rp ${totalAmount.toLocaleString('id-ID')} untuk ${resolvedItem.name} (${resolvedGame.name})`,
      })
      .run();

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        game: resolvedGame.name,
        item: resolvedItem.name,
        gameUserId,
        serverId,
        whatsapp,
        itemPrice,
        discountAmount,
        adminFee,
        totalAmount,
        paymentMethod: resolvedMethod ? resolvedMethod.name : paymentMethodId,
        status: 'pending',
        paymentDetails: {
          vaNumber,
          amount: totalAmount,
          expiresAt,
        },
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat pesanan transaksi' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const whatsapp = searchParams.get('whatsapp');
    const status = searchParams.get('status');
    const gameId = searchParams.get('gameId');
    const gameSlug = searchParams.get('gameSlug');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') || 'latest';

    // Ensure database is seeded
    await seedDatabase();

    // Direct single order lookup
    if (orderId) {
      const order = db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .get();

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Pesanan tidak ditemukan' },
          { status: 404 }
        );
      }

      const game = db.select().from(games).where(eq(games.id, order.gameId)).get();
      const item = db.select().from(items).where(eq(items.id, order.itemId)).get();

      return NextResponse.json({
        success: true,
        data: {
          ...order,
          gameName: game ? game.name : 'Game',
          gameIcon: game ? game.iconUrl : '',
          gameSlug: game ? game.slug : '',
          itemName: item ? item.name : 'Item Top Up',
        },
      });
    }

    // Fetch all orders
    let allOrders = db.select().from(orders).all();

    // Fetch games & items lookup maps
    const allGames = db.select().from(games).all();
    const allItems = db.select().from(items).all();
    const gameMap = new Map(allGames.map((g) => [g.id, g]));
    const itemMap = new Map(allItems.map((i) => [i.id, i]));

    // Map enriched data
    let enriched = allOrders.map((o) => {
      const g = gameMap.get(o.gameId);
      const i = itemMap.get(o.itemId);
      return {
        ...o,
        gameName: g ? g.name : 'Game',
        gameIcon: g ? g.iconUrl : '',
        gameSlug: g ? g.slug : '',
        itemName: i ? i.name : 'Item Top Up',
      };
    });

    // 1. Filter by WhatsApp
    if (whatsapp) {
      enriched = enriched.filter((o) => o.whatsapp === whatsapp);
    }

    // 2. Filter by status
    if (status && status !== 'semua') {
      enriched = enriched.filter((o) => o.status === status);
    }

    // 3. Filter by game
    if (gameId) {
      enriched = enriched.filter((o) => o.gameId === Number(gameId));
    } else if (gameSlug && gameSlug !== 'semua') {
      enriched = enriched.filter((o) => o.gameSlug === gameSlug);
    }

    // 4. Search query (order ID, game user ID, game name, WhatsApp)
    if (q && q.trim()) {
      const search = q.toLowerCase().trim();
      enriched = enriched.filter(
        (o) =>
          o.id.toLowerCase().includes(search) ||
          o.gameUserId.toLowerCase().includes(search) ||
          o.gameName.toLowerCase().includes(search) ||
          o.whatsapp.includes(search)
      );
    }

    // 5. Sorting
    if (sort === 'oldest') {
      enriched.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    } else if (sort === 'amount-desc' || sort === 'price-desc') {
      enriched.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sort === 'amount-asc' || sort === 'price-asc') {
      enriched.sort((a, b) => a.totalAmount - b.totalAmount);
    } else {
      // Default: latest
      enriched.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    return NextResponse.json({
      success: true,
      data: enriched,
      total: enriched.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pesanan' },
      { status: 500 }
    );
  }
}
