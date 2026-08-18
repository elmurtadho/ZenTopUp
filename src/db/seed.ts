import { db, initDatabase } from './index';
import { games, items, promos, paymentMethods, orders, payments, notifications, users } from './schema';
import { MOCK_GAMES, MOCK_PROMOS } from '../data/mockGames';
import { MOCK_PAYMENT_METHODS } from '../data/mockPayments';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  await initDatabase();

  try {
    // Check if users table already has data
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      console.log('Seeding initial demo users...');
      await db.insert(users).values({
        id: 1,
        name: 'Reza Gamers ID',
        email: 'reza.gamers@example.com',
        phone: '081234567890',
        passwordHash: 'demo12345',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
        memberLevel: 'VIP Platinum',
        role: 'user',
      });
    }

    // Check if games table already has data
    const existingGames = await db.select().from(games);
    if (existingGames.length === 0) {
      console.log('Seeding initial games and items...');

      for (const g of MOCK_GAMES) {
        const inserted = await db
          .insert(games)
          .values({
            name: g.name,
            slug: g.slug,
            publisher: g.publisher,
            category: g.category,
            iconUrl: g.iconUrl,
            bannerUrl: g.bannerUrl,
            tagline: g.tagline || '',
            isPopular: g.isPopular,
            rating: g.rating || 4.8,
            minPrice: g.minPrice,
            serverRequired: g.serverRequired || false,
            serverList: g.serverList ? JSON.stringify(g.serverList) : null,
            isActive: g.isActive,
          })
          .returning({ id: games.id });

        const gameId = inserted[0]?.id;

        if (gameId && g.items && g.items.length > 0) {
          for (const item of g.items) {
            await db.insert(items).values({
              gameId: gameId,
              name: item.name,
              nominal: item.nominal,
              price: item.price,
              originalPrice: item.originalPrice || null,
              currency: item.currency || 'IDR',
              isPopular: item.isPopular || false,
              isActive: item.isActive,
            });
          }
        }
      }

      for (const p of MOCK_PROMOS) {
        await db.insert(promos).values({
          code: p.code,
          title: p.title,
          description: p.description,
          discountType: p.discountType,
          amount: p.amount,
          minPurchase: p.minPurchase,
          maxDiscount: p.maxDiscount || null,
          imageUrl: p.imageUrl,
          gameSlug: p.gameSlug || null,
          startsAt: p.startsAt,
          endsAt: p.endsAt,
          terms: JSON.stringify(p.terms),
          isActive: p.isActive,
        });
      }
    }

    // Check if paymentMethods table has data
    const existingMethods = await db.select().from(paymentMethods);
    if (existingMethods.length === 0) {
      console.log('Seeding initial payment methods...');
      for (const m of MOCK_PAYMENT_METHODS) {
        await db.insert(paymentMethods).values({
          id: m.id,
          name: m.name,
          category: m.category,
          iconUrl: m.icon || 'https://images.unsplash.com/photo-1556742049-0a67e557224f?w=100',
          adminFee: m.adminFee || 0,
          minAmount: m.minAmount || 1000,
          maxAmount: m.maxAmount || 50000000,
          instructions: JSON.stringify(m.instructions),
          isActive: m.isActive !== undefined ? m.isActive : true,
        });
      }
    }

    // Check if orders table has data
    const existingOrders = await db.select().from(orders);
    if (existingOrders.length === 0) {
      console.log('Seeding initial demo orders...');
      const demoOrders = [
        {
          id: 'ZEN-928174',
          gameId: 1,
          itemId: 1,
          gameUserId: '128492019',
          serverId: '2648',
          whatsapp: '081234567890',
          email: 'reza.gamers@example.com',
          itemPrice: 28000,
          discountAmount: 0,
          adminFee: 0,
          totalAmount: 28000,
          promoCode: null,
          paymentMethod: 'QRIS (Semua E-Wallet & Bank)',
          status: 'berhasil',
        },
        {
          id: 'ZEN-847291',
          gameId: 2,
          itemId: 6,
          gameUserId: 'ShadowBlade#IDN',
          serverId: null,
          whatsapp: '081234567890',
          email: 'reza.gamers@example.com',
          itemPrice: 110000,
          discountAmount: 0,
          adminFee: 0,
          totalAmount: 110000,
          promoCode: null,
          paymentMethod: 'BCA Virtual Account',
          status: 'pending',
        },
        {
          id: 'ZEN-761928',
          gameId: 3,
          itemId: 11,
          gameUserId: '987654321',
          serverId: null,
          whatsapp: '081234567890',
          email: 'reza.gamers@example.com',
          itemPrice: 95000,
          discountAmount: 0,
          adminFee: 1000,
          totalAmount: 96000,
          promoCode: null,
          paymentMethod: 'GoPay',
          status: 'berhasil',
        },
        {
          id: 'ZEN-618290',
          gameId: 4,
          itemId: 15,
          gameUserId: '812938475',
          serverId: 'Asia',
          whatsapp: '081234567890',
          email: 'reza.gamers@example.com',
          itemPrice: 65000,
          discountAmount: 10000,
          adminFee: 0,
          totalAmount: 55000,
          promoCode: 'ZENDISKON10',
          paymentMethod: 'DANA',
          status: 'berhasil',
        },
        {
          id: 'ZEN-559281',
          gameId: 5,
          itemId: 18,
          gameUserId: '519283741',
          serverId: null,
          whatsapp: '081234567890',
          email: 'reza.gamers@example.com',
          itemPrice: 145000,
          discountAmount: 0,
          adminFee: 1500,
          totalAmount: 146500,
          promoCode: null,
          paymentMethod: 'Mandiri Virtual Account',
          status: 'pending',
        },
        {
          id: 'ZEN-448102',
          gameId: 1,
          itemId: 3,
          gameUserId: '128492019',
          serverId: '2648',
          whatsapp: '081234567890',
          email: 'reza.gamers@example.com',
          itemPrice: 75000,
          discountAmount: 0,
          adminFee: 2500,
          totalAmount: 77500,
          promoCode: null,
          paymentMethod: 'Indomaret',
          status: 'gagal',
        },
      ];

      for (const o of demoOrders) {
        await db.insert(orders).values(o);
        await db.insert(payments).values({
          orderId: o.id,
          method: o.paymentMethod,
          status: o.status === 'berhasil' ? 'berhasil' : o.status === 'pending' ? 'pending' : 'gagal',
          amount: o.totalAmount,
          externalRef: `8801${o.id.replace(/\D/g, '').padEnd(10, '7')}`,
          paidAt: o.status === 'berhasil' ? new Date().toISOString() : null,
        });
      }
    }

    // Check if notifications table has data
    const existingNotifications = await db.select().from(notifications);
    if (existingNotifications.length === 0) {
      console.log('Seeding initial notifications...');
      const demoNotifs = [
        {
          orderId: 'ZEN-928174',
          type: 'order_success',
          title: 'Top Up Sukses — 86 Diamond MLBB',
          message: 'Pembayaran QRIS berhasil diverifikasi. 86 Diamond telah dikirimkan ke ID 128492019 (2648).',
          linkHref: '/riwayat/ZEN-928174',
          linkText: 'Lihat Invoice',
          isRead: false,
        },
        {
          orderId: 'ZEN-847291',
          type: 'order_created',
          title: 'Menunggu Pembayaran — 625 Valorant Points',
          message: 'Selesaikan transfer BCA Virtual Account sebelum batas waktu berakhir.',
          linkHref: '/pembayaran/ZEN-847291',
          linkText: 'Bayar Sekarang',
          isRead: false,
        },
        {
          orderId: null,
          type: 'promo',
          title: 'Flash Sale Weekend: Diskon Hingga 30%!',
          message: 'Gunakan kode voucher FLASHMLBB untuk top up diamond MLBB & Valorant lebih hemat.',
          linkHref: '/promo',
          linkText: 'Klaim Voucher',
          isRead: false,
        },
        {
          orderId: null,
          type: 'system',
          title: 'Maintenance Server Game Mobile Legends',
          message: 'Server Moonton dijadwalkan maintenance pada tanggal 18 Agustus 2026 pukul 01:00 - 04:00 WIB.',
          linkHref: '/notifikasi/4',
          linkText: 'Pelajari Selengkapnya',
          isRead: true,
        },
      ];

      for (const n of demoNotifs) {
        await db.insert(notifications).values(n);
      }
    }

    console.log('Database verification and seed check completed.');
  } catch (err) {
    console.error('Error during database seed:', err);
  }
}

// Auto seed when executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('seed')) {
  seedDatabase().catch(console.error);
}
