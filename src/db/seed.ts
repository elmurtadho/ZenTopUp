import { db, initDatabase } from './index';
import { games, items, promos, paymentMethods, orders, payments, notifications, users, banners, webPopups } from './schema';
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

    // Sync games and items with authentic assets and real-world prices
    console.log('Syncing games and items with authentic assets and real-world prices...');
    for (const g of MOCK_GAMES) {
      const existing = await db.select().from(games).where(eq(games.slug, g.slug));
      let gameId: number;

      if (existing.length > 0) {
        gameId = existing[0].id;
        await db
          .update(games)
          .set({
            name: g.name,
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
          .where(eq(games.id, gameId));
      } else {
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
        gameId = inserted[0]?.id;
      }

      if (gameId && g.items && g.items.length > 0) {
        const existingItems = await db.select().from(items).where(eq(items.gameId, gameId));

        for (const item of g.items) {
          const match = existingItems.find((ei) => ei.name === item.name);
          if (match) {
            await db
              .update(items)
              .set({
                nominal: item.nominal,
                price: item.price,
                originalPrice: item.originalPrice || null,
                currency: item.currency || 'IDR',
                isPopular: item.isPopular || false,
                isActive: item.isActive,
              })
              .where(eq(items.id, match.id));
          } else {
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
    }

    // Sync promos
    for (const p of MOCK_PROMOS) {
      const existingPromo = await db.select().from(promos).where(eq(promos.code, p.code));
      if (existingPromo.length > 0) {
        await db
          .update(promos)
          .set({
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
          })
          .where(eq(promos.id, existingPromo[0].id));
      } else {
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
          id: 'GEM-928174',
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
          id: 'GEM-847291',
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
          id: 'GEM-761928',
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
          id: 'GEM-618290',
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
          promoCode: 'GEMDISKON10',
          paymentMethod: 'DANA',
          status: 'berhasil',
        },
        {
          id: 'GEM-559281',
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
          id: 'GEM-448102',
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
          orderId: 'GEM-928174',
          type: 'order_success',
          title: 'Top Up Sukses — 86 Diamond MLBB',
          message: 'Pembayaran QRIS berhasil diverifikasi. 86 Diamond telah dikirimkan ke ID 128492019 (2648).',
          linkHref: '/riwayat/GEM-928174',
          linkText: 'Lihat Invoice',
          isRead: false,
        },
        {
          orderId: 'GEM-847291',
          type: 'order_created',
          title: 'Menunggu Pembayaran — 625 Valorant Points',
          message: 'Selesaikan transfer BCA Virtual Account sebelum batas waktu berakhir.',
          linkHref: '/pembayaran/GEM-847291',
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

    // Check if banners table has data
    const existingBanners = await db.select().from(banners);
    if (existingBanners.length === 0) {
      console.log('Seeding initial event banners...');
      const initialBanners = [
        {
          title: 'Diskon Kilat MLBB 30%',
          subtitle: 'Top up Diamond Mobile Legends termurah se-Indonesia proses instan 1 detik',
          imageUrl: '/images/games/mlbb-banner.webp',
          targetUrl: '/game/mobile-legends',
          badgeText: 'HOT PROMO',
          position: 1,
          isActive: true,
        },
        {
          title: 'Valorant Night Market Hemat',
          subtitle: 'Beli Valorant Points dapatkan diskon potongan langsung hingga Rp 50.000',
          imageUrl: '/images/games/valo-banner.jpg',
          targetUrl: '/game/valorant',
          badgeText: 'DISCOUNT 15%',
          position: 2,
          isActive: true,
        },
        {
          title: 'Free Fire Booyah Pass',
          subtitle: 'Borong Diamond Free Fire murah meriah legal & aman 100% anti minus',
          imageUrl: '/images/games/ff-banner.webp',
          targetUrl: '/game/free-fire',
          badgeText: 'FLASH SALE',
          position: 3,
          isActive: true,
        },
      ];

      for (const b of initialBanners) {
        await db.insert(banners).values(b);
      }
    }

    // Check if web_popups table has data
    const existingPopup = await db.select().from(webPopups);
    if (existingPopup.length === 0) {
      console.log('Seeding default welcome popup...');
      await db.insert(webPopups).values({
        title: '🎉 Promo Spesial Selamat Datang!',
        tag: 'DISCOUNT MEMBER BARU',
        description:
          'Dapatkan potongan harga spesial pengguna baru hingga Rp 15.000 untuk semua game populer dengan kode voucher: TOKOGEMBARU. Proses instan kilat 1 detik!',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        buttonText: 'Ambil Voucher & Top Up Sekarang',
        buttonUrl: '/promo',
        isActive: true,
      });
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
