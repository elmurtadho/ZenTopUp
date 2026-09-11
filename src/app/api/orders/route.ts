import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, payments, games, items, promos, paymentMethods, notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';
import { MOCK_GAMES } from '@/data/mockGames';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gameId,
      gameSlug,
      itemId,
      itemName,
      gameUserId,
      serverId,
      whatsapp,
      email,
      paymentMethod: paymentMethodId,
      promoCode,
      userId,
      userRole,
      status: requestedStatus,
      customOrderId,
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
    let resolvedGame;
    if (gameId && !isNaN(Number(gameId))) {
      const gRes = await db.select().from(games).where(eq(games.id, Number(gameId)));
      resolvedGame = gRes[0];
    }
    if (!resolvedGame && gameSlug) {
      const gRes = await db.select().from(games).where(eq(games.slug, String(gameSlug)));
      resolvedGame = gRes[0];
    }

    let resolvedItem;
    if (itemId && !isNaN(Number(itemId))) {
      const itemResults = await db
        .select()
        .from(items)
        .where(eq(items.id, Number(itemId)));
      resolvedItem = itemResults[0];
    }

    // If resolvedItem is not found yet, find within resolvedGame by itemName or mock item ID
    if (!resolvedItem && resolvedGame) {
      const gameItems = await db
        .select()
        .from(items)
        .where(eq(items.gameId, resolvedGame.id));

      if (itemName) {
        resolvedItem = gameItems.find(
          (i) => i.name.toLowerCase() === String(itemName).toLowerCase()
        );
      }

      if (!resolvedItem && itemId) {
        // Match string item id (e.g. 'ml-1') against MOCK_GAMES
        for (const mg of MOCK_GAMES) {
          const mItem = mg.items?.find((mi) => mi.id === itemId);
          if (mItem) {
            resolvedItem = gameItems.find(
              (i) => i.name.toLowerCase() === mItem.name.toLowerCase()
            );
            break;
          }
        }
      }

      if (!resolvedItem && gameItems.length > 0) {
        resolvedItem = gameItems[0];
      }
    }

    if (!resolvedItem) {
      return NextResponse.json(
        { success: false, message: 'Item game yang dipilih tidak valid' },
        { status: 404 }
      );
    }

    if (!resolvedGame) {
      const gameResults = await db
        .select()
        .from(games)
        .where(eq(games.id, resolvedItem.gameId));
      resolvedGame = gameResults[0];
    }

    if (!resolvedGame) {
      return NextResponse.json(
        { success: false, message: 'Game tidak ditemukan' },
        { status: 404 }
      );
    }

    // 3. Find payment method & determine item price according to role
    let isSaldo = paymentMethodId.toLowerCase() === 'saldo';
    const methodResults = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, paymentMethodId.toLowerCase()));

    const resolvedMethod = methodResults[0];
    const paymentMethodName = isSaldo 
      ? 'Saldo Dompet TokoGem' 
      : (resolvedMethod ? resolvedMethod.name : paymentMethodId);

    const adminFee = isSaldo ? 0 : (resolvedMethod ? resolvedMethod.adminFee : 0);

    let itemPrice = resolvedItem.price;
    if (userRole === 'reseller' && resolvedItem.resellerPrice) {
      itemPrice = resolvedItem.resellerPrice;
    } else if (userRole === 'member' && resolvedItem.memberPrice) {
      itemPrice = resolvedItem.memberPrice;
    }

    // 4. Calculate promo discount if applied with strict expiration validation
    let discountAmount = 0;
    let validPromoCode = null;

    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const normalizedPromo = promoCode.trim().toUpperCase();
      const promoResults = await db
        .select()
        .from(promos)
        .where(and(eq(promos.code, normalizedPromo), eq(promos.isActive, true)));

      const promo = promoResults[0];

      if (promo) {
        const now = new Date();
        const isExpired = promo.endsAt && new Date(promo.endsAt) < now;
        const notStarted = promo.startsAt && new Date(promo.startsAt) > now;

        if (!isExpired && !notStarted && itemPrice >= promo.minPurchase) {
          const gameMatches =
            !promo.gameSlug ||
            promo.gameSlug === resolvedGame.slug ||
            (promo.gameSlug.includes('mobile-legends') && resolvedGame.slug.includes('mobile-legends'));

          if (gameMatches) {
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
    }

    // 5. Total amount
    const totalAmount = Math.max(0, itemPrice - discountAmount) + adminFee;

    // 6. Generate Unique Order ID or use provided one
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = customOrderId || `GEM-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const finalStatus = (['berhasil', 'gagal', 'diproses', 'pending'].includes(requestedStatus))
      ? requestedStatus
      : (isSaldo ? 'berhasil' : 'pending');

    // 7. Insert into orders table
    await db.insert(orders).values({
      id: orderId,
      userId: userId ? Number(userId) : null,
      userRole: userRole || 'guest',
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
      paymentMethod: paymentMethodName,
      status: finalStatus,
    });

    // 8. Generate payment reference & details
    const vaNumber = `8801${orderId.replace(/\D/g, '').padEnd(10, '7')}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await db.insert(payments).values({
      orderId,
      method: paymentMethodName,
      status: finalStatus === 'berhasil' ? 'berhasil' : (finalStatus === 'gagal' ? 'gagal' : 'pending'),
      amount: totalAmount,
      externalRef: vaNumber,
      paidAt: finalStatus === 'berhasil' ? new Date().toISOString() : null,
    });

    // 9. Insert Notification using notificationService
    const { triggerOrderStatusNotification } = await import('@/services/notificationService');
    await triggerOrderStatusNotification(orderId, finalStatus, resolvedGame.name, resolvedItem.name);

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
      const orderResults = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      const order = orderResults[0];

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Pesanan tidak ditemukan' },
          { status: 404 }
        );
      }

      const gameResults = await db.select().from(games).where(eq(games.id, order.gameId));
      const itemResults = await db.select().from(items).where(eq(items.id, order.itemId));
      const game = gameResults[0];
      const item = itemResults[0];

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
    const allOrders = await db.select().from(orders);

    // Fetch games & items lookup maps
    const allGames = await db.select().from(games);
    const allItems = await db.select().from(items);
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
